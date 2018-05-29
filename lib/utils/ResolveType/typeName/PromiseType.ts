import * as ts from "typescript";
import {ResolveType} from "../ResolveType";

export class PromiseType {
    static isSupport(typeReference: ts.TypeReferenceNode) {
        return typeReference.typeName.kind === ts.SyntaxKind.Identifier &&
            typeReference.typeName.text === 'Promise' &&
            typeReference.typeArguments &&
            typeReference.typeArguments.length === 1
        ;
    }

    static resolve(typeReference: ts.TypeReferenceNode) {
        return ResolveType.resolve(typeReference.typeArguments[0]);
    }
}