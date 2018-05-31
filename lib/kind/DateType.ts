import * as ts from 'typescript';
import {Resolver, TypeResolver} from '../TypeResolver';

export class DateType  implements Resolver {
    private typeResolver: TypeResolver;

    constructor(typeResolver: TypeResolver) {
        this.typeResolver = typeResolver;
    }

    isSupport(type: ts.TypeNode): boolean {
        const typeReference = type as ts.TypeReferenceNode;

        return typeReference.typeName.kind === ts.SyntaxKind.Identifier &&
            typeReference.typeName.text === 'Date'
        ;
    }

    resolve(type: ts.TypeNode) {
        return { type: 'datetime' };
    }
}
