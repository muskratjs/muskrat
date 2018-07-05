import * as ts from 'typescript';
import {Context} from '../Context';
import {BaseType, Resolver} from '../model';

export class ParenthesizedTypeResolver extends Resolver {
    public isSupport(node: ts.ParenthesizedTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ParenthesizedType;
    }

    public resolve(node: ts.ParenthesizedTypeNode, context: Context): BaseType {
        return this.resolver.resolve(node.type, context);
    }
}
