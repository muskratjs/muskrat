import * as ts from "typescript";
import {ResolveType} from "../ResolveType";

export class ArrayType {
    static isSupport(kind: ts.SyntaxKind) {
        return kind === ts.SyntaxKind.ArrayType;
    }

    static resolve(typeNode: ts.TypeNode, parentNode?: ts.Node) {
        return {
            dataType: 'array',
            elementType: ResolveType.resolve((typeNode as ts.ArrayTypeNode).elementType),
        }
    }
}