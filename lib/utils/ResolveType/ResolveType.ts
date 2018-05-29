import {values} from "lodash";
import * as ts from "typescript";
import * as typesResolvers from "./type";
import * as typeNamesResolvers from "./typeName";
import * as typeReferenceResolvers from "./typeReference";
import {ResolveReference} from "./ResolveReference";
import {getPrimitiveType} from "./helpers";

export type UsableDeclaration = ts.InterfaceDeclaration
    | ts.ClassDeclaration
    | ts.TypeAliasDeclaration
;

export class ResolveType {
    static typeChecker: ts.TypeChecker;
    static nodes: ts.Node[] = [];

    static resolve(typeNode: ts.TypeNode, parentNode?: ts.Node): any {
        const type: any = getPrimitiveType(typeNode);

        if (type) {
            return type;
        }

        for (const typeResolver of values(typesResolvers)) {
            if (typeResolver.isSupport(typeNode.kind)) {
                return typeResolver.resolve(typeNode, parentNode);
            }
        }

        if (typeNode.kind !== ts.SyntaxKind.TypeReference) {
            throw new Error(`Unknown type: ${ts.SyntaxKind[typeNode.kind]}`);
        }

        const typeReference = typeNode as ts.TypeReferenceNode;

        for (const typeNamesResolver of values(typeNamesResolvers)) {
            if (typeNamesResolver.isSupport(typeReference)) {
                return typeNamesResolver.resolve(typeReference);
            }
        }

        for (const typeReferenceResolver of values(typeReferenceResolvers)) {
            const resolved = typeReferenceResolver.resolve(typeReference.typeName);

            if (resolved) {
                return resolved;
            }
        }

        let referenceType: any;

        if (typeReference.typeArguments && typeReference.typeArguments.length === 1) {
            const typeT: ts.NodeArray<ts.TypeNode> = typeReference.typeArguments as ts.NodeArray<ts.TypeNode>;

            referenceType = ResolveReference.resolve(typeReference.typeName as ts.EntityName, typeT);
        } else {
            referenceType = ResolveReference.resolve(typeReference.typeName as ts.EntityName);
        }

        return referenceType;
    }
}
