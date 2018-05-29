import * as ts from "typescript";
import {getPrimitiveType} from "./getPrimitiveType";

export function getAnyTypeName(typeNode: ts.TypeNode): string {
    const primitiveType = getPrimitiveType(typeNode);

    if (primitiveType) {
        return primitiveType.dataType;
    }

    if (typeNode.kind === ts.SyntaxKind.ArrayType) {
        const arrayType = typeNode as ts.ArrayTypeNode;

        return getAnyTypeName(arrayType.elementType) + '[]';
    }

    if (typeNode.kind === ts.SyntaxKind.UnionType) {
        return 'object';
    }

    if (typeNode.kind !== ts.SyntaxKind.TypeReference) {
        throw new Error(`Unknown type: ${ts.SyntaxKind[typeNode.kind]}.`);
    }

    const typeReference = typeNode as ts.TypeReferenceNode;

    try {
        return (typeReference.typeName as ts.Identifier).text;
    } catch (e) {
        console.error(e);

        return typeNode.toString();
    }

}