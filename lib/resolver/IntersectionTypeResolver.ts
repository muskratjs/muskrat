import * as ts from 'typescript';
import {Context} from '../Context';
import {IntersectionType, BaseType, Resolver} from '../model';

export class IntersectionTypeResolver extends Resolver {
    public isSupport(node: ts.IntersectionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.IntersectionType;
    }

    public resolve(node: ts.IntersectionTypeNode, context: Context): BaseType {
        return new IntersectionType(
            node.types.map((subNode) => this.childResolver.resolve(subNode, context)),
        );
    }
}
