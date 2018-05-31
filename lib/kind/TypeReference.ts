import * as ts from 'typescript';
import {Resolver, TypeResolver} from '../TypeResolver';

export class TypeReference implements Resolver {
    private typeResolver: TypeResolver;

    constructor(typeResolver: TypeResolver) {
        this.typeResolver = typeResolver;
    }

    isSupport(type: ts.TypeNode): boolean {
        return type.kind === ts.SyntaxKind.TypeReference;
    }

    resolve(type: ts.TypeNode) {
        return { type: 'ref' };
    }
}
