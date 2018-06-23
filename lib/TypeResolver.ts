import * as ts from 'typescript';
import {EventEmitter} from 'events';

export interface Resolver {
    isSupport(type: ts.TypeNode | ts.Declaration | any): boolean;

    resolve(type: ts.TypeNode | ts.Declaration | any): object;
}

export class TypeResolver extends EventEmitter {
    private resolvers: Set<Resolver> = new Set();
    private nodes: ts.Node[] = [];
    private readonly typeChecker: ts.TypeChecker;

    constructor(nodes: ts.Node[], typeChecker: ts.TypeChecker) {
        super();

        this.nodes = nodes;
        this.typeChecker = typeChecker;
    }

    register(resolver: { new (...args: any[]): any }) {
        const resolverObject = new resolver(this);

        this.resolvers.add(resolverObject);

        return this;
    }

    getTypeChecker() {
        return this.typeChecker;
    }

    resolve(type: ts.TypeNode | ts.Declaration | ts.Expression) {
        let res: Resolver;

        if (!type) {
            return;
        }

        for (const resolver of Array.from(this.resolvers)) {
            if (resolver.isSupport(type)) {
                res = resolver;
            }
        }

        if (res) {
            const resolvedType = res.resolve(type);

            if (!resolvedType) {
                throw new Error(`Type not resolved kind: ${type.kind}`);
            }

            this.emit('resolved', resolvedType);

            return resolvedType;
        }

        throw new Error(`Type not resolved kind: ${type.kind}`);
    }
}
