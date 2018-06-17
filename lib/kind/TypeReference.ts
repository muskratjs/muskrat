import * as ts from 'typescript';
import {Resolver, TypeResolver} from '../TypeResolver';

export class TypeReference implements Resolver {
    private typeResolver: TypeResolver;
    private cache: { [typeName: string]: any } = {};
    private inProcess: { [typeName: string]: any } = {};

    constructor(typeResolver: TypeResolver) {
        this.typeResolver = typeResolver;
    }

    isSupport(type: ts.TypeNode): boolean {
        return type.kind === ts.SyntaxKind.TypeReference;
    }

    resolve(type: ts.TypeReferenceNode) {
        const symbol = this.typeResolver.getTypeChecker().getSymbolAtLocation(type.typeName);

        if (symbol.flags === ts.SymbolFlags.Alias) {
            const declaration = this.getDeclaration(symbol);

            if (declaration) {
                const name = (declaration as ts.DeclarationStatement).name.text;

                if (this.cache[name]) {
                    return this.cache[name];
                }

                this.inProcess[name] = true;
                this.cache[name] = this.typeResolver.resolve(declaration);

                return this.cache[name];
            }
        } else if (symbol.flags === ts.SymbolFlags.TypeParameter) {
            console.log('TypeParameter');
        } else if (symbol.name === 'Array' || symbol.name === 'ReadonlyArray') {
            console.log('Array');
        } else {
            const declaration = symbol.declarations.find((it) =>
                it.kind !== ts.SyntaxKind.ModuleDeclaration &&
                it.kind !== ts.SyntaxKind.VariableDeclaration
            );

            const name = (declaration as ts.DeclarationStatement).name.text;

            if (this.cache[name]) {
                return this.cache[name];
            }

            if (!this.inProcess[name]) {
                return this.typeResolver.resolve(declaration);
            }

            return {
                type: 'circular',
                name,
            };
        }

        return { type: 'object' };
    }

    private getDeclaration(symbol: ts.Symbol) {
        const aliasedSymbol = this.typeResolver.getTypeChecker().getAliasedSymbol(symbol);

        if (aliasedSymbol) {
            return aliasedSymbol.declarations
                .find((it) =>
                    it.kind !== ts.SyntaxKind.ModuleDeclaration &&
                    it.kind !== ts.SyntaxKind.VariableDeclaration
                )
            ;
        }

        return;
    }
}
