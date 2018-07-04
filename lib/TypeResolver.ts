import * as ts from 'typescript';
import {Context} from './Context';
import {IResolver, BaseType} from './model';
import {UnknownNodeException} from './exception';

export class TypeResolver implements IResolver {
    public constructor(
        private resolvers: IResolver[] = [],
    ) {
    }

    public addResolver(resolver: IResolver): TypeResolver {
        this.resolvers.push(resolver);

        return this;
    }

    public isSupport(node: ts.Node): boolean {
        return this.resolvers.some((resolver) => resolver.isSupport(node));
    }

    public resolve(node: ts.Node, context: Context): BaseType {
        return this.getResolver(node, context).resolve(node, context);
    }

    private getResolver(node: ts.Node, context: Context): IResolver {
        for (const resolver of this.resolvers) {
            if (resolver.isSupport(node)) {
                return resolver;
            }
        }

        throw new UnknownNodeException(node, context.getReference());
    }
}
