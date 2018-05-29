import * as ts from 'typescript';

export class TypeLiteral {
    static isSupport(kind: ts.SyntaxKind) {
        return kind === ts.SyntaxKind.TypeLiteral;
    }

    static resolve(typeNode: ts.TypeNode, parentNode?: ts.Node) {
        return { dataType: 'any' };
    }
}
