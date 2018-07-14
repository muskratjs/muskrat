import * as ts from 'typescript';
import {Annotations, IAnnotationsReader} from '../model/index';
import {symbolAtNode} from '../utils';

export class AnnotationsReader implements IAnnotationsReader {
    /**
     * @type {string[]}
     */
    private static textTags: string[] = [
        'title',
        'description',
        'format',
        'pattern',
    ];

    /**
     * @type {string[]}
     */
    private static jsonTags: string[] = [
        'minimum',
        'exclusiveMinimum',

        'maximum',
        'exclusiveMaximum',

        'multipleOf',

        'minLength',
        'maxLength',

        'minItems',
        'maxItems',
        'uniqueItems',

        'propertyNames',
        'contains',
        'const',
        'examples',

        'default',
    ];

    /**
     * @param {ts.Node} node
     * @return {Annotations | undefined}
     */
    public getAnnotations(node: ts.Node): Annotations | undefined {
        const symbol = symbolAtNode(node);

        if (!symbol) {
            return undefined;
        }

        const jsDocTags = symbol.getJsDocTags();

        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }

        let annotations = jsDocTags.reduce((result: Annotations, jsDocTag) => {
            const value = this.parseJsDocTag(jsDocTag);

            if (value !== undefined) {
                result[jsDocTag.name] = value;
            }

            return result;
        }, {});

        annotations = {
            ...this.getDescriptionAnnotation(node),
            ...this.getTypeAnnotation(node),
            ...annotations,
        };

        return Object.keys(annotations).length ? annotations : undefined;
    }

    /**
     * @param {ts.JSDocTagInfo} jsDocTag
     * @return {any}
     */
    private parseJsDocTag(jsDocTag: ts.JSDocTagInfo): any {
        if (!jsDocTag.text) {
            return undefined;
        }

        if (AnnotationsReader.textTags.indexOf(jsDocTag.name) >= 0) {
            return jsDocTag.text;
        } else if (AnnotationsReader.jsonTags.indexOf(jsDocTag.name) >= 0) {
            return this.parseJson(jsDocTag.text);
        } else {
            return undefined;
        }
    }

    /**
     * @param {ts.Node} node
     * @return {Annotations | undefined}
     */
    private getDescriptionAnnotation(node: ts.Node): Annotations | undefined {
        const symbol = symbolAtNode(node);

        if (!symbol) {
            return undefined;
        }

        const comments = symbol.getDocumentationComment(undefined);

        if (!comments || !comments.length) {
            return undefined;
        }

        return {description: comments.map((comment) => comment.text).join(' ')};
    }

    /**
     * @param {ts.Node} node
     * @return {Annotations | undefined}
     */
    private getTypeAnnotation(node: ts.Node): Annotations | undefined {
        const symbol = symbolAtNode(node);

        if (!symbol) {
            return undefined;
        }

        const jsDocTags = symbol.getJsDocTags();

        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }

        const jsDocTag = jsDocTags.find((tag) => tag.name === 'schemaType');

        if (!jsDocTag || !jsDocTag.text) {
            return undefined;
        }

        return {type: jsDocTag.text};
    }

    /**
     * @param {string} value
     * @return {any}
     */
    private parseJson(value: string): any {
        try {
            return JSON.parse(value);
        } catch (e) {
            return undefined;
        }
    }
}
