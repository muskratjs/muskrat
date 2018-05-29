import * as ts from "typescript";

import {ResolveType, UsableDeclaration} from "../ResolveType";
import {JsDoc} from "../../JsDoc";
import {getModelTypeDeclaration} from "./getModelTypeDeclaration";
import {getNodeDescription} from "./getNodeDescription";
import {hasPublicModifier} from "./hasPublicModifier";
import {getInitializerValue} from "./getInitializerValue";
import {SGMetadata} from "../../../model/SGMetadata";

export function getModelProperties(node: UsableDeclaration, genericTypes?: ts.NodeArray<ts.TypeNode>): SGMetadata.Property[] {
    const isIgnored = (e: ts.TypeElement | ts.ClassElement) => {
        return  JsDoc.hasTag(e, tag => tag.tagName.text === 'ignore');
    };

    if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
        const interfaceDeclaration = node as ts.InterfaceDeclaration;

        return interfaceDeclaration.members
            .filter(member => !isIgnored(member) && member.kind === ts.SyntaxKind.PropertySignature)
            .map((member: any) => {
                const propertyDeclaration = member as ts.PropertyDeclaration;
                const identifier = propertyDeclaration.name as ts.Identifier;

                if (!propertyDeclaration.type) {
                    throw new Error(`No valid type found for property declaration.`);
                }

                let aType = propertyDeclaration.type;

                // aType.kind will always be a ReferenceType when the property of Interface<T> is of type T
                if (aType.kind === ts.SyntaxKind.TypeReference && genericTypes && genericTypes.length && node.typeParameters) {

                    // The type definitions are conviently located on the object which allow us to map -> to the genericTypes
                    const typeParams = node.typeParameters
                        .map((typeParam: ts.TypeParameterDeclaration) => typeParam.name.text)
                    ;

                    // I am not sure in what cases
                    const typeIdentifier = (aType as ts.TypeReferenceNode).typeName;

                    // typeIdentifier can either be a Identifier or a QualifiedName
                    const typeIdentifierName = (typeIdentifier as ts.Identifier).text
                        ? (typeIdentifier as ts.Identifier).text
                        : (typeIdentifier as ts.QualifiedName).right.text
                    ;

                    // I could not produce a situation where this did not find it so its possible this check is irrelevant
                    const indexOfType = typeParams.indexOf(typeIdentifierName);

                    if (indexOfType >= 0) {
                        aType = genericTypes[indexOfType] as ts.TypeNode;
                    }
                }

                return {
                    description: getNodeDescription(propertyDeclaration),
                    name: identifier.text,
                    required: !propertyDeclaration.questionToken,
                    type: ResolveType.resolve(aType, aType.parent),
                };
            });
    }

    // Type alias model
    if (node.kind === ts.SyntaxKind.TypeAliasDeclaration) {
        const aliasDeclaration = node as ts.TypeAliasDeclaration;
        const properties: any[] = [];

        if (aliasDeclaration.type.kind === ts.SyntaxKind.IntersectionType) {
            const intersectionTypeNode = aliasDeclaration.type as ts.IntersectionTypeNode;

            intersectionTypeNode.types.forEach((type) => {
                if (type.kind === ts.SyntaxKind.TypeReference) {
                    const typeReferenceNode = type as ts.TypeReferenceNode;
                    const modelType = getModelTypeDeclaration(typeReferenceNode.typeName);
                    const modelProps = getModelProperties(modelType);
                    properties.push(...modelProps);
                }
            });
        }

        if (aliasDeclaration.type.kind === ts.SyntaxKind.TypeReference) {
            const typeReferenceNode = aliasDeclaration.type as ts.TypeReferenceNode;
            const modelType = getModelTypeDeclaration(typeReferenceNode.typeName);
            const modelProps = getModelProperties(modelType);
            properties.push(...modelProps);
        }

        return properties;
    }

    // Class model
    const classDeclaration = node as ts.ClassDeclaration;
    const properties = classDeclaration.members
        .filter(member => {
            const ignore = isIgnored(member);
            return !ignore;
        })
        .filter((member) => member.kind === ts.SyntaxKind.PropertyDeclaration)
        .filter((member) => hasPublicModifier(member)) as Array<ts.PropertyDeclaration | ts.ParameterDeclaration>
    ;

    const classConstructor = classDeclaration
        .members
        .find((member) => member.kind === ts.SyntaxKind.Constructor) as ts.ConstructorDeclaration;

    if (classConstructor && classConstructor.parameters) {
        const constructorProperties = classConstructor.parameters
            .filter((parameter) => hasPublicModifier(parameter))
        ;

        properties.push(...constructorProperties);
    }

    return properties
        .map((property) => {
            const identifier = property.name as ts.Identifier;
            let typeNode = property.type;

            const typeChecker = ResolveType.typeChecker;

            if (!typeNode) {
                const tsType = typeChecker.getTypeAtLocation(property);

                typeNode = typeChecker.typeToTypeNode(tsType);
            }

            if (!typeNode) {
                throw new Error(`No valid type found for property declaration.`);
            }

            const type = ResolveType.resolve(typeNode, property);

            return {
                default: getInitializerValue(property.initializer, type),
                description: getNodeDescription(property),
                name: identifier.text,
                required: !property.questionToken && !property.initializer,
                type,
            };
        });
}
