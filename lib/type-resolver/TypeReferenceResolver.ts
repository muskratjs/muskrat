import * as ts from 'typescript';
import {Context} from '../Context';
import {ArrayType, BaseType, Resolver} from '../model';
import {assertDefined} from '../utils';

export class TypeReferenceResolver extends Resolver {
    public isSupport(node: ts.TypeReferenceNode): boolean {
        return node.kind === ts.SyntaxKind.TypeReference;
    }

    public resolve(node: ts.TypeReferenceNode, context: Context): BaseType {
        const typeSymbol = assertDefined(this.typeChecker.getSymbolAtLocation(node.typeName));
        if (typeSymbol.flags === ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            const declarations = assertDefined(aliasedSymbol.declarations);
            const declaration = declarations.find((it) => this.isValidDeclaration(it));

            return this.resolver.resolve(
                assertDefined(declaration),
                this.createSubContext(node, context),
            );
        } else if (typeSymbol.flags === ts.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        } else if (typeSymbol.name === 'Array' || typeSymbol.name === 'ReadonlyArray') {
            const arrayItemType = this.createSubContext(node, context).getArguments()[0];

            return new ArrayType(assertDefined(arrayItemType));
        } else {
            const declarations = assertDefined(typeSymbol.declarations);
            const declaration = declarations.find((it) => this.isValidDeclaration(it));

            return this.resolver.resolve(
                assertDefined(declaration),
                this.createSubContext(node, context),
            );
        }
    }

    private createSubContext(node: ts.TypeReferenceNode, parentContext: Context): Context {
        const subContext = new Context(node);

        if (node.typeArguments && node.typeArguments.length) {
            node.typeArguments.forEach((typeArg) => {
                subContext.pushArgument(this.resolver.resolve(typeArg, parentContext));
            });
        }

        return subContext;
    }

    private isValidDeclaration(declaration: ts.Declaration): boolean {
        return (
            declaration.kind !== ts.SyntaxKind.ModuleDeclaration &&
            declaration.kind !== ts.SyntaxKind.VariableDeclaration
        );
    }
}
