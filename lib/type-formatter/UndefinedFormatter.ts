import {UndefinedType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';

export class UndefinedFormatter implements IFormatter {
    public isSupport(type: UndefinedType): boolean {
        return type instanceof UndefinedType;
    }

    public getDefinition(type: UndefinedType): Definition {
        return {not: {}};
    }

    public getChildren(type: UndefinedType): BaseType[] {
        return [];
    }
}
