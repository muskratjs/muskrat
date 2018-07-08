import {PrimitiveType} from './PrimitiveType';

export class VoidType extends PrimitiveType {
    public getId(): string {
        return 'void';
    }
}
