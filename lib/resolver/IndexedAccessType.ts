import * as ts from 'typescript';
import {Context} from '../Context';
import {LiteralType, BaseType, Resolver} from '../model';
import {assertDefined, assertInstanceOf, getTypeByKey} from '../utils';

export class IndexedAccessType extends Resolver {
    public isSupport(node: ts.IndexedAccessTypeNode): boolean {
        return node.kind === ts.SyntaxKind.IndexedAccessType;
    }

    public resolve(node: ts.IndexedAccessTypeNode, context: Context): BaseType {
        const indexType = this.childResolver.resolve(node.indexType, context);
        const indexLiteral = assertInstanceOf(
            indexType,
            LiteralType,
            `Index access type should be instance of LiteralType ("${indexType.getId()}" given)`,
        );

        const objectType = this.childResolver.resolve(node.objectType, context);

        return assertDefined(
            getTypeByKey(objectType, indexLiteral),
            `Invalid index "${indexLiteral.getValue()}" in type "${objectType.getId()}"`,
        );
    }
}
