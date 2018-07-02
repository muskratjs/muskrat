import {BaseType, AnnotatedType, IFormatter} from '../model';
import {Definition} from '../schema';

export class AnnotatedFormatter implements IFormatter {
    public constructor(
        private childFormatter: IFormatter,
    ) {
    }

    public isSupport(type: AnnotatedType): boolean {
        return type instanceof AnnotatedType;
    }

    public getDefinition(type: AnnotatedType): Definition {
        return {
            ...this.childFormatter.getDefinition(type.getType()),
            ...type.getAnnotations(),
        };
    }

    public getChildren(type: AnnotatedType): BaseType[] {
        return this.childFormatter.getChildren(type.getType());
    }
}
