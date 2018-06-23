import * as ts from 'typescript';
import {Resolver, TypeResolver} from '../TypeResolver';

export class BooleanLiteral implements Resolver {
    private typeResolver: TypeResolver;

    constructor(typeResolver: TypeResolver) {
        this.typeResolver = typeResolver;
    }

    isSupport(type: ts.TypeNode): boolean {
        return type.kind === ts.SyntaxKind.TrueKeyword ||
            type.kind === ts.SyntaxKind.FalseKeyword
        ;
    }

    resolve(type: ts.TypeNode) {
        return { type: 'boolean' };
    }
}
