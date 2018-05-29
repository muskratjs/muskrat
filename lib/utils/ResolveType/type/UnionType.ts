import * as ts from 'typescript';

export class UnionType {
    static isSupport(kind: ts.SyntaxKind) {
        return kind === ts.SyntaxKind.UnionType;
    }

    static resolve(typeNode: ts.TypeNode, parentNode?: ts.Node) {
        const unionType = typeNode as ts.UnionTypeNode;
        const supportType = unionType.types.some((type) => type.kind === ts.SyntaxKind.LiteralType);

        if (supportType) {
            return {
                dataType: 'enum',
                enums: unionType.types.map((type) => {
                    const literalType = (type as ts.LiteralTypeNode).literal;

                    switch (literalType.kind) {
                        case ts.SyntaxKind.TrueKeyword:
                            return 'true';
                        case ts.SyntaxKind.FalseKeyword:
                            return 'false';
                        default:
                            return String((literalType as any).text);
                    }
                }),
            };
        } else {
            return { dataType: 'object' };
        }
    }
}
