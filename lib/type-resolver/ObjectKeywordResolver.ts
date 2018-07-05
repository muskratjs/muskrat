import * as ts from 'typescript';
import {Context} from '../Context';
import {AnyType, ObjectType, BaseType, Resolver} from '../model';

export class ObjectKeywordResolver extends Resolver {
    public isSupport(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ObjectKeyword;
    }

    public resolve(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new ObjectType(`object-${node.getFullStart()}`, [], [], new AnyType());
    }
}
