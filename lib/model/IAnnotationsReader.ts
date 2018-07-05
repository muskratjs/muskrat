import * as ts from 'typescript';
import {Annotations} from './type';

export interface IAnnotationsReader {
    getAnnotations(node: ts.Node): Annotations | undefined;
}
