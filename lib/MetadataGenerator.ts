import * as ts from 'typescript';
import {values} from 'lodash';
import {getDecorators} from './utils';
import {TypeResolver} from './TypeResolver';
import * as kindResolvers from './resolver';

export class MetadataGenerator {
    private program: ts.Program;
    private typeResolver: TypeResolver;
    private nodes: ts.Node[] = [];
    private readonly typeChecker: ts.TypeChecker;

    constructor(entryFile: string, compilerOptions?: ts.CompilerOptions) {
        // this.program = ts.createProgram([entryFile], compilerOptions || {});
        // this.typeChecker = this.program.getTypeChecker();
        //
        // for (const sourceFile of this.program.getSourceFiles()) {
        //     ts.forEachChild(sourceFile, (node) => {
        //         this.nodes.push(node);
        //     });
        // }
        //
        // this.typeResolver = new TypeResolver(this.nodes, this.typeChecker);
        //
        // for (const resolver of values(kindResolvers)) {
        //     this.typeResolver.register(resolver);
        // }
    }

    // public getMetadata() {
    //     return this.nodes
    //         .filter(c => c.kind === ts.SyntaxKind.ClassDeclaration)
    //         .filter(controller => this.filterByDecoratorsList(controller, config.decorators.controller).length)
    //         .map((controller: ts.ClassDeclaration) => ({
    //             controller: controller.name.getText(),
    //             methods: controller.members
    //                 .filter(m => m.kind === ts.SyntaxKind.MethodDeclaration)
    //                 .filter(method => this.filterByDecoratorsList(method, config.decorators.method).length)
    //                 .map((method: ts.MethodDeclaration) => ({
    //                     method: method.name.getText(),
    //                     ...this.getType(method),
    //                     params: method.parameters
    //                         .filter(node => this.filterByDecoratorsList(node, config.decorators.parameter).length)
    //                         .map((param: ts.ParameterDeclaration) => ({
    //                             param: param.name.getText(),
    //                             ...this.getType(param)
    //                         }))
    //                 }))
    //         }))
    //     ;
    // }
    //
    // private getType(node: any) {
    //     let nodeType = node.type;
    //
    //     if (!nodeType) {
    //         const signature = this.typeChecker.getSignatureFromDeclaration(node);
    //         const implicitType = this.typeChecker.getReturnTypeOfSignature(signature!);
    //
    //         nodeType = this.typeChecker.typeToTypeNode(implicitType);
    //     }
    //
    //     return this.typeResolver.resolve(nodeType);
    // }
    //
    // private filterByDecoratorsList(node: ts.Node, decorators: string[]) {
    //     return getDecorators(
    //         node,
    //         identifier => Object.keys(decorators)
    //             .some((m: string) => m === identifier.text)
    //     );
    // }
}
