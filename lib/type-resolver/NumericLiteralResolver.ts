import * as ts from 'typescript';
import {Context} from '../Context';
import {LiteralType, BaseType, Resolver} from '../model';

export class NumericLiteralResolver extends Resolver {
    public isSupport(node: ts.NumericLiteral): boolean {
        return node.kind === ts.SyntaxKind.NumericLiteral;
    }

    public resolve(node: ts.NumericLiteral, context: Context): BaseType {
        return new LiteralType(parseFloat(node.text));
    }
}
