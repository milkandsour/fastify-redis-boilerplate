const fastify = require('fastify')({ logger: { level: process.env.LOG || 'info' } });
const compress = require('fastify-compress');
const cors = require('fastify-cors');
const Redis = require('ioredis');
const routes = require('./routes');
const pkg = require('../../package.json');

const redis = new Redis(
  process.env.REDIS_PORT || 6379,
  process.env.REDIS_HOST || '0.0.0.0',
);
redis.defineCommand('getall', {
  numberOfKeys: 6,
  lua: `
    local items = {}
    local keys = redis.call("zrevrangebyscore",KEYS[1],KEYS[2],KEYS[3],KEYS[4],KEYS[5], KEYS[6])
    for index = 1, #keys do
    items[index] = redis.call('hgetall', keys[index])
    end
    return items
  `,
});
const { version } = pkg;
const [major] = version.split('.');
for (const route of routes({ fastify, redis, version: major })) {
  for (const verb of route) {
    fastify.route(verb);
  }
}
fastify.register(compress);
fastify.register(cors);

const main = async () => {
  try {
    await fastify.listen(process.env.SERVER_PORT || 3001, '0.0.0.0');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${fastify.server.address().port}`);
};
main();
