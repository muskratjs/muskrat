import * as ts from 'typescript';

export interface Resolver {
    isSupport(type: ts.TypeNode): boolean;

    resolve(type: ts.TypeNode): object;
}

export class TypeResolver {
    private resolvers: Set<Resolver> = new Set();
    private nodes: ts.Node[] = [];

    constructor(nodes: ts.Node[]) {
        this.nodes = nodes;
    }

    register(resolver: { new (...args: any[]): any }) {
        const resolverObject = new resolver(this);

        this.resolvers.add(resolverObject);

        return this;
    }

    resolve(type: ts.TypeNode) {
        let res: Resolver;

        for (const resolver of Array.from(this.resolvers)) {
            if (resolver.isSupport(type)) {
                res = resolver;
            }
        }

        if (res) {
            return res.resolve(type);
        }

        throw new Error('Type not resolved');
    }
}
