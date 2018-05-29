import * as ts from 'typescript';

export class BufferType {
    static isSupport(typeReference: ts.TypeReferenceNode) {
        return typeReference.typeName.kind === ts.SyntaxKind.Identifier &&
            typeReference.typeName.text === 'Buffer'
        ;
    }

    static resolve(typeReference: ts.TypeReferenceNode) {
        return { dataType: 'buffer' };
    }
}
