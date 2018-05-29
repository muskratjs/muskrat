import * as ts from "typescript";
import {ResolveType} from "../ResolveType";

export class LiteralType {
    static resolve(typeName: ts.EntityName) {
        const literalName = (typeName as ts.Identifier).text;
        const literalTypes = ResolveType.nodes
            .filter((node) => node.kind === ts.SyntaxKind.TypeAliasDeclaration)
            .filter((node) => {
                const innerType = (node as any).type;

                return innerType.kind === ts.SyntaxKind.UnionType && (innerType as any).types;
            })
            .filter((node) => (node as any).name.text === literalName);

        if (!literalTypes.length) {
            return;
        }

        if (literalTypes.length > 1) {
            throw new Error(`Multiple matching enum found for enum ${literalName}; please make enum names unique.`);
        }

        const unionTypes = (literalTypes[0] as any).type.types;

        return {
            dataType: 'enum',
            enums: unionTypes.map((unionNode: any) => unionNode.literal.text as string),
        }
    }
}
