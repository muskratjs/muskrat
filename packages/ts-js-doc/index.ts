import * as ts from 'typescript';

export class JsDoc {
    static description(node: ts.Node) {
        const jsDocs = (node as any).jsDoc as ts.JSDoc[];

        if (!jsDocs || !jsDocs.length) {
            return undefined;
        }

        return jsDocs[0].comment || undefined;
    }

    static comment(node: ts.Node, tagName: string) {
        const tags = JsDoc.tags(node, tag => tag.tagName.text === tagName);

        return tags.length > 0
            ? tags[0].comment
            : undefined
        ;
    }

    static tags(node: ts.Node, isMatching: (tag: ts.JSDocTag) => boolean) {
        const jsDocs = (node as any).jsDoc as ts.JSDoc[];

        if (!jsDocs || jsDocs.length === 0) {
            return [];
        }

        const jsDoc = jsDocs[0];

        if (!jsDoc.tags.length) {
            return [];
        }

        return jsDoc.tags.filter(isMatching);
    }

    static hasTag(node: ts.Node, isMatching: (tag: ts.JSDocTag) => boolean) {
        const tags = JsDoc.tags(node, isMatching);

        return tags.length !== 0;
    }

    static getJSDocTagNames(node: ts.Node) {
        let tags: ts.JSDocTag[];

        if (node.kind === ts.SyntaxKind.Parameter) {
            const parameterName = ((node as any).name as ts.Identifier).text;

            tags = JsDoc.tags(node.parent as any, tag => {
                return tag.comment !== undefined && tag.comment.startsWith(parameterName);
            });
        } else {
            tags = JsDoc.tags(node as any, tag => {
                return tag.comment !== undefined;
            });
        }

        return tags.map(tag => {
            return tag.tagName.text;
        });
    }
}

