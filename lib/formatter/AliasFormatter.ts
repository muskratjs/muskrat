import {AliasType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';

export class AliasFormatter implements IFormatter {
    public constructor(
        private childFormatter: IFormatter,
    ) {
    }

    public isSupport(type: AliasType): boolean {
        return type instanceof AliasType;
    }

    public getDefinition(type: AliasType): Definition {
        return this.childFormatter.getDefinition(type.getType());
    }

    public getChildren(type: AliasType): BaseType[] {
        return this.childFormatter.getChildren(type.getType());
    }
}
