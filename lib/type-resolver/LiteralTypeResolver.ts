import * as ts from 'typescript';
import {Context} from '../Context';
import {BaseType, Resolver} from '../model';

export class LiteralTypeResolver extends Resolver {
    public isSupport(node: ts.LiteralTypeNode): boolean {
        return node.kind === ts.SyntaxKind.LiteralType;
    }

    public resolve(node: ts.LiteralTypeNode, context: Context): BaseType {
        return this.resolver.resolve(node.literal, context);
    }
}
