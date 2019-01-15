const { Reviews: Model } = require('../models');

class Reviews {
  constructor({ redis }) {
    this.redis = redis;
  }

  async get(req) {
    const { redis } = this;
    const { query } = req;
    const collection = new Model({ ...query, ...({ redis }) });
    try {
      return await collection.get();
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = Reviews;
