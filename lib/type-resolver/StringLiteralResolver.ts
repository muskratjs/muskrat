import * as ts from 'typescript';
import {Context} from '../Context';
import {LiteralType, BaseType, Resolver} from '../model';

export class StringLiteralResolver extends Resolver {
    public isSupport(node: ts.StringLiteral): boolean {
        return node.kind === ts.SyntaxKind.StringLiteral;
    }

    public resolve(node: ts.StringLiteral, context: Context): BaseType {
        return new LiteralType(node.text);
    }
}
