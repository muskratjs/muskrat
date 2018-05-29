import * as ts from "typescript";
import {ResolveType} from "../ResolveType";

export class ArrayType {
    static isSupport(typeReference: ts.TypeReferenceNode) {
        return typeReference.typeName.kind === ts.SyntaxKind.Identifier &&
            typeReference.typeName.text === 'Array' &&
            typeReference.typeArguments &&
            typeReference.typeArguments.length === 1
        ;
    }

    static resolve(typeReference: ts.TypeReferenceNode) {
        return {
            dataType: 'array',
            elementType: ResolveType.resolve(typeReference.typeArguments[0]),
        }
    }
}