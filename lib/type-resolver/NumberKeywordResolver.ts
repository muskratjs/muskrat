import * as ts from 'typescript';
import {Context} from '../Context';
import {NumberType, BaseType, Resolver} from '../model';

export class NumberKeywordResolver extends Resolver {
    public isSupport(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.NumberKeyword;
    }

    public resolve(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new NumberType();
    }
}
