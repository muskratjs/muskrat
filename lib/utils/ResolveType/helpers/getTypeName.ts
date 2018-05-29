import * as ts from "typescript";
import {getAnyTypeName} from "./getAnyTypeName";

export function getTypeName(typeName: string, genericTypes?: ts.NodeArray<ts.TypeNode>): string {
    if (!genericTypes || !genericTypes.length) {
        return typeName;
    }

    return typeName + genericTypes.map((t) => getAnyTypeName(t)).join('');
}