import * as ts from 'typescript';
import {Context} from './Context';
import {BaseType, DefinitionType, IResolver, IFormatter, IStringMap} from './model';
import {Schema, Definition} from './schema';

export class SchemaGenerator {
    public constructor(
        private program: ts.Program,
        private resolver: IResolver,
        private formatter: IFormatter,
    ) {
    }

    public createSchema(rootNode: ts.Node): Schema {
        const rootType = this.resolver.resolve(rootNode, new Context());

        return {
            $schema: 'http://json-schema.org/draft-06/schema#',
            definitions: this.getRootChildDefinitions(rootType),
        };
    }

    private getRootChildDefinitions(rootType: BaseType): IStringMap<Definition> {
        return this.formatter.getChildren(rootType)
            .filter((child): child is DefinitionType => child instanceof DefinitionType)
            .reduce((result: IStringMap<Definition>, child) => ({
                ...result,
                [child.getId()]: this.formatter.getDefinition(child.getType()),
            }), {});
    }
}
