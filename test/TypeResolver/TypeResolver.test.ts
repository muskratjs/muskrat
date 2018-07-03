import * as glob from 'glob';
import * as path from 'path';
import * as minimatch from 'minimatch';
import * as fs from 'fs';
import * as ts from 'typescript';
import {describe} from 'mocha';
import {values} from 'lodash';
import * as resolvers from '../../lib/resolver';
import * as formaters from '../../lib/formatter';
import {ChainResolver} from '../../lib/ChainResolver';
import {Context} from '../../lib/Context';
import {ChainFormatter} from '../../lib/ChainFormatter';
import {CircularReferenceFormatter} from '../../lib/CircularReferenceFormatter';
import {CircularReferenceResolver} from '../../lib/CircularReferenceResolver';
import {Identifier} from 'typescript';

const assert = require('chai').assert;
const isTested: string[] = [];
const nodes: ts.TypeNode[] = [];
const compilerOptions = require(path.join(process.cwd(), 'tsconfig.json'));
const testFoldersPattern = path.join(process.cwd(), 'test/TypeResolver/resources/*');
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
const chainResolver = new ChainResolver();

for (const resolver of values(resolvers)) {
    const r: any = resolver;
    chainResolver.addResolver(new CircularReferenceResolver(new r(typeChecker, chainResolver)));
}

const chainFormatter = new ChainFormatter([]);
const circularReferenceFormatter = new CircularReferenceFormatter(chainFormatter);

for (const formatter of values(formaters)) {
    const f: { new (...args: any[]): any } = formatter;
    chainFormatter.addFormatter(new f(circularReferenceFormatter));
}

describe('type-resolver', () => {
    nodes
        .filter(n => n.kind !== ts.SyntaxKind.EndOfFileToken)
        .forEach((node: ts.TypeNode) => {
            const testFilePath = node.getSourceFile().fileName;
            const testFolder = path.basename(path.dirname(node.getSourceFile().fileName));

            if (isTested.indexOf(testFilePath) === -1) {
                isTested.push(testFilePath);

                it(testFolder, () => {
                    const schema = JSON.parse(
                        fs.readFileSync(
                            path.join(process.cwd(),
                                'test/TypeResolver/resources',
                                path.basename(testFolder),
                                'schema.json'
                            )
                        ).toString()
                    );

                    const type = chainResolver.resolve(node, new Context());
                    let definitions = circularReferenceFormatter.getDefinition(type);

                    if ((node as any).name && ts.isIdentifier((node as any).name)) {
                        const name = (node as any).name.getText();

                        definitions = {
                            [name]: definitions,
                        };
                    }

                    const resolvedSchema = {
                        $schema: 'http://json-schema.org/draft-06/schema#',
                        definitions,
                    };

                    assert.deepEqual(resolvedSchema, schema);
                });
            }
        });
});
