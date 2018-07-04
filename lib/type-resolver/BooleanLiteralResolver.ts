import * as ts from 'typescript';
import {LiteralType, BaseType, Resolver} from '../model';

export class BooleanLiteralResolver extends Resolver {
    public isSupport(node: ts.BooleanLiteral): boolean {
        return node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword;
    }

    public resolve(node: ts.BooleanLiteral): BaseType {
        return new LiteralType(node.kind === ts.SyntaxKind.TrueKeyword);
    }
}
