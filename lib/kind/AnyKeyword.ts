import * as ts from 'typescript';
import {Resolver, TypeResolver} from '../TypeResolver';

export class AnyKeyword implements Resolver {
    private typeResolver: TypeResolver;

    constructor(typeResolver: TypeResolver) {
        this.typeResolver = typeResolver;
    }

    isSupport(type: ts.TypeNode): boolean {
        return type.kind === ts.SyntaxKind.AnyKeyword;
    }

    resolve(type: ts.TypeNode) {
        return { type: 'any' };
    }
}
