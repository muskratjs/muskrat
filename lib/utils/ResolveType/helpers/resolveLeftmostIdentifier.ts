import * as ts from "typescript";

export function resolveLeftmostIdentifier(type: ts.EntityName): ts.Identifier {
    while (type.kind !== ts.SyntaxKind.Identifier) {
        type = (type as ts.QualifiedName).left;
    }

    return type as ts.Identifier;
}