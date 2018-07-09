import * as ts from 'typescript';
import {Context} from '../Context';
import {BaseType, Resolver} from '../model';

export class MethodDeclarationResolver extends Resolver {
    public isSupport(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.MethodDeclaration;
    }

    public resolve(node: ts.MethodDeclaration, context: Context): BaseType {
        return this.resolver.resolve(node.type, context);
    }
}
