import * as ts from 'typescript';
import {getEnumValue, nodeDescription} from '../helpers';
import {ResolveType} from '../ResolveType';

export class EnumerateType {
    static resolve(typeName: ts.EntityName) {
        const enumName = (typeName as ts.Identifier).text;
        const enumNodes = ResolveType.nodes
            .filter((node) => node.kind === ts.SyntaxKind.EnumDeclaration)
            .filter((node) => (node as any).name.text === enumName);

        if (!enumNodes.length) {
            return;
        }

        if (enumNodes.length > 1) {
            throw new Error(`Multiple matching enum found for enum ${enumName}; please make enum names unique.`);
        }

        const enumDeclaration = enumNodes[0] as ts.EnumDeclaration;

        const enums = enumDeclaration.members.map((member: ts.EnumMember, index) => {
            return getEnumValue(member) || String(index);
        });

        return {
            dataType: 'refEnum',
            description: nodeDescription(enumDeclaration),
            enums,
            refName: enumName,
        };
    }
}
