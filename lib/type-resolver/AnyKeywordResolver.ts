import * as ts from 'typescript';
import {BaseType, AnyType, IResolver} from '../model';

export class AnyKeywordResolver implements IResolver {
    public isSupport(node: ts.KeywordTypeNode): boolean {
        return node.kind === ts.SyntaxKind.AnyKeyword;
    }

    public resolve(node: ts.KeywordTypeNode): BaseType {
        return new AnyType();
    }
}
