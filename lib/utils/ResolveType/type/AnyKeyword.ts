import * as ts from "typescript";

export class AnyKeyword {
    static isSupport(kind: ts.SyntaxKind) {
        return kind === ts.SyntaxKind.AnyKeyword;
    }

    static resolve(typeNode: ts.TypeNode, parentNode?: ts.Node) {
        return { dataType: 'any' };
    }
}