import * as ts from 'typescript';
import {Resolver, TypeResolver} from '../TypeResolver';

export class VoidKeyword implements Resolver {
    private typeResolver: TypeResolver;

    constructor(typeResolver: TypeResolver) {
        this.typeResolver = typeResolver;
    }

    isSupport(type: ts.TypeNode): boolean {
        return type.kind === ts.SyntaxKind.VoidKeyword;
    }

    resolve(type: ts.TypeNode) {
        return { type: 'void' };
    }
}
