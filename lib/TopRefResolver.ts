import * as ts from 'typescript';
import {Context} from './Context';
import {BaseType, DefinitionType, IResolver} from './model';

export class TopRefResolver {
    public constructor(
        private childResolver: IResolver,
        private fullName: string,
        private topRef: boolean,
    ) {
    }

    public resolve(node: ts.Node, context: Context): BaseType {
        const baseType = this.childResolver.resolve(node, context);

        if (this.topRef && !(baseType instanceof DefinitionType)) {
            return new DefinitionType(this.fullName, baseType);
        } else if (!this.topRef && (baseType instanceof DefinitionType)) {
            return baseType.getType();
        } else {
            return baseType;
        }
    }
}
