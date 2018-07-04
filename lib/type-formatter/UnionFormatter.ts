import {UnionType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';

export class UnionFormatter implements IFormatter {
    public constructor(
        private formatter: IFormatter,
    ) {
    }

    public isSupport(type: UnionType): boolean {
        return type instanceof UnionType;
    }

    public getDefinition(type: UnionType): Definition {
        const definitions = type.getTypes().map((item) => this.formatter.getDefinition(item));

        // special case for string literals | string -> string
        let stringType = true;
        let oneNotEnum = false;
        for (const def of definitions) {
            if (def.type !== 'string') {
                stringType = false;
                break;
            }
            if (def.enum === undefined) {
                oneNotEnum = true;
            }
        }
        if (stringType && oneNotEnum) {
            return {
                type: 'string',
            };
        }

        if (definitions.length === 0) {
            return {not: {}};
        } else if (definitions.length === 1) {
            return definitions[0];
        } else {
            return {anyOf: definitions};
        }
    }

    public getChildren(type: UnionType): BaseType[] {
        return type.getTypes().reduce((result: BaseType[], item) => [
            ...result,
            ...this.formatter.getChildren(item),
        ], []);
    }
}
