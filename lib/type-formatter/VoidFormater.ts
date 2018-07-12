import {BaseType, IFormatter, VoidType} from '../model';
import {Definition} from '../schema';

export class VoidFormater implements IFormatter {
    public isSupport(type: VoidType): boolean {
        return type instanceof VoidType;
    }

    public getDefinition(type: VoidType): Definition {
        return {};
    }

    public getChildren(type: VoidType): BaseType[] {
        return [];
    }
}
