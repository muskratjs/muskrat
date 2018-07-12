import * as ts from 'typescript';
import {getDecorators} from './utils';
import {createFormatter, createResolver} from './helper';
import {
    IDecoratorConfig,
    IMetadataClass,
    IMetadataGeneratorOptions,
    IMetadataMethod,
    IMetadataParameter
} from './model';
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
    public generate(options: IMetadataGeneratorOptions): IMetadataClass[] {
        return this.nodes
            .filter(c => c.kind === ts.SyntaxKind.ClassDeclaration)
            .filter(controller => this.filterByDecoratorsList(controller, options.controllerDecorators).length)
            .map((controller: ts.ClassDeclaration) => ({
                decorators: this.resolveDecorators(
                    this.filterByDecoratorsList(
                        controller,
                        options.controllerDecorators.filter(d => d.type.indexOf('class') > -1)
                    )
                ),
                controller: controller.name.getText(),
                methods: controller.members
                    .filter(m => m.kind === ts.SyntaxKind.MethodDeclaration)
                    .filter(method => this.filterByDecoratorsList(method, options.methodDecorators).length)
                    .map((method: ts.MethodDeclaration) => ({
                        decorators: this.resolveDecorators(
                            this.filterByDecoratorsList(
                                method,
                                options.methodDecorators.filter(d => d.type.indexOf('method') > -1)
                            )
                        ),
                        method: method.name.getText(),
                        schema: this.getSchema(method),
                        params: method.parameters
                            .filter(node => this.filterByDecoratorsList(node, options.parameterDecorators).length)
                            .map((param: ts.ParameterDeclaration) => ({
                                decorators: this.resolveDecorators(
                                    this.filterByDecoratorsList(
                                        param,
                                        options.parameterDecorators.filter(d => d.type.indexOf('parameter') > -1)
                                    )
                                ),
                                param: param.name.getText(),
                                schema: this.getSchema(param),
                            }) as IMetadataParameter)
                    }) as IMetadataMethod)
            }) as IMetadataClass)
        ;
    }

    private resolveDecorators(decorators: ts.Declaration[]): any {
        if (!decorators.length) {
            return {};
        }

        const resolvedDecorators: {[key: string]: any} = {};

        decorators.map(
            (d) => {
                resolvedDecorators[d.getText()] = (d.parent as ts.CallExpression)
                    .arguments
                    .map(a => this.getSchema(a))
                ;
            }
        );

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
    private filterByDecoratorsList(node: ts.Node, decorators: IDecoratorConfig[]) {
        return getDecorators(
            node,
            identifier => decorators
                .map(d => d.name)
                .some((m: string) => m === identifier.text)
        );
    }
}
