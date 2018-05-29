import * as ts from "typescript";

export function nodeIsUsable(node: ts.Node) {
    switch (node.kind) {
        case ts.SyntaxKind.InterfaceDeclaration:
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.TypeAliasDeclaration:
        case ts.SyntaxKind.EnumDeclaration:
            return true;
        default:
            return false;
    }
}
