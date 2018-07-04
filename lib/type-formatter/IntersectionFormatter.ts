import {IntersectionType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';

export class IntersectionFormatter implements IFormatter {
    public constructor(
        private formatter: IFormatter,
    ) {
    }

    public isSupport(type: IntersectionType): boolean {
        return type instanceof IntersectionType;
    }

    public getDefinition(type: IntersectionType): Definition {
        const definitions = type.getTypes().map((item) => this.formatter.getDefinition(item));

        // TODO: optimize intersection
        if (definitions.length === 0) {
            return {not: {}};
        } else if (definitions.length === 1) {
            return definitions[0];
        } else {
            return {allOf: definitions};
        }
    }

    public getChildren(type: IntersectionType): BaseType[] {
        return type.getTypes().reduce((result: BaseType[], item) => [
            ...result,
            ...this.formatter.getChildren(item),
        ], []);
    }
}
