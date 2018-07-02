import {BaseType} from '../model';
import {BaseException} from './BaseException';

export class UnknownTypeException extends BaseException {
    public constructor(private type: BaseType) {
        super();
    }

    public get name(): string {
        return 'UnknownTypeException';
    }

    public get message(): string {
        return `Unknown type "${this.type.getId()}"`;
    }

    public getType(): BaseType {
        return this.type;
    }
}
