import * as ts from 'typescript';
import {UndefinedType, BaseType, Resolver} from '../model';

export class UndefinedKeywordResolver extends Resolver {
    public isSupport(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.UndefinedKeyword;
    }

    public resolve(node: ts.KeywordTypeNode): BaseType {
        return new UndefinedType();
    }
}
