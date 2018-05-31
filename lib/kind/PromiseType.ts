import * as ts from 'typescript';
import {Resolver, TypeResolver} from '../TypeResolver';

export class PromiseType implements Resolver {
    private typeResolver: TypeResolver;

    constructor(typeResolver: TypeResolver) {
        this.typeResolver = typeResolver;
    }

    isSupport(type: ts.TypeNode): boolean {
        const typeReference = type as ts.TypeReferenceNode;

        return typeReference.typeName.kind === ts.SyntaxKind.Identifier &&
            typeReference.typeName.text === 'Promise' &&
            typeReference.typeArguments &&
            typeReference.typeArguments.length === 1
        ;
    }

    resolve(type: ts.TypeNode) {
        return this.typeResolver.resolve((type as ts.TypeReferenceNode).typeArguments[0]);
    }
}
