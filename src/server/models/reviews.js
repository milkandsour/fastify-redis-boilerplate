const Review = require('./review');

class Reviews {
  constructor({
    redis, accomodation, order = 'travels', offset = 0, limit = 10, along, from, to = 0, collection = [],
  }) {
    this.redis = redis;
    this.collection = collection;
    this.along = along;
    this.order = order;
    this.accomodation = accomodation;
    this.intersection = 'tmp';
    this.offset = offset;
    this.limit = limit;
    this.from = from;
    this.to = to;
    this.tmp = {
      more: [], general: 0, aspects: {}, weight: 0,
    };
  }

  toJSON() {
    const { collection, scores } = this;
    return { collection, scores };
  }

  get scores() {
    const { tmp } = this;
    const {
      more, general, aspects, weight,
    } = tmp;
    return {
      general: general / weight,
      aspects: Object.keys(aspects).reduce((acc, key) => {
        const aspect = aspects[key];
        acc[key] = { general: aspect.general && aspect.general / aspect.weight };
        more.forEach((type) => {
          const category = aspects[key][type];
          acc[key][type] = category.general && category.general / category.weight;
        });
        return acc;
      }, {}),
      ...more.reduce((acc, key) => {
        acc[key] = tmp[key].general / tmp[key].weight;
        return acc;
      }, {}),

    };
  }

  count({
    general, aspects, weight, along = 'no',
  }) {
    const { tmp } = this;
    tmp.general += general;
    tmp.weight += weight;
    if (!(along in tmp)) {
      tmp.more.push(along);
      tmp[along] = { general: 0, weight: 0 };
    }
    tmp[along].general += general;
    tmp[along].weight += weight;
    Object.keys(aspects).forEach((key) => {
      if (!(key in tmp.aspects)) {
        tmp.aspects[key] = {
          general: 0, weight: 0, [along]: { general: 0, weight: 0 },
        };
      }
      if (!(along in tmp.aspects[key])) tmp.aspects[key][along] = { general: 0, weight: 0 };
      const value = aspects[key];
      tmp.aspects[key].general += value;
      tmp.aspects[key][along].general += value;
      if (aspects[key]) {
        tmp.aspects[key].weight += weight;
        tmp.aspects[key][along].weight += weight;
      }
    });
  }

  deserialize(items) {
    const { collection, redis } = this;
    items.forEach((properties) => {
      const tmp = new Review({ redis });
      tmp.deserialize(properties);
      const { scores, along } = tmp;
      this.count({ ...scores, along });
      collection.push(tmp);
    });
  }

  async get() {
    const {
      redis,
      accomodation,
      order,
      along,
      intersection,
      offset,
      limit,
      from = (new Date()).getTime(),
      to,
    } = this;
    const pipeline = redis.pipeline();
    const zset = along ? intersection : `${accomodation}:${order}`;
    if (along) pipeline.zinterstore(zset, 2, `${accomodation}:${along}`, `${accomodation}:${order}`);
    pipeline.getall(zset, from, to, 'LIMIT', offset, limit);
    if (along) pipeline.del(intersection);
    const [intersectionOrAll, all] = await pipeline.exec();
    const [err, items] = (!along ? intersectionOrAll : all);
    if (err) throw new Error(err);
    this.deserialize(items);
    return this;
  }
}

module.exports = Reviews;
