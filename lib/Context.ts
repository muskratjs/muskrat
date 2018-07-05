import * as ts from 'typescript';
import {BaseType} from './model';
import {LogicException} from './exception';

export class Context {
    private arguments: BaseType[] = [];
    private parameters: string[] = [];
    private reference?: ts.Node;

    public constructor(reference?: ts.Node) {
        this.reference = reference;
    }

    public pushArgument(argumentType: BaseType): void {
        this.arguments.push(argumentType);
    }

    public pushParameter(parameterName: string): void {
        this.parameters.push(parameterName);
    }

    public getArgument(parameterName: string): BaseType {
        const index = this.parameters.indexOf(parameterName);
        if (index < 0 || !this.arguments[index]) {
            throw new LogicException(`Could not find type parameter "${parameterName}"`);
        }

        return this.arguments[index];
    }

    public getParameters(): ReadonlyArray<string> {
        return this.parameters;
    }

    public getArguments(): ReadonlyArray<BaseType> {
        return this.arguments;
    }

    public getReference(): ts.Node | undefined {
        return this.reference;
    }
}
