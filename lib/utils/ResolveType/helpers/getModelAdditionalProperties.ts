import * as ts from 'typescript';
import {ResolveType, UsableDeclaration} from '../ResolveType';

export function getModelAdditionalProperties(node: UsableDeclaration) {
    if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
        const interfaceDeclaration = node as ts.InterfaceDeclaration;
        const indexMember = interfaceDeclaration
            .members
            .find((member) => member.kind === ts.SyntaxKind.IndexSignature)
        ;

        if (!indexMember) {
            return undefined;
        }

        const indexSignatureDeclaration = indexMember as ts.IndexSignatureDeclaration;
        const indexType = ResolveType.resolve(indexSignatureDeclaration.parameters[0].type as ts.TypeNode);

        if (indexType.dataType !== 'string') {
            throw new Error(`Only string indexers are supported.`);
        }

        return ResolveType.resolve(indexSignatureDeclaration.type as ts.TypeNode);
    }

    return undefined;
}
