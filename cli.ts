#!/usr/bin/env node

import * as program from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import {MetadataGenerator} from './lib/MetadataGenerator';

const pack = require(path.join(process.cwd(), 'package.json'));

program
    .version(pack.version)
    .description(pack.description)
    .option('-e, --entry <required>', 'entry point')
    .option('-o, --output <required>', 'output file')
    .option('-t, --type [optional]', 'spec type')
    .parse(process.argv); // end with parse to parse through the input

// const metadata = new MetadataGenerator('./test/valid-types/app.ts', require(path.join(process.cwd(), 'tsconfig.json')));

// fs.writeFileSync('test.json', JSON.stringify(metadata.getMetadata(), null, '    '));
