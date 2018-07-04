import * as ts from 'typescript';
import {Context} from '../Context';
import {BaseType, Resolver} from '../model';
import {LogicException} from '../exception';
import {assertDefined} from '../utils';

export class TypeQueryResolver extends Resolver {
    public isSupport(node: ts.TypeQueryNode): boolean {
        return node.kind === ts.SyntaxKind.TypeQuery;
    }

    public resolve(node: ts.TypeQueryNode, context: Context): BaseType {
        const symbol = assertDefined(this.typeChecker.getSymbolAtLocation(node.exprName));
        const valueDec = assertDefined(symbol.valueDeclaration) as ts.VariableDeclaration;

        if (valueDec.type) {
            return this.childResolver.resolve(valueDec.type, context);
        } else if (valueDec.initializer) {
            return this.childResolver.resolve(valueDec.initializer, context);
        } else {
            throw new LogicException(`Invalid type query "${valueDec.getFullText()}"`);
        }
    }
}
