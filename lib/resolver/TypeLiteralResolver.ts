import * as ts from 'typescript';
import {Context} from '../Context';
import {ObjectType, ObjectProperty, BaseType, Resolver} from '../model';
import {symbolAtNode, assertDefined} from '../utils';

export class TypeLiteralResolver extends Resolver {
    public isSupport(node: ts.TypeLiteralNode): boolean {
        return node.kind === ts.SyntaxKind.TypeLiteral;
    }

    public resolve(node: ts.TypeLiteralNode, context: Context): BaseType {
        return new ObjectType(
            this.getTypeId(node, context),
            [],
            this.getProperties(node, context),
            this.getAdditionalProperties(node, context),
        );
    }

    private getProperties(node: ts.TypeLiteralNode, context: Context): ObjectProperty[] {
        return node.members
            .filter(ts.isPropertySignature)
            .reduce((result: ObjectProperty[], propertyNode) => {
                const propertyType = assertDefined(propertyNode.type);
                const propertySymbol = assertDefined(symbolAtNode(propertyNode));
                const objectProperty = new ObjectProperty(
                    propertySymbol.getName(),
                    this.childResolver.resolve(propertyType, context),
                    !propertyNode.questionToken,
                );

                result.push(objectProperty);

                return result;
            }, []);
    }

    private getAdditionalProperties(node: ts.TypeLiteralNode, context: Context): BaseType | undefined {
        const indexSignature = node.members.find(ts.isIndexSignatureDeclaration);

        if (!indexSignature) {
            return undefined;
        }

        return this.childResolver.resolve(assertDefined(indexSignature.type), context);
    }

    private getTypeId(node: ts.Node, context: Context): string {
        const fullName = `structure-${node.getFullStart()}`;
        const argumentIds = context.getArguments().map((arg) => arg.getId());

        return argumentIds.length ? `${fullName}<${argumentIds.join(',')}>` : fullName;
    }
}
