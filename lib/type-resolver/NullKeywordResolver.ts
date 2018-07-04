import * as ts from 'typescript';
import {Context} from '../Context';
import {NullType, BaseType, Resolver} from '../model';

export class NullKeywordResolver extends Resolver {
    public isSupport(node: ts.NullLiteral): boolean {
        return node.kind === ts.SyntaxKind.NullKeyword;
    }

    public resolve(node: ts.NullLiteral, context: Context): BaseType {
        return new NullType();
    }
}
