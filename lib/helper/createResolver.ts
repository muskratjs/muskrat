import * as ts from 'typescript';
import {values} from 'lodash';
import * as resolvers from '../type-resolver';
import {TypeResolver} from '../TypeResolver';
import {ExposeResolver} from '../ExposeResolver';
import {CircularReferenceResolver} from '../CircularReferenceResolver';
import {AnnotationsReader, AnnotationsResolver} from '../annotations';

export function createResolver(typeChecker: ts.TypeChecker) {
    const typeResolver = new TypeResolver();

    for (const resolver of values(resolvers)) {
        typeResolver.addResolver(
            new CircularReferenceResolver(
                new ExposeResolver(
                    typeChecker,
                    new AnnotationsResolver(
                        new (resolver as any)(typeChecker, typeResolver),
                        new AnnotationsReader()
                    ),
                    'export'
                )
            )
        );
    }

    return typeResolver;
}
