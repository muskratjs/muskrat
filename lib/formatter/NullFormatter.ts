import {NullType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';

export class NullFormatter implements IFormatter {
    public isSupport(type: NullType): boolean {
        return type instanceof NullType;
    }

    public getDefinition(type: NullType): Definition {
        return {type: 'null'};
    }

    public getChildren(type: NullType): BaseType[] {
        return [];
    }
}
