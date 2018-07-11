import * as ts from 'typescript';
import {getDecorators} from './utils';
import {createFormatter, createResolver} from './helper';
import {IMetadataGeneratorOptions} from './model';
import {SchemaGenerator} from './SchemaGenerator';

export class MetadataGenerator {
    private program: ts.Program;
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

        const typeChecker: ts.TypeChecker = this.program.getTypeChecker();

        for (const sourceFile of this.program.getSourceFiles()) {
            ts.forEachChild(sourceFile, (node) => {
                this.nodes.push(node);
            });
        }

        this.schemaGenerator = new SchemaGenerator(
            this.program,
            createResolver(typeChecker),
            createFormatter()
        );
    }

    /**
     * @param {IMetadataGeneratorOptions} options
     * @return {object}
     */
    public getMetadata(options: IMetadataGeneratorOptions) {
        return this.nodes
            .filter(c => c.kind === ts.SyntaxKind.ClassDeclaration)
            .filter(controller => this.filterByDecoratorsList(controller, options.controllerDecorators).length)
            .map((controller: ts.ClassDeclaration) => ({
                controller: controller.name.getText(),
                methods: controller.members
                    .filter(m => m.kind === ts.SyntaxKind.MethodDeclaration)
                    .filter(method => this.filterByDecoratorsList(method, options.methodDecorators).length)
                    .map((method: ts.MethodDeclaration) => ({
                        method: method.name.getText(),
                        ...this.getSchema(method),
                        params: method.parameters
                            .filter(node => this.filterByDecoratorsList(node, options.parameterDecorators).length)
                            .map((param: ts.ParameterDeclaration) => ({
                                param: param.name.getText(),
                                ...this.getSchema(param)
                            }))
                    }))
            }))
        ;
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
    private filterByDecoratorsList(node: ts.Node, decorators: object) {
        return getDecorators(
            node,
            identifier => Object.keys(decorators)
                .some((m: string) => m === identifier.text)
        );
    }
}
