import * as ts from 'typescript';

export function hasPublicModifier(node: ts.Node) {
    return !node.modifiers || node.modifiers.every((modifier) => {
        return modifier.kind !== ts.SyntaxKind.ProtectedKeyword && modifier.kind !== ts.SyntaxKind.PrivateKeyword;
    });
}
