import * as ts from 'typescript';
import {Context} from '../Context';
import {UnionType, BaseType, Resolver} from '../model';
import {getTypeKeys} from '../utils';

export class TypeOperatorResolver extends Resolver {
    public isSupport(node: ts.TypeOperatorNode): boolean {
        return node.kind === ts.SyntaxKind.TypeOperator;
    }

    public resolve(node: ts.TypeOperatorNode, context: Context): BaseType {
        const type = this.resolver.resolve(node.type, context);
        const keys = getTypeKeys(type);

        return new UnionType(keys);
    }
}
