import * as ts from 'typescript';
import {Context} from '../Context';
import {BaseType, ArrayType, Resolver} from '../model';

export class ArrayTypeResolver extends Resolver {
    public isSupport(node: ts.ArrayTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ArrayType;
    }

    public resolve(node: ts.ArrayTypeNode, context: Context): BaseType {
        return new ArrayType(
            this.childResolver.resolve(node.elementType, context),
        );
    }
}
