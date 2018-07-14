import * as ts from 'typescript';
import {Context} from '../Context';
import {BaseType, AnnotatedType, IResolver, IAnnotationsReader} from '../model';

export class AnnotationsResolver {
    public constructor(
        private resolver: IResolver,
        private annotationsReader: IAnnotationsReader,
    ) {
    }

    public isSupport(node: ts.Node): boolean {
        return this.resolver.isSupport(node);
    }

    public resolve(node: ts.Node, context: Context): BaseType {
        const baseType = this.resolver.resolve(node, context);
        const annotations = this.annotationsReader.getAnnotations(this.getAnnotatedNode(node));

        return !annotations ? baseType : new AnnotatedType(baseType, annotations);
    }

    private getAnnotatedNode(node: ts.Node): ts.Node {
        if (!node.parent) {
            return node;
        } else if (node.parent.kind === ts.SyntaxKind.PropertySignature) {
            return node.parent;
        } else if (node.parent.kind === ts.SyntaxKind.PropertyDeclaration) {
            return node.parent;
        } else if (node.parent.kind === ts.SyntaxKind.Parameter) {
            return node.parent;
        } else if (node.parent.kind === ts.SyntaxKind.IndexSignature) {
            return node.parent;
        } else {
            return node;
        }
    }
}
