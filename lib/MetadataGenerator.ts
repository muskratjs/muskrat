import * as ts from 'typescript';
import {config, getDecorators, ResolveType} from './utils/index';

export class MetadataGenerator {
    private program: ts.Program;

    constructor(entryFile: string, compilerOptions?: ts.CompilerOptions) {
        this.program = ts.createProgram([entryFile], compilerOptions || {});
        ResolveType.typeChecker = this.program.getTypeChecker();

        for (const sourceFile of this.program.getSourceFiles()) {
            ts.forEachChild(sourceFile, (node) => {
                ResolveType.nodes.push(node);
            });
        }
    }

    public getMetadata() {
        return ResolveType.nodes
            .filter(c => c.kind === ts.SyntaxKind.ClassDeclaration)
            .filter(controller => this.filterByDecoratorsList(controller, config.decorators.controller).length)
            .map((controller: ts.ClassDeclaration) => ({
                controller: controller,
                methods: controller.members
                    .filter(m => m.kind === ts.SyntaxKind.MethodDeclaration)
                    .filter(method => this.filterByDecoratorsList(method, config.decorators.method).length)
                    .map((method: ts.MethodDeclaration) => ({
                        method,
                        type: this.getType(method),
                        params: method.parameters
                            .filter(node => this.filterByDecoratorsList(node, config.decorators.parameter).length)
                            .map((param: ts.ParameterDeclaration) => ({
                                param,
                                type: this.getType(param)
                            }))
                    }))
            }))
        ;
    }

    private getType(node: any) {
        let nodeType = node.type;

        if (!nodeType) {
            const signature = ResolveType.typeChecker.getSignatureFromDeclaration(node);
            const implicitType = ResolveType.typeChecker.getReturnTypeOfSignature(signature!);

            nodeType = ResolveType.typeChecker.typeToTypeNode(implicitType);
        }

        return ResolveType.resolve(nodeType);
    };

    private filterByDecoratorsList(node: ts.Node, decorators: string[]) {
        return getDecorators(
            node,
            identifier => Object.keys(decorators)
                .some((m: string) => m === identifier.text)
        )
    };
}
