import * as ts from 'typescript';
import {Context} from './Context';
import {BaseType, DefinitionType, IResolver} from './model';
import {localSymbolAtNode, symbolAtNode, assertDefined} from './utils';

export class ExposeResolver implements IResolver {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private resolver: IResolver,
        private expose: 'all' | 'none' | 'export',
    ) {
    }

    public isSupport(node: ts.Node): boolean {
        return this.resolver.isSupport(node);
    }

    public resolve(node: ts.Node, context: Context): BaseType {
        const baseType = this.resolver.resolve(node, context);
        if (!this.isExportNode(node)) {
            return baseType;
        }

        return new DefinitionType(
            this.getDefinitionName(node, context),
            baseType,
        );
    }

    private isExportNode(node: ts.Node): boolean {
        if (this.expose === 'all') {
            return true;
        } else if (this.expose === 'none') {
            return false;
        }

        const localSymbol = localSymbolAtNode(node);
        return localSymbol ? 'exportSymbol' in localSymbol : false;
    }

    private getDefinitionName(node: ts.Node, context: Context): string {
        const symbol = assertDefined(symbolAtNode(node));
        const fullName = this.typeChecker.getFullyQualifiedName(symbol).replace(/^".*"\./, '');
        const argumentIds = context.getArguments().map((arg) => arg.getId());

        return argumentIds.length ? `${fullName}<${argumentIds.join(',')}>` : fullName;
    }
}
