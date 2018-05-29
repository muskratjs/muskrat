import * as ts from 'typescript';

export class StringType {
    static isSupport(typeReference: ts.TypeReferenceNode) {
        return typeReference.typeName.kind === ts.SyntaxKind.Identifier &&
            typeReference.typeName.text === 'String'
        ;
    }

    static resolve(typeReference: ts.TypeReferenceNode) {
        return { dataType: 'string' };
    }
}
