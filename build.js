#!/usr/bin/env node
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function copy() {
  const { stdout, stderr } = await exec(`cp -R ${__dirname}/* ${__dirname}/../../`);
  console.log('copy:', __dirname);
}
copy();
