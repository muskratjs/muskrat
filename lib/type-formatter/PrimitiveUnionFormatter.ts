import {UnionType, BaseType, PrimitiveType, StringType, NumberType, BooleanType, NullType, IFormatter} from '../model';
import {Definition, RawTypeName} from '../schema';
import {uniqueArray} from '../utils';
import {LogicException} from '../exception';

export class PrimitiveUnionFormatter implements IFormatter {
    public isSupport(type: UnionType): boolean {
        return (type instanceof UnionType && type.getTypes().length > 0 && this.isPrimitiveUnion(type));
    }

    public getDefinition(type: UnionType): Definition {
        return {
            type: uniqueArray(
                type.getTypes().map((item) => this.getPrimitiveType(item)),
            ),
        };
    }

    public getChildren(type: UnionType): BaseType[] {
        return [];
    }

    private isPrimitiveUnion(type: UnionType): boolean {
        return type.getTypes().every((item) => item instanceof PrimitiveType);
    }

    private getPrimitiveType(item: BaseType): RawTypeName {
        if (item instanceof StringType) {
            return 'string';
        } else if (item instanceof NumberType) {
            return 'number';
        } else if (item instanceof BooleanType) {
            return 'boolean';
        } else if (item instanceof NullType) {
            return 'null';
        }

        throw new LogicException('Unexpected code branch');
    }
}
