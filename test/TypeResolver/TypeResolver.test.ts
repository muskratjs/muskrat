import * as glob from 'glob';
import * as path from 'path';
import * as minimatch from 'minimatch';
import * as fs from 'fs';
import * as ts from 'typescript';
import {describe} from 'mocha';
import {SchemaGenerator} from '../../lib/SchemaGenerator';
import {createFormatter, createResolver} from '../../lib/helper';

const assert = require('chai').assert;
const isTested: string[] = [];
const nodes: ts.TypeNode[] = [];
const compilerOptions = require(path.resolve('tsconfig.json'));
const testFoldersPattern = path.resolve('test/TypeResolver/valid-types/*');

const program = ts.createProgram(
    glob.sync(testFoldersPattern)
        .map((testPath) => path.join(testPath, 'main'))
    ,
    compilerOptions || {}
);

program.getSourceFiles()
    .filter((sourceFile) => minimatch(sourceFile.fileName, `${testFoldersPattern}*`))
    .forEach((sourceFile) => {
        ts.forEachChild(sourceFile, (n: ts.TypeNode) => {
            if (n.modifiers && n.modifiers.length && n.modifiers[0].kind === ts.SyntaxKind.ExportKeyword) {
                nodes.push(n);
            }
        });
    })
;

const typeChecker = program.getTypeChecker();
const typeResolver = createResolver(typeChecker);
const typeFormatter = createFormatter();

describe('Valid Type Resolve', () => {
    nodes
        .filter(n => n.kind !== ts.SyntaxKind.EndOfFileToken)
        .filter(n => !ts.isImportDeclaration(n))
        .filter(n => n.modifiers)
        .filter(n => path.basename(n.getSourceFile().fileName, '.ts') === 'main')
        .forEach((node: ts.TypeNode) => {
            const testFilePath = node.getSourceFile().fileName;
            const testFolder = path.basename(path.dirname(node.getSourceFile().fileName));

            if (isTested.indexOf(testFilePath) === -1) {
                isTested.push(testFilePath);

                it(testFolder, () => {
                    const schema = JSON.parse(
                        fs.readFileSync(
                            path.resolve(
                                'test/TypeResolver/valid-types',
                                path.basename(testFolder),
                                'schema.json'
                            )
                        ).toString()
                    );

                    const schemaGenerator = new SchemaGenerator(
                        program,
                        typeResolver,
                        typeFormatter
                    );
                    const resolvedSchema = schemaGenerator.createSchema(node);

                    if (process.env.DEBUG) {
                        fs.writeFileSync(
                            'dist/' + path.basename(testFolder) + '.json',
                            JSON.stringify(resolvedSchema, null, '    ')
                        );
                    }

                    assert.deepEqual(resolvedSchema, schema);
                });
            }
        });
});
