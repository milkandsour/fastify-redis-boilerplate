const fs = require('fs');
/* eslint-disable */
const uuidv1 = require('uuid/v1');
const wrk = require('wrk');
const ms = require('ms');
/* eslint-enable */
const config = require('../../../tests/benchmarks/config.json');

const msGreater = (source, value) => ms(source) > value;
const greater = (source, value) => source > value;
const validator = {
  latencyAvg: msGreater,
  latencyStdev: msGreater,
  latencyMax: msGreater,
  latency50: msGreater,
  latency75: msGreater,
  latency90: msGreater,
  latency99: msGreater,
  requestsPerSec: greater,
  non2xx3xx: (source, value, result) => source > (value / 100) * result.requestsTotal,
};

const benchmark = async ({
  headers, connections, threads, server: url, duration, script, requirements,
}) => new Promise(resolve => wrk({
  threads, connections, duration, printLatency: true, script, headers, url,
}, (error, out) => {
  if (error) throw error;
  const errors = Object.keys(requirements).filter((key) => {
    const failure = validator[key](out[key], requirements[key], out);
    console.log(JSON.stringify({
      key, result: out[key], expected: requirements[key], failure,
    }));
    return failure;
  });
  fs.unlinkSync(script);
  console.log(JSON.stringify({ out }));
  if (errors.length) throw new Error(`Unfortunately your app do not meet the performance requirements: ${errors}`);
  resolve();
}));

exports.command = 'benchmark';
exports.desc = 'Run benchmark against the choosen server';
exports.builder = {};
exports.handler = async () => {
  const { tests = [] } = config;
  for (const test of tests) {
    console.log(JSON.stringify({ test }));
    const { SERVER_HOST = '0.0.0.0', SERVER_PORT = 3001 } = process.env;
    const {
      server = `http://${SERVER_HOST}:${SERVER_PORT}`, threads = 1, duration = '10s',
      connections = 10, headers = {}, paths = [], requirements = {},
    } = test;
    const validations = Object.keys(requirements);
    if (
      !paths.length
      || !validations.length
      || validations.some(v => Object.keys(validator).indexOf(v) === -1)
    ) {
      throw JSON.stringify({ error: 'Invalid configuration', paths, requirements });
    }
    const script = `${uuidv1()}.lua`;
    fs.writeFileSync(script, `
      math.randomseed(os.time())
      paths = {${paths.map(p => `'${p}'`).join(',')}}
      request = function()
        return wrk.format(nil, paths[math.random(#paths)])
      end
    `);
    // they need to sequencial
    /* eslint-disable */
    await benchmark({
      threads, connections, duration, script, headers, server, requirements,
    });
    /* eslint-enable */
  }
};
