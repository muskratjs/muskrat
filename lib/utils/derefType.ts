import {BaseType, ReferenceType, DefinitionType, AliasType, AnnotatedType} from '../model';

export function derefType(type: BaseType): BaseType {
    if (
        type instanceof ReferenceType ||
        type instanceof DefinitionType ||
        type instanceof AliasType ||
        type instanceof AnnotatedType
    ) {
        return derefType(type.getType());
    }

    return type;
}
