import * as ts from 'typescript';
import {Context} from '../Context';
import {UnionType, BaseType, Resolver} from '../model';

export class UnionTypeResolver extends Resolver {
    public isSupport(node: ts.UnionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.UnionType;
    }

    public resolve(node: ts.UnionTypeNode, context: Context): BaseType {
        return new UnionType(
            node.types.map((subNode) => {
                return this.resolver.resolve(subNode, context);
            }),
        );
    }
}
