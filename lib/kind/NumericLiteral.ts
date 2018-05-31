import * as ts from 'typescript';
import {Resolver, TypeResolver} from '../TypeResolver';

export class NumericLiteral implements Resolver {
    private typeResolver: TypeResolver;

    constructor(typeResolver: TypeResolver) {
        this.typeResolver = typeResolver;
    }

    isSupport(type: ts.TypeNode): boolean {
        return type.kind === ts.SyntaxKind.NumericLiteral;
    }

    resolve(type: ts.TypeNode) {
        return { type: 'number' };
    }
}
