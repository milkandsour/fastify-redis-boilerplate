const { Reviews: Controller } = require('../controllers');
const { reviews: schema } = require('../schemes');

module.exports = function* ({ redis, prefix }) {
  const controller = new Controller({ redis });
  const { get } = controller;
  yield {
    schema: schema.get, method: 'GET', url: `${prefix}/reviews`, handler: get.bind(controller),
  };
};
