import {AnyType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';

export class AnyFormatter implements IFormatter {
    public isSupport(type: AnyType): boolean {
        return type instanceof AnyType;
    }

    public getDefinition(type: AnyType): Definition {
        return {};
    }

    public getChildren(type: AnyType): BaseType[] {
        return [];
    }
}
