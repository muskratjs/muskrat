import {BooleanType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';

export class BooleanFormatter implements IFormatter {
    public isSupport(type: BooleanType): boolean {
        return type instanceof BooleanType;
    }

    public getDefinition(type: BooleanType): Definition {
        return {type: 'boolean'};
    }

    public getChildren(type: BooleanType): BaseType[] {
        return [];
    }
}
