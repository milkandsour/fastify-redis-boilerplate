class Review {
  constructor({
    redis, key, accomodation, along, travel, submission, general,
    user, locale = 'nl', texts = {}, titles = {}, aspects = {},
  }) {
    this.redis = redis;
    this.key = key;
    this.accomodation = accomodation;
    this.along = along;
    this.submission = submission;
    this.travel = travel;
    this.general = general;
    this.aspects = aspects;
    this.titles = titles;
    this.texts = texts;
    this.user = user;
    this.locale = locale;
  }

  get scores() {
    const { general, submission, aspects: tmp } = this;
    const current = (new Date()).getFullYear();
    const review = (new Date(+submission)).getFullYear();
    const weight = (current - review) < 5 ? 1 - (current - review) * 0.1 : 0.5;
    const aspects = Object.keys(tmp).reduce((acc, key) => {
      acc[key] = tmp[key] * weight;
      return acc;
    }, {});
    return { weight, general: general * weight, aspects };
  }

  normalize({ key: parent, value }) {
    if (!['submission', 'travel', 'general', 'aspects'].includes(parent)) return value;
    return +value;
  }

  denormalize({ key: parent, values }) {
    if (!['texts', 'titles', 'aspects'].includes(parent)) return [parent, values];
    return Object.keys(values).reduce((acc, key) => {
      acc.push(`${parent}:${key}`, values[key]);
      return acc;
    }, []);
  }

  deserialize(pairs) {
    const { keys } = this;
    for (let index = 0; index < pairs.length; index += 2) {
      const key = pairs[index];
      const value = pairs[index + 1];
      if (keys.includes(key)) this[key] = this.normalize({ key, value });
      const [parent, nested] = key.split(':');
      if (nested) {
        this[parent] = ({
          ...(this[parent] || {}),
          ...{ [nested]: this.normalize({ key: parent, value }) },
        });
      }
    }
  }

  toJSON() {
    const { keys } = this;
    return keys.reduce((acc, key) => {
      acc[key] = this[key];
      return acc;
    }, {});
  }

  get keys() {
    return [
      'key',
      'accomodation',
      'along',
      'travel',
      'submission',
      'general',
      'user',
      'locale',
      'texts',
      'titles',
      'aspects',
      'scores',
    ];
  }

  serialize() {
    const { keys } = this;
    return keys.reduce((acc, key) => {
      if (key === 'scores') return acc;
      acc.push(...(this.denormalize({ key, values: this[key] })));
      return acc;
    }, []);
  }

  async store() {
    const {
      redis, key, accomodation, along, travel, submission,
    } = this;
    const serialized = this.serialize();
    const pipeline = redis.pipeline();
    pipeline.hmset(key, serialized);
    pipeline.sadd(accomodation, key);
    pipeline.sadd(`${accomodation}:${along}`, key);
    pipeline.zadd(`${accomodation}:travels`, travel, key);
    pipeline.zadd(`${accomodation}:submissions`, submission, key);
    return pipeline.exec();
  }
}

module.exports = Review;
