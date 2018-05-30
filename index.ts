#!/usr/bin/env node

import * as program from 'commander';

const pack = require('./package.json');

program
    .version(pack.version)
    .description(pack.description)
    .option('-e, --entry <required>', 'entry point')
    .option('-o, --output <required>', 'output file')
    .option('-t, --type [optional]', 'spec type')
    .parse(process.argv); // end with parse to parse through the input
