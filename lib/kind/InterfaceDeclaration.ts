import * as ts from 'typescript';
import {TypeResolver} from '../TypeResolver';

export class InterfaceDeclaration {
    private typeResolver: TypeResolver;

    constructor(typeResolver: TypeResolver) {
        this.typeResolver = typeResolver;
    }

    isSupport(type: ts.TypeNode): boolean {
        return type.kind === ts.SyntaxKind.InterfaceDeclaration;
    }

    resolve(type: ts.InterfaceDeclaration) {
        const properties: {[key: string]: any} = {};

        for (const property of type.members.filter(ts.isPropertySignature)) {
            const resolvedType: any = this.typeResolver.resolve(property.type);
            const name: string = property.name.getText();

            if (name) {
                properties[name] = resolvedType;
            }
        }

        return {
            type: 'object',
            properties,
        };
    }
}
