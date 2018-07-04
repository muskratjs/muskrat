import * as ts from 'typescript';
import {BaseType, BooleanType, Resolver} from '../model';

export class BooleanKeywordResolver extends Resolver {
    public isSupport(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.BooleanKeyword;
    }

    public resolve(node: ts.KeywordTypeNode): BaseType {
        return new BooleanType();
    }
}
