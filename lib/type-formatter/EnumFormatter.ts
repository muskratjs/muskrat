import {EnumType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';
import {typeName, uniqueArray} from '../utils';

export class EnumFormatter implements IFormatter {
    public isSupport(type: EnumType): boolean {
        return type instanceof EnumType;
    }

    public getDefinition(type: EnumType): Definition {
        const values = uniqueArray(type.getValues());
        const types = uniqueArray(values.map(typeName));

        return {
            type: types.length === 1 ? types[0] : types,
            enum: values,
        };
    }

    public getChildren(type: EnumType): BaseType[] {
        return [];
    }
}
