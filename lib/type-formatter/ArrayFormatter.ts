import {ArrayType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';

export class ArrayFormatter implements IFormatter {
    public constructor(
        private formatter: IFormatter,
    ) {
    }

    public isSupport(type: ArrayType): boolean {
        return type instanceof ArrayType;
    }

    public getDefinition(type: ArrayType): Definition {
        return {
            type: 'array',
            items: this.formatter.getDefinition(type.getItem()),
        };
    }

    public getChildren(type: ArrayType): BaseType[] {
        return this.formatter.getChildren(type.getItem());
    }
}
