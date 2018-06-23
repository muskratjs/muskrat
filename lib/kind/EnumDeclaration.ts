import * as ts from 'typescript';
import {TypeResolver} from '../TypeResolver';

export class EnumDeclaration {
    private typeResolver: TypeResolver;

    constructor(typeResolver: TypeResolver) {
        this.typeResolver = typeResolver;
    }

    isSupport(type: ts.TypeNode): boolean {
        return type.kind === ts.SyntaxKind.EnumDeclaration || type.kind === ts.SyntaxKind.EnumMember;
    }

    resolve(type: ts.EnumDeclaration | ts.EnumMember) {
        const members = type.kind === ts.SyntaxKind.EnumDeclaration
            ? type.members
            : ts.createNodeArray([type as ts.EnumMember])
        ;

        return { enum: members.map((member: ts.EnumMember, index) => {
            const constantValue = this.typeResolver.getTypeChecker().getConstantValue(member);

            if (constantValue !== undefined) {
                return constantValue;
            }

            const initializer = (member as ts.EnumMember).initializer;

            if (initializer) {
                return this.parseInitializer(initializer);
            }
        }) };
    }

    private parseInitializer(initializer: ts.Node): any {
        if (initializer.kind === ts.SyntaxKind.TrueKeyword) {
            return true;
        } else if (initializer.kind === ts.SyntaxKind.FalseKeyword) {
            return false;
        } else if (initializer.kind === ts.SyntaxKind.NullKeyword) {
            return null;
        } else if (initializer.kind === ts.SyntaxKind.NumericLiteral) {
            return parseFloat((initializer as ts.NumericLiteral).text);
        } else if (initializer.kind === ts.SyntaxKind.StringLiteral) {
            return (initializer as ts.StringLiteral).text;
        } else if (initializer.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
            return (initializer as ts.NoSubstitutionTemplateLiteral).text;
        } else if (initializer.kind === ts.SyntaxKind.ParenthesizedExpression) {
            return this.parseInitializer((initializer as ts.ParenthesizedExpression).expression);
        } else if (initializer.kind === ts.SyntaxKind.AsExpression) {
            return this.parseInitializer((initializer as ts.AsExpression).expression);
        } else if (initializer.kind === ts.SyntaxKind.TypeAssertionExpression) {
            return this.parseInitializer((initializer as ts.TypeAssertion).expression);
        }
    }
}
