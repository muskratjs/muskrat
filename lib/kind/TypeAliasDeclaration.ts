import * as ts from 'typescript';
import {Resolver, TypeResolver} from '../TypeResolver';

export class TypeAliasDeclaration implements Resolver {
    private typeResolver: TypeResolver;

    constructor(typeResolver: TypeResolver) {
        this.typeResolver = typeResolver;
    }

    isSupport(type: ts.TypeNode): boolean {
        return type.kind === ts.SyntaxKind.TypeAliasDeclaration;
    }

    resolve(type: ts.TypeAliasDeclaration) {
        return this.typeResolver.resolve(type.type);
    }
}
