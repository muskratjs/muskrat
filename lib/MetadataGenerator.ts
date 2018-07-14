import * as ts from 'typescript';
import * as doctrine from 'doctrine';
import {getDecorators} from './utils';
import {createFormatter, createResolver} from './helper';
import {
    IMetadataClass,
    IMetadataMethod,
    IMetadataParameter
} from './model';
import {SchemaGenerator} from './SchemaGenerator';
import {Schema} from './schema';

export class MetadataGenerator {
    private readonly program: ts.Program;
    private readonly typeChecker: ts.TypeChecker;
    private nodes: ts.Node[] = [];
    private schemaGenerator: SchemaGenerator;

    /**
     * @param {string} entryFile
     * @param {ts.CompilerOptions} compilerOptions
     */
    constructor(
        entryFile: string,
        compilerOptions?: ts.CompilerOptions
    ) {
        this.program = ts.createProgram([entryFile], compilerOptions || {});
        this.typeChecker = this.program.getTypeChecker();

        for (const sourceFile of this.program.getSourceFiles()) {
            ts.forEachChild(sourceFile, (node) => {
                this.nodes.push(node);
            });
        }

        this.schemaGenerator = new SchemaGenerator(
            this.program,
            createResolver(this.typeChecker),
            createFormatter()
        );
    }

    /**
     * @param {string[]} entryDecorators
     * @return {IMetadataClass}
     */
    public generate(entryDecorators: string[]): IMetadataClass[] {
        return this.nodes
            .filter(c => c.kind === ts.SyntaxKind.ClassDeclaration)
            .filter(controller => this.filterByDecoratorsList(controller, entryDecorators).length)
            .map((controller: ts.ClassDeclaration) => ({
                annotations: this.getJSDocTagNames(controller),
                controller: controller.name.getText(),
                decorators: this.resolveDecorators(controller.decorators),
                methods: controller.members
                    .filter(m => m.kind === ts.SyntaxKind.MethodDeclaration)
                    .map((method: ts.MethodDeclaration) => ({
                        annotations: this.getJSDocTagNames(method),
                        method: method.name.getText(),
                        decorators: this.resolveDecorators(method.decorators),
                        schema: this.getSchema(method),
                        params: method.parameters
                            .map((param: ts.ParameterDeclaration) => ({
                                param: param.name.getText(),
                                annotations: this.getJSDocTagNames(param),
                                decorators: this.resolveDecorators(param.decorators),
                                schema: this.getSchema(param),
                            }) as IMetadataParameter)
                    }) as IMetadataMethod)
            }) as IMetadataClass)
        ;
    }

    /**
     * @param {ts.NodeArray<ts.Decorator>} decorators
     * @return {[p: string]: Schema}
     */
    private resolveDecorators(decorators?: ts.NodeArray<ts.Decorator>): {[decorator: string]: Schema} {
        if (!decorators || !decorators.length) {
            return {};
        }

        const resolvedDecorators: {[key: string]: any} = {};

        decorators
            .map(d => d.expression as ts.CallExpression)
            .map(e => e.expression as ts.Identifier)
            .map((d) => {
                    resolvedDecorators[d.getText()] = (d.parent as ts.CallExpression)
                        .arguments
                        .map(a => this.getSchema(a))
                    ;
                }
            )
        ;

        return resolvedDecorators;
    }

    /**
     * @param {ts.Node} node
     * @return {BaseType}
     */
    private getSchema(node: ts.Node) {
        return this.schemaGenerator.createSchema(node, false);
    }

    /**
     * @param {ts.Node} node
     * @param {object} decorators
     * @return {any[] | ts.Identifier[]}
     */
    private filterByDecoratorsList(node: ts.Node, decorators: string[]) {
        return getDecorators(
            node,
            identifier => decorators
                .some((m: string) => m === identifier.text)
        );
    }

    /**
     * @param {ts.Node} node
     * @return {any}
     */
    getJSDocTagNames(node: ts.Node): any {
        const jsDoc = (node as any).jsDoc && (node as any).jsDoc[0].getText();

        if (!jsDoc) {
            return {};
        }

        return doctrine.parse(jsDoc, { unwrap: true });
    }
}
