import * as ts from 'typescript';
import {Context} from '../Context';
import {TupleType, BaseType, Resolver} from '../model';

export class TupleTypeResolver extends Resolver {
    public isSupport(node: ts.TupleTypeNode): boolean {
        return node.kind === ts.SyntaxKind.TupleType;
    }

    public resolve(node: ts.TupleTypeNode, context: Context): BaseType {
        return new TupleType(
            node.elementTypes.map((item) => {
                return this.resolver.resolve(item, context);
            }),
        );
    }
}
