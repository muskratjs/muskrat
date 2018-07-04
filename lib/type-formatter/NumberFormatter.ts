import {NumberType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';

export class NumberFormatter implements IFormatter {
    public isSupport(type: NumberType): boolean {
        return type instanceof NumberType;
    }

    public getDefinition(type: NumberType): Definition {
        return {type: 'number'};
    }

    public getChildren(type: NumberType): BaseType[] {
        return [];
    }
}
