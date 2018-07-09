import * as ts from 'typescript';
import {Context} from '../Context';
import {NullType, BaseType, Resolver} from '../model';

export class ParameterResolver extends Resolver {
    public isSupport(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.Parameter;
    }

    public resolve(node: ts.ParameterDeclaration, context: Context): BaseType {
        return new NullType();
    }
}
