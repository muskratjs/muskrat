import * as ts from "typescript";

export function resolveFqTypeName(type: ts.EntityName): string {
    if (type.kind === ts.SyntaxKind.Identifier) {
        return (type as ts.Identifier).text;
    }

    const qualifiedType = type as ts.QualifiedName;

    return resolveFqTypeName(qualifiedType.left) + '.' + (qualifiedType.right as ts.Identifier).text;
}