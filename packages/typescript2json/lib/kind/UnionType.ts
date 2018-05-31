import * as ts from 'typescript';
import {Resolver, TypeResolver} from '../TypeResolver';

export class UnionType implements Resolver {
    private typeResolver: TypeResolver;

    constructor(typeResolver: TypeResolver) {
        this.typeResolver = typeResolver;
    }

    isSupport(type: ts.TypeNode): boolean {
        return type.kind === ts.SyntaxKind.UnionType;
    }

    resolve(type: ts.TypeNode) {
        const unionType = type as ts.UnionTypeNode;
        const supportType = unionType.types.some((t: ts.TypeNode) => t.kind === ts.SyntaxKind.LiteralType);

        if (supportType) {
            return {
                enum: unionType.types.map((t) => {
                    const literalType = (t as ts.LiteralTypeNode).literal;

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
        }

        return { type: 'object' };
    }
}
