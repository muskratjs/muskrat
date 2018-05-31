import * as ts from 'typescript';
export declare class JsDoc {
    static description(node: ts.Node): string;
    static comment(node: ts.Node, tagName: string): string;
    static tags(node: ts.Node, isMatching: (tag: ts.JSDocTag) => boolean): ts.JSDocTag[];
    static hasTag(node: ts.Node, isMatching: (tag: ts.JSDocTag) => boolean): boolean;
    static getJSDocTagNames(node: ts.Node): string[];
}
