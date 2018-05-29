import * as ts from "typescript";
import {ResolveType, UsableDeclaration} from "../ResolveType";
import {nodeIsUsable, resolveLeftmostIdentifier, resolveModelTypeScope} from "./index";

export function getModelTypeDeclaration(type: ts.EntityName) {
    const leftmostIdentifier = resolveLeftmostIdentifier(type);
    const statements: any[] = resolveModelTypeScope(leftmostIdentifier, ResolveType.nodes);
    const typeName = type.kind === ts.SyntaxKind.Identifier
        ? (type as ts.Identifier).text
        : (type as ts.QualifiedName).right.text
    ;

    let modelTypes = statements
        .filter((node) => {
            if (!nodeIsUsable(node)) {
                return false;
            }

            return ((node as UsableDeclaration).name as ts.Identifier).text === typeName;
        }) as UsableDeclaration[];

    if (!modelTypes.length) {
        throw new Error(`No matching model found for referenced type ${typeName}.`);
    }

    if (modelTypes.length > 1) {
        // remove typesResolvers that are from typescript e.g. 'Account'
        modelTypes = modelTypes.filter(modelType =>
            modelType.getSourceFile().fileName.replace(/\\/g, '/').toLowerCase().indexOf('node_modules/typescript') === -1
        );
    }
    if (modelTypes.length > 1) {
        const conflicts = modelTypes.map(modelType => modelType.getSourceFile().fileName).join('"; "');

        throw new Error(`Multiple matching models found for referenced type ${typeName}; please make model names unique. Conflicts found: "${conflicts}".`);
    }

    return modelTypes[0];
}
