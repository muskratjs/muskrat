import * as ts from 'typescript';

export function getDecorators(node: ts.Node, isMatching: (identifier: ts.Identifier) => boolean) {
    const decorators = node.decorators;

    if (!decorators || !decorators.length) {
        return [];
    }

    return decorators
        .map(d => d.expression as ts.CallExpression)
        .map(e => e.expression as ts.Identifier)
        .filter(isMatching)
    ;
}
