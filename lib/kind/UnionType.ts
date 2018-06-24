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

    resolve(type: ts.UnionTypeNode) {
        return {
            type: type.types
                .map(subNode => this.typeResolver.resolve(subNode))
                .map((t: any) => t.type)
            ,
        };
    }
}
