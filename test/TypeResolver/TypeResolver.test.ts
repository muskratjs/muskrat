import * as glob from 'glob';
import * as path from 'path';
import * as minimatch from 'minimatch';
import * as fs from 'fs';
import * as ts from 'typescript';
import {describe} from 'mocha';
import {values} from 'lodash';
import * as resolvers from '../../lib/type-resolver';
import * as formaters from '../../lib/type-formatter';
import {TypeResolver} from '../../lib/TypeResolver';
import {TypeFormatter} from '../../lib/TypeFormatter';
import {CircularReferenceFormatter} from '../../lib/CircularReferenceFormatter';
import {CircularReferenceResolver} from '../../lib/CircularReferenceResolver';
import {ExposeResolver} from '../../lib/ExposeResolver';
import {SchemaGenerator} from '../../lib/SchemaGenerator';

const assert = require('chai').assert;
const isTested: string[] = [];
const nodes: ts.TypeNode[] = [];
const compilerOptions = require(path.join(process.cwd(), 'tsconfig.json'));
const testFoldersPattern = path.join(process.cwd(), 'test/TypeResolver/valid-types/*');

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
const chainResolver = new TypeResolver();

for (const resolver of values(resolvers)) {
    chainResolver.addResolver(
        new CircularReferenceResolver(
            new ExposeResolver(
                typeChecker,
                new (resolver as any)(typeChecker, chainResolver),
                'export'
            )
        )
    );
}

const chainFormatter = new TypeFormatter([]);
const circularReferenceFormatter = new CircularReferenceFormatter(chainFormatter);

for (const formatter of values(formaters)) {
    const f: { new (...args: any[]): any } = formatter;
    chainFormatter.addFormatter(new f(circularReferenceFormatter));
}

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
                            path.join(process.cwd(),
                                'test/TypeResolver/valid-types',
                                path.basename(testFolder),
                                'schema.json'
                            )
                        ).toString()
                    );

                    const schemaGenerator = new SchemaGenerator(
                        program,
                        chainResolver,
                        circularReferenceFormatter
                    );
                    const resolvedSchema = schemaGenerator.createSchema(node);

                    fs.writeFileSync(
                        'dist/' + path.basename(testFolder) + '.json',
                        JSON.stringify(resolvedSchema, null, '    ')
                    );

                    assert.deepEqual(resolvedSchema, schema);
                });
            }
        });
});
