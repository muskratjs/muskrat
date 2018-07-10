import * as ts from 'typescript';
import {Context} from './Context';
import {BaseType, ReferenceType, IResolver} from './model';

export class CircularReferenceResolver implements IResolver {
    private circular = new Map<string, BaseType>();

    public constructor(
        private resolver: IResolver,
    ) {
    }

    public isSupport(node: ts.Node): boolean {
        return this.resolver.isSupport(node);
    }

    public resolve(node: ts.Node, context: Context): BaseType {
        const key = this.createCacheKey(node, context);

        if (this.circular.has(key)) {
            return this.circular.get(key)!;
        }

        const reference = new ReferenceType();
        this.circular.set(key, reference);
        reference.setType(this.resolver.resolve(node, context));
        this.circular.delete(key);

        return reference.getType();
    }

    private createCacheKey(node: ts.Node | undefined, context: Context): string {
        const ids = [];
        while (node) {
            ids.push(node.pos, node.end);
            node = node.parent;
        }

        return ids.join('-') + '<' + context.getArguments().map((arg) => arg.getId()).join(',') + '>';
    }
}
