import * as ts from "typescript";
import {UsableDeclaration} from "../ResolveType";
import {ResolveType} from "../../index";

export function getNodeDescription(node: UsableDeclaration | ts.PropertyDeclaration | ts.ParameterDeclaration | ts.EnumDeclaration) {
    const typeChecker = ResolveType.typeChecker;
    const symbol = typeChecker.getSymbolAtLocation(node.name as ts.Node);

    if (!symbol) {
        return undefined;
    }

    if (node.kind === ts.SyntaxKind.Parameter) {
        symbol.flags = 0;
    }

    const comments = symbol.getDocumentationComment(undefined);

    if (comments.length) {
        return ts.displayPartsToString(comments);
    }

    return undefined;
}
