#!/usr/bin/env node

import * as program from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import {MetadataGenerator} from './lib/MetadataGenerator';
import {loadConfig} from './lib/helper';

const pack = require(path.join(process.cwd(), 'package.json'));
const config = loadConfig();

program
    .version(pack.version)
    .description(pack.description)
    .option('-e, --entry <required>', 'entry point')
    .option('-o, --output <required>', 'output file')
    .option('-t, --type [optional]', 'spec type')
    .parse(process.argv); // end with parse to parse through the input

const metadataGenerator = new MetadataGenerator(
    './test/MetadataGenerator/index.ts',
    require(path.join(process.cwd(), 'tsconfig.json'))
);

const metadata = metadataGenerator.generate(['Controller', 'JsonController']);


fs.writeFileSync(
    'metadata.json',
    JSON.stringify(metadata, null, '    ')
);
