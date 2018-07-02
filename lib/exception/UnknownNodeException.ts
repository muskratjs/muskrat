import * as ts from 'typescript';
import {BaseException} from './BaseException';

export class UnknownNodeException extends BaseException {
    public constructor(private node: ts.Node, private reference?: ts.Node) {
        super();
    }

    public get name(): string {
        return 'UnknownNodeException';
    }

    public get message(): string {
        return `Unknown node "${this.node.getFullText()}"`;
    }

    public getNode(): ts.Node {
        return this.node;
    }

    public getReference(): ts.Node | undefined {
        return this.reference;
    }
}
