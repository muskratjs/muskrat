import * as ts from "typescript";

export function getEnumValue(member: ts.EnumMember | any) {
    const initializer = member.initializer;

    if (initializer) {
        return initializer.expression
            ? initializer.expression.text
            : initializer.text
        ;
    }

    return;
}