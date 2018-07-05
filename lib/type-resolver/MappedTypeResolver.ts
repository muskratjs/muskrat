import * as ts from 'typescript';
import {Context} from '../Context';
import {ObjectProperty, ObjectType, UnionType, LiteralType, BaseType, Resolver} from '../model';
import {assertDefined, assertInstanceOf, derefType} from '../utils';

export class MappedTypeResolver extends Resolver {
    public isSupport(node: ts.MappedTypeNode): boolean {
        return node.kind === ts.SyntaxKind.MappedType;
    }

    public resolve(node: ts.MappedTypeNode, context: Context): BaseType {
        return new ObjectType(
            `indexed-type-${node.getFullStart()}`,
            [],
            this.getProperties(node, context),
            undefined,
        );
    }

    private getProperties(node: ts.MappedTypeNode, context: Context): ObjectProperty[] {
        const constraintNode = assertDefined(node.typeParameter.constraint);
        const constraintType = this.resolver.resolve(constraintNode, context);
        const keyListType = assertInstanceOf(
            derefType(constraintType),
            UnionType,
            `Mapped type keys should be instance of UnionType ("${constraintType.getId()}" given)`,
        );

        const typeNode = assertDefined(node.type);

        return keyListType.getTypes().reduce((result: ObjectProperty[], keyType) => {
            const propertyType = this.resolver.resolve(
                typeNode,
                this.createSubContext(node, keyType, context),
            );

            const propertyName = assertInstanceOf(
                keyType,
                LiteralType,
                `Mapped type key should be instance of LiteralType ("${keyType.getId()}" given)`,
            ).getValue();

            const objectProperty = new ObjectProperty(
                propertyName.toString(),
                propertyType,
                !node.questionToken,
            );

            result.push(objectProperty);

            return result;
        }, []);
    }

    private createSubContext(node: ts.MappedTypeNode, keyType: BaseType, parentContext: Context): Context {
        const subContext = new Context(node);

        parentContext.getParameters().forEach((parentParameter) => {
            subContext.pushParameter(parentParameter);
            subContext.pushArgument(parentContext.getArgument(parentParameter));
        });

        subContext.pushParameter(node.typeParameter.name.text);
        subContext.pushArgument(keyType);

        return subContext;
    }
}
