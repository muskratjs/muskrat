import * as glob from 'glob';
import * as path from 'path';
import * as minimatch from 'minimatch';
import * as fs from 'fs';
import * as ts from 'typescript';
import {describe} from 'mocha';
import {values} from 'lodash';
import * as kindResolvers from '../../lib/kind';
import {TypeResolver} from '../../lib/TypeResolver';

const assert = require('chai').assert;
const compilerOptions = require(path.join(process.cwd(), 'tsconfig.json'));

describe('type-resolver', () => {
    glob.sync(path.join(__dirname, 'resources/*')).forEach((testFolder: string) => {
        it(path.basename(testFolder), () => {
            const nodes: ts.TypeNode[] = [];
            const schema = JSON.parse(
                fs.readFileSync(
                    path.join(process.cwd(),
                        'test/TypeResolver/resources',
                        path.basename(testFolder),
                        'schema.json'
                    )
                ).toString()
            );
            const program = ts.createProgram([path.join(testFolder, 'main')], compilerOptions || {});
            const typeChecker = program.getTypeChecker();
            const folder = path.join(__dirname, 'resources', path.basename(testFolder));

            program.getSourceFiles()
                .filter((sourceFile) => minimatch(sourceFile.fileName, `${folder}/*`))
                .forEach((sourceFile) => {
                    ts.forEachChild(sourceFile, (n: ts.TypeNode) => {
                        nodes.push(n);
                    });
                })
            ;

            const typeResolver = new TypeResolver(nodes, typeChecker);

            for (const resolver of values(kindResolvers)) {
                typeResolver.register(resolver);
            }

            const node = nodes.filter(n => n.kind !== ts.SyntaxKind.EndOfFileToken).shift();
            const resolvedSchema = typeResolver.resolve(node);

            assert.deepEqual(resolvedSchema, schema);
        });
    });
});
