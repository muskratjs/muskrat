import {AliasType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';

export class AliasFormatter implements IFormatter {
    public constructor(
        private formatter: IFormatter,
    ) {
    }

    public isSupport(type: AliasType): boolean {
        return type instanceof AliasType;
    }

    public getDefinition(type: AliasType): Definition {
        return this.formatter.getDefinition(type.getType());
    }

    public getChildren(type: AliasType): BaseType[] {
        return this.formatter.getChildren(type.getType());
    }
}
