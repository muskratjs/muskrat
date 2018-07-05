import * as ts from 'typescript';
import {Context} from '../Context';
import {AliasType, BaseType, Resolver} from '../model';
import {assertDefined} from '../utils';

export class TypeAliasDeclarationResolver extends Resolver {
    public isSupport(node: ts.TypeAliasDeclaration): boolean {
        return node.kind === ts.SyntaxKind.TypeAliasDeclaration;
    }

    public resolve(node: ts.TypeAliasDeclaration, context: Context): BaseType {
        if (node.typeParameters && node.typeParameters.length) {
            node.typeParameters.forEach((typeParam) => {
                const nameSymbol = assertDefined(this.typeChecker.getSymbolAtLocation(typeParam.name));
                context.pushParameter(nameSymbol.name);
            });
        }

        return new AliasType(
            this.getTypeId(node, context),
            this.resolver.resolve(node.type, context),
        );
    }

    private getTypeId(node: ts.Node, context: Context): string {
        const fullName = `alias-${node.getFullStart()}`;
        const argumentIds = context.getArguments().map((arg) => arg.getId());

        return argumentIds.length ? `${fullName}<${argumentIds.join(',')}>` : fullName;
    }
}
