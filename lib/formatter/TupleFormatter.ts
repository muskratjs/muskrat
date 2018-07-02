import {TupleType, BaseType, UnionType, IFormatter} from '../model';
import {Definition} from '../schema';

export class TupleFormatter implements IFormatter {
    public constructor(
        private childFormatter: IFormatter,
    ) {
    }

    public isSupport(type: TupleType): boolean {
        return type instanceof TupleType;
    }

    public getDefinition(type: TupleType): Definition {
        const itemTypes = type.getTypes();
        if (itemTypes.length > 1) {
            return {
                type: 'array',
                items: itemTypes.map((item) => this.childFormatter.getDefinition(item)),
                minItems: itemTypes.length,
                additionalItems: this.childFormatter.getDefinition(new UnionType(itemTypes)),
            };
        } else {
            return {
                type: 'array',
                items: this.childFormatter.getDefinition(itemTypes[0]),
                minItems: 1,
            };
        }
    }

    public getChildren(type: TupleType): BaseType[] {
        return type.getTypes().reduce((result: BaseType[], item) => [
            ...result,
            ...this.childFormatter.getChildren(item),
        ], []);
    }
}
