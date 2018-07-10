import {PrimitiveType} from './PrimitiveType';

export class StringType extends PrimitiveType {
    constructor(private format?: string) {
        super();
    }

    public getId(): string {
        return 'string';
    }
}
