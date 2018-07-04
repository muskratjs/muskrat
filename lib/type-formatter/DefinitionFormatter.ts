import {DefinitionType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';

export class DefinitionFormatter implements IFormatter {
    public constructor(
        private formatter: IFormatter,
    ) {
    }

    public isSupport(type: DefinitionType): boolean {
        return type instanceof DefinitionType;
    }

    public getDefinition(type: DefinitionType): Definition {
        return {$ref: '#/definitions/' + type.getId()};
    }

    public getChildren(type: DefinitionType): BaseType[] {
        return [
            type,
            ...this.formatter.getChildren(type.getType()),
        ];
    }
}
