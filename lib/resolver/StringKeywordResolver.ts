import * as ts from 'typescript';
import {Context} from '../Context';
import {StringType, BaseType, Resolver} from '../model';

export class StringKeywordResolver extends Resolver {
    public isSupport(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.StringKeyword;
    }

    public resolve(node: ts.KeywordTypeNode, context: Context): BaseType {
        return new StringType();
    }
}
