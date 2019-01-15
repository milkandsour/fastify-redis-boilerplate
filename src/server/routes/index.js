const reviews = require('./reviews');

module.exports = function* ({ redis, version }) {
  const prefix = `/v${version}`;
  yield reviews({ redis, prefix });
};
