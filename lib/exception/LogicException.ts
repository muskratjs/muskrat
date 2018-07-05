import {BaseException} from './BaseException';

export class LogicException extends BaseException {
    public constructor(private msg: string) {
        super();
    }

    public get name(): string {
        return 'LogicException';
    }

    public get message(): string {
        return this.msg;
    }
}
