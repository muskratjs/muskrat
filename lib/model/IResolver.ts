import * as ts from 'typescript';
import {Context} from '../Context';
import {BaseType} from './type';

export interface IResolver {
    /**
     * @param {ts.Node} node
     * @return {boolean}
     */
    isSupport(node: ts.Node): boolean;

    /**
     * @param {ts.Node} node
     * @param {Context} context
     * @return {BaseType}
     */
    resolve(node: ts.Node, context: Context): BaseType;
}
