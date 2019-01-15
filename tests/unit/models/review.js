const root = '../../../';
const chai = require('chai');
const spies = require('chai-spies');
const { range } = require('range');
const mock = require('../../payloads/import/review.json');
const { Review } = require(`${root}src/server/models`);

chai.use(spies);

describe("Review (unit/models/review.js)", (suite) => {

  before(async () => {
    const redis = { exec: chai.spy(), hmset: chai.spy(), sadd: chai.spy(), zadd: chai.spy() };
    this.redis = Object.assign({ pipeline: chai.spy(() => redis) }, redis);
    const {
      parents = [], id: key, traveledWith: along, entryDate: submission,
      travelDate: travel, ratings = {}, titles, texts, user, locale
    } = mock;
    const { general: g = {}, aspects } = ratings;
    const { general } = g;
    this.entities = parents.map(parent => {
      const { id: accomodation } = parent;
      const entity = new Review({
        redis: this.redis, key, accomodation, along, submission,
        travel, general, aspects, titles, texts, user, locale,
      });
      return entity;
    })
  })

  it('Review instantiate correctly @unit @models @review @redis @asd123', async () => {
    const { entities, redis } = this;
    entities.forEach(entity => {
      chai.expect(entity.redis).to.be.deep.equal(redis);
      chai.expect(entity.key).to.be.deep.equal('c9fa6d7b-a773-402e-b9cc-a800634484cf');
      chai.expect(entity.accomodation).to.be.deep.equal('96e83a90-48da-4e81-9d06-7f1b76e5364e');
      chai.expect(entity.along).to.be.deep.equal('FAMILY');
      chai.expect(entity.submission).to.be.deep.equal(1252359116000);
      chai.expect(entity.travel).to.be.deep.equal(1252359116000);
      chai.expect(entity.general).to.be.deep.equal(8);
      chai.expect(entity.aspects).to.be.deep.equal({
        "location": 9,
        "service": 0,
        "priceQuality": 9,
        "food": 0,
        "room": 0,
        "childFriendly": 9,
        "interior": 0,
        "size": 0,
        "activities": 0,
        "restaurants": 0,
        "sanitaryState": 0,
        "accessibility": 0,
        "nightlife": 0,
        "culture": 0,
        "surrounding": 0,
        "atmosphere": 0,
        "noviceSkiArea": 0,
        "advancedSkiArea": 0,
        "apresSki": 0,
        "beach": 0,
        "entertainment": 0,
        "environmental": 0,
        "pool": 0,
        "terrace": 0
      });
      chai.expect(entity.titles).to.be.deep.equal({
        "nl": "perfecte vakantieplek"
      });
      chai.expect(entity.texts).to.be.deep.equal({
        "nl": "14 dagen bungalowtent gehuurd, perfecte vakantie, weinig last van muggen, voor de kids (3,12,en 16) een paradijsje, nadeel bij de tenten van de touroperator is dat er geen luifel of partytent voorstaat, de plekken hebben weinig tot geen schaduw, dus zelf meenemen. Zeeeer schone toilet en doucheruimtes, zelfs voor de kleintjes een aparte ruimte."
      });
      chai.expect(entity.user).to.be.deep.equal('M van Dam');
      chai.expect(entity.locale).to.be.deep.equal('nl');
    })
  })

  it('Review serialize correctly @unit @models @review @redis @asd123', async () => {
    const { entities } = this;
    const [entity] = entities;
    chai.expect(entity.serialize()).to.be.deep.equal([
      'key', 'c9fa6d7b-a773-402e-b9cc-a800634484cf',
      'accomodation','96e83a90-48da-4e81-9d06-7f1b76e5364e',
      'along', 'FAMILY',
      'travel', 1252359116000,
      'submission', 1252359116000,
      'general', 8,
      'user', 'M van Dam',
      'locale', 'nl',
      'texts:nl', '14 dagen bungalowtent gehuurd, perfecte vakantie, weinig last van muggen, voor de kids (3,12,en 16) een paradijsje, nadeel bij de tenten van de touroperator is dat er geen luifel of partytent voorstaat, de plekken hebben weinig tot geen schaduw, dus zelf meenemen. Zeeeer schone toilet en doucheruimtes, zelfs voor de kleintjes een aparte ruimte.',
      'titles:nl', 'perfecte vakantieplek',
      'aspects:location', 9,
      'aspects:service', 0,
      'aspects:priceQuality', 9,
      'aspects:food', 0,
      'aspects:room', 0,
      'aspects:childFriendly', 9,
      'aspects:interior', 0,
      'aspects:size', 0,
      'aspects:activities', 0,
      'aspects:restaurants', 0,
      'aspects:sanitaryState', 0,
      'aspects:accessibility', 0,
      'aspects:nightlife', 0,
      'aspects:culture', 0,
      'aspects:surrounding', 0,
      'aspects:atmosphere', 0,
      'aspects:noviceSkiArea', 0,
      'aspects:advancedSkiArea', 0,
      'aspects:apresSki', 0,
      'aspects:beach', 0,
      'aspects:entertainment', 0,
      'aspects:environmental', 0,
      'aspects:pool', 0,
      'aspects:terrace', 0,
    ]);
  })

  it('Review deserialize correctly @unit @models @review @redis @asd123', async () => {
    const { redis, entities } = this;
    const [mock] = entities;
    const entity = new Review({ redis, key: 'c9fa6d7b-a773-402e-b9cc-a800634484cf' })
    entity.deserialize([
      'accomodation','96e83a90-48da-4e81-9d06-7f1b76e5364e',
      'along', 'FAMILY',
      'travel', 1252359116000,
      'submission', 1252359116000,
      'general', 8,
      'user', 'M van Dam',
      'locale', 'nl',
      'texts:nl', '14 dagen bungalowtent gehuurd, perfecte vakantie, weinig last van muggen, voor de kids (3,12,en 16) een paradijsje, nadeel bij de tenten van de touroperator is dat er geen luifel of partytent voorstaat, de plekken hebben weinig tot geen schaduw, dus zelf meenemen. Zeeeer schone toilet en doucheruimtes, zelfs voor de kleintjes een aparte ruimte.',
      'titles:nl', 'perfecte vakantieplek',
      'aspects:location', 9,
      'aspects:service', 0,
      'aspects:priceQuality', 9,
      'aspects:food', 0,
      'aspects:room', 0,
      'aspects:childFriendly', 9,
      'aspects:interior', 0,
      'aspects:size', 0,
      'aspects:activities', 0,
      'aspects:restaurants', 0,
      'aspects:sanitaryState', 0,
      'aspects:accessibility', 0,
      'aspects:nightlife', 0,
      'aspects:culture', 0,
      'aspects:surrounding', 0,
      'aspects:atmosphere', 0,
      'aspects:noviceSkiArea', 0,
      'aspects:advancedSkiArea', 0,
      'aspects:apresSki', 0,
      'aspects:beach', 0,
      'aspects:entertainment', 0,
      'aspects:environmental', 0,
      'aspects:pool', 0,
      'aspects:terrace', 0,
    ]);
    chai.expect(entity).to.be.deep.equal(mock);
  })

  it('Review store correctly @unit @models @review @redis @asd123', async () => {
    const { redis, entities } = this;
    const [mock] = entities;
    const { key, accomodation, along, travel, submission } = mock;
    const entity = new Review(mock);
    chai.expect(entity).to.be.deep.equal(mock);
    await entity.store();
    chai.expect(redis.pipeline).to.have.been.called();
    chai.expect(redis.hmset).to.have.been.called.with(key, entity.serialize());
    chai.expect(redis.sadd).to.have.been.called.with(accomodation, key);
    chai.expect(redis.sadd).to.have.been.called.with(`${accomodation}:${along}`, key);
    chai.expect(redis.zadd).to.have.been.called.with(`${accomodation}:travels`, travel, key);
    chai.expect(redis.zadd).to.have.been.called.with(`${accomodation}:submissions`, submission, key);
    chai.expect(redis.exec).to.have.been.called();
  })

  it('Review score correctly @unit @models @review @redis @asd123', async () => {
    const results = [10, 9, 8, 7, 6, 5, 5, 5, 5, 5];
    chai.expect(range(10).map(index => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - index);
      const entity = new Review({ submission: date.getTime(), general: 10, aspects: { something: 10 } });
      const { scores } = entity;
      const { general, weight, aspects } = scores;
      const { something } = aspects;
      chai.expect(general).to.be.equal(something);
      return general;
    })).to.be.deep.equal(results)
  })

})
