import {LiteralType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';
import {typeName} from '../utils';

export class LiteralFormatter implements IFormatter {
    public isSupport(type: LiteralType): boolean {
        return type instanceof LiteralType;
    }

    public getDefinition(type: LiteralType): Definition {
        return {
            type: typeName(type.getValue()),
            enum: [type.getValue()],
        };
    }

    public getChildren(type: LiteralType): BaseType[] {
        return [];
    }
}
