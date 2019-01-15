#!/usr/bin/env node
/* eslint-disable */
const yargs = require('yargs');
const pkg = require('../../package.json');

yargs
  .commandDir('commands')
  .default(pkg)
  .demandCommand()
  .help()
  .argv;
/* eslint-enable */
