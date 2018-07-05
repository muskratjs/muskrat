import {StringType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';

export class StringFormatter implements IFormatter {
    public isSupport(type: StringType): boolean {
        return type instanceof StringType;
    }

    public getDefinition(type: StringType): Definition {
        return {type: 'string'};
    }

    public getChildren(type: StringType): BaseType[] {
        return [];
    }
}
