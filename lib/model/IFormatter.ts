import {BaseType} from './type';
import {Definition} from '../schema';

export interface IFormatter {
    isSupport(type: BaseType): boolean;

    getDefinition(type: BaseType): Definition;

    getChildren(type: BaseType): BaseType[];
}
