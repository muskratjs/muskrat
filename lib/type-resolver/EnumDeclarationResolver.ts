import * as ts from 'typescript';
import {EnumType, EnumValue, BaseType, Resolver} from '../model';
import {UnknownNodeException} from '../exception';
import {assertDefined} from '../utils';

export class EnumDeclarationResolver extends Resolver {
    public isSupport(node: ts.EnumDeclaration | ts.EnumMember): boolean {
        return node.kind === ts.SyntaxKind.EnumDeclaration || node.kind === ts.SyntaxKind.EnumMember;
    }

    public resolve(node: ts.EnumDeclaration | ts.EnumMember): BaseType {
        const members = node.kind === ts.SyntaxKind.EnumDeclaration
            ? node.members.slice()
            : [node]
        ;

        return new EnumType(
            `enum-${node.getFullStart()}`,
            members.map((member) => this.getMemberValue(member)),
        );
    }

    private getMemberValue(member: ts.EnumMember): EnumValue {
        const constantValue = this.typeChecker.getConstantValue(member);
        if (constantValue !== undefined) {
            return constantValue;
        }

        const initializer = assertDefined(member.initializer);
        return this.parseInitializer(initializer);
    }

    private parseInitializer(initializer: ts.Node): EnumValue {
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

        throw new UnknownNodeException(initializer);
    }
}
