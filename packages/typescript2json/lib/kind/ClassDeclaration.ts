import * as ts from 'typescript';
import {Resolver, TypeResolver} from '../TypeResolver';

export class ClassDeclaration  implements Resolver {
    private typeResolver: TypeResolver;

    constructor(typeResolver: TypeResolver) {
        this.typeResolver = typeResolver;
    }

    isSupport(type: ts.Declaration | any): boolean {
        return type.kind === ts.SyntaxKind.ClassDeclaration;
    }

    resolve(type: ts.Declaration) {
        const declaration = type as ts.ClassDeclaration;
        const properties: {[key: string]: any} = {};

        for (const member of declaration.members.filter(m => m.kind === ts.SyntaxKind.PropertyDeclaration)) {
            if ((<any>member).type) {
                properties[member.name.getText()] = this.typeResolver.resolve((<any>member).type);
            } else if((<any>member).initializer) {
                properties[member.name.getText()] = this.typeResolver.resolve((<any>member).initializer);
            }
        }

        return {
            type: 'object',
            properties
        };
    }
}
