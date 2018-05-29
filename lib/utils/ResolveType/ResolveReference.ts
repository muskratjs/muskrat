import * as ts from 'typescript';

import {EnumerateType} from './typeReference';
import {getModelTypeDeclaration, getTypeName, resolveFqTypeName} from './helpers';
import {getModelProperties} from './helpers/getModelProperties';
import {getNodeDescription} from './helpers/getNodeDescription';
import {getModelAdditionalProperties} from './helpers/getModelAdditionalProperties';
import {getModelInheritedProperties} from './helpers/getModelInheritedProperties';
import {SGMetadata} from '../../model/SGMetadata';

// TODO: replace any to reference type
const localReferenceTypeCache: { [typeName: string]: any } = {};
const inProgressTypes: { [typeName: string]: boolean } = {};

export class ResolveReference {
    static resolve(
        type: ts.EntityName,
        genericTypes?: ts.NodeArray<ts.TypeNode>
    ) {
        const typeName = resolveFqTypeName(type);
        const refNameWithGenerics = getTypeName(typeName, genericTypes);

        try {
            const existingType = localReferenceTypeCache[refNameWithGenerics];

            if (existingType) {
                return existingType;
            }

            const referenceEnumType = EnumerateType.resolve(type);

            if (referenceEnumType) {
                localReferenceTypeCache[refNameWithGenerics] = referenceEnumType;

                return referenceEnumType;
            }

            if (inProgressTypes[refNameWithGenerics]) {
                // TODO: CircularDependencyResolver
                console.error('CircularDependencyResolver');
            }

            inProgressTypes[refNameWithGenerics] = true;

            const modelType = getModelTypeDeclaration(type);
            const properties = getModelProperties(modelType, genericTypes);
            const additionalProperties = getModelAdditionalProperties(modelType);
            const inheritedProperties = getModelInheritedProperties(modelType) || [];

            const referenceType = {
                additionalProperties,
                dataType: 'refObject',
                description: getNodeDescription(modelType),
                properties: inheritedProperties,
                refName: refNameWithGenerics,
            };

            referenceType.properties = (referenceType.properties as SGMetadata.Property[]).concat(properties);
            localReferenceTypeCache[refNameWithGenerics] = referenceType;

            return referenceType;
        } catch (err) {
            console.error(`There was a problem resolving type of '${getTypeName(typeName, genericTypes)}'.`);
            throw err;
        }
    }
}
