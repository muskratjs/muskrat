import * as ts from "typescript";

export class DateType {
    static isSupport(typeReference: ts.TypeReferenceNode) {
        return typeReference.typeName.kind === ts.SyntaxKind.Identifier &&
            typeReference.typeName.text === 'Date'
        ;
    }

    static resolve(typeReference: ts.TypeReferenceNode) {
        return { dataType: 'datetime' }
    }
}