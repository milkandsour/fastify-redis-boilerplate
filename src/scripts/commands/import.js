const fs = require('fs');
/* eslint-disable */
const JSONStream = require('JSONStream');
/* eslint-enable */
const Redis = require('ioredis');
const { Review } = require('../../server/models');

class Routine {
  constructor({ json }) {
    this.redis = new Redis(
      process.env.REDIS_PORT || 6379,
      process.env.REDIS_HOST || '127.0.0.1',
    );
    this.queue = [];
    this.results = [];
    this.file = fs.createReadStream(json);
  }

  process() {
    this.results = [];
    const { file } = this;
    return new Promise((resolve, reject) => {
      const stream = file.pipe(JSONStream.parse('*'));
      stream.on('data', async (data) => {
        const { queue, results } = this;
        queue.push(data);
        if (queue.length <= 99) return;
        stream.pause();
        this.queue = [];
        this.results = results.concat(await this.store(queue));
        stream.resume();
      });
      stream.on('end', async () => {
        const { queue, results } = this;
        if (queue.length !== 0) this.results = results.concat(await this.store(queue));
        this.queue = [];
        resolve(results);
      });
      stream.on('error', reject);
    });
  }

  async store(items) {
    const { redis } = this;
    const promises = [];
    for (const item of items) {
      const {
        parents = [], id: key, traveledWith: along, entryDate: submission,
        travelDate: travel, ratings = {}, titles, texts, user, locale,
      } = item;
      const { general: g = {}, aspects } = ratings;
      const { general } = g;
      for (const parent of parents) {
        const { id: accomodation } = parent;
        const tmp = new Review({
          redis,
          key,
          accomodation,
          along,
          submission,
          travel,
          general,
          aspects,
          titles,
          texts,
          user,
          locale,
        });
        promises.push(tmp.store());
      }
    }
    return Promise.all(promises);
  }
}


exports.command = 'import <json>';
exports.desc = 'Populate redis with reviews based on the <json> file';
exports.builder = {};
exports.handler = async (argv) => {
  const { json } = argv;
  const routine = new Routine({ json });
  try {
    const results = await routine.process();
    /* eslint-disable */
    console.log(`Done processing ${results.length} items (hopefully successfully)`);
    /* eslint-enable */
    process.exit(0);
  } catch (e) {
    process.exit(1);
  }
};
