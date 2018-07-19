import {ReferenceType, DefinitionType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';

export class ReferenceFormatter implements IFormatter {
    public constructor(
        private formatter: IFormatter,
    ) {
    }

    public isSupport(type: ReferenceType): boolean {
        return type instanceof ReferenceType;
    }

    public getDefinition(type: ReferenceType): Definition {
        return {$ref: '#/definitions/' + type.getId()};
    }

    public getChildren(type: ReferenceType): BaseType[] {
        if (type.getType() instanceof DefinitionType) {
            return [];
        }

        return this.formatter.getChildren(new DefinitionType(type.getId(), type.getType()));
    }
}
