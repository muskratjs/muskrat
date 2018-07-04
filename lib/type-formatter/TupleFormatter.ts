import {TupleType, BaseType, UnionType, IFormatter} from '../model';
import {Definition} from '../schema';

export class TupleFormatter implements IFormatter {
    public constructor(
        private formatter: IFormatter,
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
                items: itemTypes.map((item) => this.formatter.getDefinition(item)),
                minItems: itemTypes.length,
                additionalItems: this.formatter.getDefinition(new UnionType(itemTypes)),
            };
        } else {
            return {
                type: 'array',
                items: this.formatter.getDefinition(itemTypes[0]),
                minItems: 1,
            };
        }
    }

    public getChildren(type: TupleType): BaseType[] {
        return type.getTypes().reduce((result: BaseType[], item) => [
            ...result,
            ...this.formatter.getChildren(item),
        ], []);
    }
}
