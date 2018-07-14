import * as deepmerge from 'deepmerge';

import {
    ObjectType,
    ObjectProperty,
    BaseType,
    AnyType,
    UnionType,
    UndefinedType,
    IFormatter,
    IStringMap
} from '../model';
import {Definition} from '../schema';

export class ObjectFormatter implements IFormatter {
    public constructor(
        private formatter: IFormatter,
    ) {
    }

    public isSupport(type: ObjectType): boolean {
        return type instanceof ObjectType;
    }

    public getDefinition(type: ObjectType): Definition {
        if (type.getBaseTypes().length === 0) {
            return this.getObjectDefinition(type);
        }

        let definition = this.getObjectDefinition(type);

        if (type.getBaseTypes()) {
            for (const baseType of type.getBaseTypes()) {
                definition = deepmerge(definition, this.formatter.getDefinition(baseType));
            }
        }

        return definition;
    }

    public getChildren(type: ObjectType): BaseType[] {
        const properties = type.getProperties();
        const additionalProperties = type.getAdditionalProperties();

        return [
            ...type.getBaseTypes().reduce((result: BaseType[], baseType) => [
                ...result,
                ...this.formatter.getChildren(baseType),
            ], []),

            ...additionalProperties instanceof BaseType ?
                this.formatter.getChildren(additionalProperties) :
                [],

            ...properties.reduce((result: BaseType[], property) => [
                ...result,
                ...this.formatter.getChildren(property.getType()),
            ], []),
        ];
    }

    private getObjectDefinition(type: ObjectType): Definition {
        const objectProperties = type.getProperties();
        const additionalProperties = type.getAdditionalProperties();

        const required = objectProperties
            .map((property) => this.prepareObjectProperty(property))
            .filter((property) => property.isRequired())
            .map((property) => property.getName());

        const properties = objectProperties
            .map((property) => this.prepareObjectProperty(property))
            .reduce((result: IStringMap<Definition>, property) => ({
                ...result,
                [property.getName()]: this.formatter.getDefinition(property.getType()),
            }), {})
        ;

        if (type.getId().indexOf('class') === 0) {
            for (const key of Object.keys(properties)) {
                delete (properties as any)[key]['enum'];
                delete (properties as any)[key]['minItems'];
                delete (properties as any)[key]['additionalItems'];

                const items = (properties as any)[key].items;

                if (items && Array.isArray(items)) {
                    const types = items
                        .map((i: any) => i.type)
                        .filter((value: any, index: any, self: any) => self.indexOf(value) === index)
                    ;

                    (properties as any)[key].items = {
                        type: types.length > 1 ? types : types[0]
                    };
                }
            }
        }

        return {
            type: 'object',
            ...(Object.keys(properties).length > 0 ? {properties} : {}),
            ...(required.length > 0 ? {required} : {}),
            ...this.getAdditionalProperties(additionalProperties),
        };
    }

    private getAdditionalProperties(additionalProperties: BaseType | undefined): Definition {
        if (!additionalProperties) {
            return {additionalProperties: false};
        }

        return additionalProperties instanceof AnyType
            ? {}
            : {additionalProperties: this.formatter.getDefinition(additionalProperties)};
    }

    private prepareObjectProperty(property: ObjectProperty): ObjectProperty {
        const propType = property.getType();
        if (propType instanceof UndefinedType) {
            return new ObjectProperty(property.getName(), new UndefinedType(), false);
        } else if (!(propType instanceof UnionType)) {
            return property;
        }

        const requiredTypes = propType.getTypes().filter((it) => !(it instanceof UndefinedType));
        if (propType.getTypes().length === requiredTypes.length) {
            return property;
        } else if (requiredTypes.length === 0) {
            return new ObjectProperty(property.getName(), new UndefinedType(), false);
        }

        return new ObjectProperty(
            property.getName(),
            requiredTypes.length === 1 ? requiredTypes[0] : new UnionType(requiredTypes),
            false,
        );
    }
}
