import * as ts from 'typescript';
import {IResolver} from './IResolver';
import {Context} from '../Context';
import {BaseType} from './type';

export abstract class Resolver implements IResolver {
    protected constructor(
        protected typeChecker: ts.TypeChecker,
        protected childResolver: IResolver,
    ) {

    }

    public abstract isSupport(node: ts.Node): boolean;

    public abstract resolve(node: ts.Node, context: Context): BaseType;
}
