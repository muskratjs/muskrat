import * as ts from 'typescript';
import {Context} from '../Context';
import {BaseType, Resolver} from '../model';
import {assertDefined} from '../utils';

export class ExpressionWithTypeArgumentsResolver extends Resolver {
    public isSupport(node: ts.ExpressionWithTypeArguments): boolean {
        return node.kind === ts.SyntaxKind.ExpressionWithTypeArguments;
    }

    public resolve(node: ts.ExpressionWithTypeArguments, context: Context): BaseType {
        const typeSymbol = assertDefined(this.typeChecker.getSymbolAtLocation(node.expression));

        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            const declarations = assertDefined(aliasedSymbol.declarations);
            const declaration = declarations.find((it) => this.isValidDeclaration(it));

            return this.childResolver.resolve(
                assertDefined(declaration),
                this.createSubContext(node, context),
            );
        } else if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        } else {
            const declarations = assertDefined(typeSymbol.declarations);
            const declaration = declarations.find((it) => this.isValidDeclaration(it));

            return this.childResolver.resolve(
                assertDefined(declaration),
                this.createSubContext(node, context),
            );
        }
    }

    private createSubContext(node: ts.ExpressionWithTypeArguments, parentContext: Context): Context {
        const subContext = new Context(node);

        if (node.typeArguments && node.typeArguments.length) {
            node.typeArguments.forEach((typeArg) => {
                subContext.pushArgument(this.childResolver.resolve(typeArg, parentContext));
            });
        }

        return subContext;
    }

    private isValidDeclaration(declration: ts.Declaration): boolean {
        return (
            declration.kind !== ts.SyntaxKind.ModuleDeclaration &&
            declration.kind !== ts.SyntaxKind.VariableDeclaration
        );
    }
}
