import * as ts from 'typescript';
import {Resolver, TypeResolver} from '../TypeResolver';

export class ArrayType implements Resolver {
    private typeResolver: TypeResolver;
    private isReference = false;

    constructor(typeResolver: TypeResolver) {
        this.typeResolver = typeResolver;
    }

    isSupport(type: ts.TypeNode): boolean {
        const typeReference = type as ts.TypeReferenceNode;

        this.isReference = typeReference.typeName.kind === ts.SyntaxKind.Identifier &&
            typeReference.typeName.text === 'Array' &&
            typeReference.typeArguments &&
            typeReference.typeArguments.length === 1
        ;

        return this.isReference || type.kind === ts.SyntaxKind.ArrayType;
    }

    resolve(type: ts.TypeNode) {
        return {
            type: 'array',
            items: this.isReference
                ? this.typeResolver.resolve((type as ts.TypeReferenceNode).typeArguments[0])
                : this.typeResolver.resolve((type as ts.ArrayTypeNode).elementType)
            ,
        };
    }
}
