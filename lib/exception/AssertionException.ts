import {BaseException} from './BaseException';

export class AssertionException extends BaseException {
    public constructor(private details: string) {
        super();
    }

    public get name(): string {
        return 'AssertionException';
    }

    public get message(): string {
        return `Assertion error: ${this.details}`;
    }

    public getDetails(): string {
        return this.details;
    }
}
