const root = '../../../';
const chai = require('chai');
const spies = require('chai-spies');
const { range } = require('range');
const { Review, Reviews } = require(`${root}src/server/models`);

chai.use(spies);

describe("Reviews (unit/models/reviews.js)", (suite) => {

  before(async () => {
    const result = [ [ null, [ ['key', 1] ] ], [ null, [ ['key', 2] ] ], [ null, 0 ] ]
    const exec = () => new Promise((resolve) => resolve(result))
    const redis = { exec, zinterstore: chai.spy(), getall: chai.spy(), del: chai.spy() };
    this.redis = Object.assign({ pipeline: chai.spy(() => redis) }, redis);
  })

  it('Reviews return a collection @unit @models @reviews @redis @ticket-number', async () => {
    const { redis } = this;
    const entity = new Reviews({ redis, accomodation: 5, from: 1 })
    await entity.get();
    const { collection } = entity;
    chai.expect(redis.pipeline).to.have.been.called();
    chai.expect(redis.zinterstore).to.not.have.been.called();
    chai.expect(redis.getall).to.have.been.called.with('5:travels', 1, 0, 'LIMIT', 0, 10);
    chai.expect(redis.del).to.not.have.been.called();
    chai.expect(collection).to.be.deep.equal([new Review({ redis, key: 1 })]);
  })

  it('Reviews return a filtered collection @unit @models @reviews @redis @ticket-number', async () => {
    const { redis } = this;
    const entity = new Reviews({ redis,  accomodation: 5, along: 'something', limit: 20, from: 1 })
    await entity.get();
    const { collection } = entity;
    chai.expect(redis.pipeline).to.have.been.called();
    chai.expect(redis.zinterstore).to.have.been.called.with('tmp', 2, '5:something', '5:travels');
    chai.expect(redis.getall).to.have.been.called.with('tmp', 1, 0, 'LIMIT', 0, 20);
    chai.expect(redis.del).to.have.been.called.with('tmp');
    chai.expect(collection).to.be.deep.equal([new Review({ redis, key: 2 })]);
  })

  it('Reviews return a filtered collection @unit @models @reviews @redis @ticket-number', async () => {
    const entity = new Reviews({ });
    const results = [10, 9, 8, 7, 6, 5, 5, 5, 5, 5];
    range(10).forEach(index => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - index);
      const along = index % 2 ? 'radu' : 'asd';
      const tmp = new Review({ along, submission: date.getTime(), general: 10, aspects: { something: 10 } });
      const { scores } = tmp;
      entity.count({ ...scores, along });
    });
    const { scores } = entity;
    const { general, aspects } = scores;
    const { something } = aspects;
    chai.expect(general).to.be.equal(10);
    chai.expect(something.general).to.be.equal(10);
    chai.expect(something.asd).to.be.equal(10);
    chai.expect(something.radu).to.be.equal(10);
  })

})
