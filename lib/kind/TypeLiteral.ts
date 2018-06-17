import * as ts from 'typescript';
import {TypeResolver} from '../TypeResolver';

export class TypeLiteral {
    private typeResolver: TypeResolver;

    constructor(typeResolver: TypeResolver) {
        this.typeResolver = typeResolver;
    }

    isSupport(type: ts.TypeNode): boolean {
        return type.kind === ts.SyntaxKind.TypeLiteral;
    }

    resolve(type: ts.TypeNode) {
        return { type: 'any' };
    }
}
