import * as ts from "typescript";

export function resolveModelTypeScope(leftmost: ts.EntityName, statements: any): any[] {
    while (leftmost.parent && leftmost.parent.kind === ts.SyntaxKind.QualifiedName) {
        const leftmostName = leftmost.kind === ts.SyntaxKind.Identifier
            ? (leftmost as ts.Identifier).text
            : (leftmost as ts.QualifiedName).right.text
        ;
        const moduleDeclarations = statements
            .filter((node: any) => {
                if (node.kind !== ts.SyntaxKind.ModuleDeclaration) {
                    return false;
                }

                const moduleDeclaration = node as ts.ModuleDeclaration;

                return (moduleDeclaration.name as ts.Identifier).text.toLowerCase() === leftmostName.toLowerCase();
            }) as ts.ModuleDeclaration[];

        if (!moduleDeclarations.length) {
            throw new Error(`No matching module declarations found for ${leftmostName}.`);
        }

        if (moduleDeclarations.length > 1) {
            throw new Error(`Multiple matching module declarations found for ${leftmostName}; please make module declarations unique.`);
        }

        const moduleBlock = moduleDeclarations[0].body as ts.ModuleBlock;

        if (moduleBlock === null || moduleBlock.kind !== ts.SyntaxKind.ModuleBlock) {
            throw new Error(`Module declaration found for ${leftmostName} has no body.`);
        }

        statements = moduleBlock.statements;
        leftmost = leftmost.parent as ts.EntityName;
    }

    return statements;
}