import * as ts from 'typescript';
import {BaseException} from './BaseException';

export class DiagnosticException extends BaseException {
    public constructor(private diagnostics: ts.Diagnostic[]) {
        super();
    }

    public get name(): string {
        return 'DiagnosticException';
    }

    public get message(): string {
        return this.diagnostics
            .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
            .join('\n\n')
        ;
    }

    public getDiagnostics(): ts.Diagnostic[] {
        return this.diagnostics;
    }
}
