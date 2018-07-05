import {BaseException} from './BaseException';

export class NoRootTypeException extends BaseException {
    public constructor(private type: string) {
        super();
    }

    public get name(): string {
        return 'NoRootTypeException';
    }

    public get message(): string {
        return `No root type "${this.type}" found`;
    }

    public getType(): string {
        return this.type;
    }
}
