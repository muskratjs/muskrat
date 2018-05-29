import * as ts from 'typescript';

const primitiveTypeMap: { [kind: number]: string } = {
    [ts.SyntaxKind.NumberKeyword]: 'number',
    [ts.SyntaxKind.StringKeyword]: 'string',
    [ts.SyntaxKind.BooleanKeyword]: 'boolean',
    [ts.SyntaxKind.VoidKeyword]: 'void',
    [ts.SyntaxKind.NeverKeyword]: 'never',
};

export function getPrimitiveType(typeNode: ts.TypeNode) {
    const primitiveType = primitiveTypeMap[typeNode.kind];

    if (!primitiveType) {
        return;
    }

    return { dataType: primitiveType };
}
