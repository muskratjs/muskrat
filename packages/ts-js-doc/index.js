"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
class JsDoc {
    static description(node) {
        const jsDocs = node.jsDoc;
        if (!jsDocs || !jsDocs.length) {
            return undefined;
        }
        return jsDocs[0].comment || undefined;
    }
    static comment(node, tagName) {
        const tags = JsDoc.tags(node, tag => tag.tagName.text === tagName);
        return tags.length > 0
            ? tags[0].comment
            : undefined;
    }
    static tags(node, isMatching) {
        const jsDocs = node.jsDoc;
        if (!jsDocs || jsDocs.length === 0) {
            return [];
        }
        const jsDoc = jsDocs[0];
        if (!jsDoc.tags.length) {
            return [];
        }
        return jsDoc.tags.filter(isMatching);
    }
    static hasTag(node, isMatching) {
        const tags = JsDoc.tags(node, isMatching);
        return tags.length !== 0;
    }
    static getJSDocTagNames(node) {
        let tags;
        if (node.kind === ts.SyntaxKind.Parameter) {
            const parameterName = node.name.text;
            tags = JsDoc.tags(node.parent, tag => {
                return tag.comment !== undefined && tag.comment.startsWith(parameterName);
            });
        }
        else {
            tags = JsDoc.tags(node, tag => {
                return tag.comment !== undefined;
            });
        }
        return tags.map(tag => {
            return tag.tagName.text;
        });
    }
}
exports.JsDoc = JsDoc;
//# sourceMappingURL=index.js.map