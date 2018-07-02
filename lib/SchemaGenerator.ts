import * as ts from 'typescript';
import {Context} from './Context';
import {BaseType, DefinitionType, IResolver, IFormatter, IStringMap} from './model';
import {Schema, Definition} from './schema';
import {NoRootTypeException} from './exception';
import {localSymbolAtNode, symbolAtNode, assertDefined} from './utils';

export class SchemaGenerator {
    public constructor(
        private program: ts.Program,
        private resolver: IResolver,
        private formatter: IFormatter,
    ) {
    }

    public createSchema(fullName: string): Schema {
        const rootNode = this.findRootNode(fullName);
        const rootType = this.resolver.resolve(rootNode, new Context());

        return {
            $schema: 'http://json-schema.org/draft-06/schema#',
            definitions: this.getRootChildDefinitions(rootType),
            ...this.getRootTypeDefinition(rootType),
        };
    }

    private findRootNode(fullName: string): ts.Node {
        const typeChecker = this.program.getTypeChecker();
        const allTypes = new Map<string, ts.Node>();

        this.program.getSourceFiles().forEach((sourceFile) => this.inspectNode(sourceFile, typeChecker, allTypes));

        if (!allTypes.has(fullName)) {
            throw new NoRootTypeException(fullName);
        }

        return allTypes.get(fullName)!;
    }

    private inspectNode(node: ts.Node, typeChecker: ts.TypeChecker, allTypes: Map<string, ts.Node>): void {
        if (
            node.kind === ts.SyntaxKind.InterfaceDeclaration ||
            node.kind === ts.SyntaxKind.EnumDeclaration ||
            node.kind === ts.SyntaxKind.TypeAliasDeclaration
        ) {
            if (!this.isExportType(node)) {
                return;
            } else if (this.isGenericType(node as ts.TypeAliasDeclaration)) {
                return;
            }

            allTypes.set(this.getFullName(node, typeChecker), node);
        } else {
            ts.forEachChild(node, (subNode) => this.inspectNode(subNode, typeChecker, allTypes));
        }
    }

    private isExportType(node: ts.Node): boolean {
        const localSymbol = localSymbolAtNode(node);
        return localSymbol ? 'exportSymbol' in localSymbol : false;
    }

    private isGenericType(node: ts.TypeAliasDeclaration): boolean {
        return !!(
            node.typeParameters &&
            node.typeParameters.length > 0
        );
    }

    private getFullName(node: ts.Node, typeChecker: ts.TypeChecker): string {
        const symbol = assertDefined(symbolAtNode(node));
        return typeChecker.getFullyQualifiedName(symbol).replace(/".*"\./, '');
    }

    private getRootTypeDefinition(rootType: BaseType): Definition {
        return this.formatter.getDefinition(rootType);
    }

    private getRootChildDefinitions(rootType: BaseType): IStringMap<Definition> {
        return this.formatter.getChildren(rootType)
            .filter((child): child is DefinitionType => child instanceof DefinitionType)
            .reduce((result: IStringMap<Definition>, child) => ({
                ...result,
                [child.getId()]: this.formatter.getDefinition(child.getType()),
            }), {});
    }
}
