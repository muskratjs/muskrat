import {ReferenceType, DefinitionType, BaseType, IFormatter} from '../model';
import {Definition} from '../schema';

export class ReferenceFormatter implements IFormatter {
    public constructor(
        private childFormatter: IFormatter,
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

        // this means that the referred interface is private
        // so we have to expose it in the schema definitions
        return this.childFormatter.getChildren(new DefinitionType(type.getId(), type.getType()));
    }
}
