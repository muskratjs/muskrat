import * as ts from 'typescript';
import {UsableDeclaration} from '../ResolveType';
import {ResolveReference} from '../ResolveReference';
import {SGMetadata} from '../../../model/SGMetadata';

export function getModelInheritedProperties(modelTypeDeclaration: UsableDeclaration): SGMetadata.Property[] {
    const properties = [] as SGMetadata.Property[];

    if (modelTypeDeclaration.kind === ts.SyntaxKind.TypeAliasDeclaration) {
        return [];
    }

    const heritageClauses = modelTypeDeclaration.heritageClauses;

    if (!heritageClauses) {
        return properties;
    }

    heritageClauses.forEach((clause) => {
        if (!clause.types) {
            return;
        }

        clause.types.forEach((t) => {
            const baseEntityName = t.expression as ts.EntityName;
            const referenceType = ResolveReference.resolve(baseEntityName);

            if (referenceType.properties) {
                referenceType.properties.forEach((property: any) => properties.push(property));
            }
        });
    });

    return properties;
}
