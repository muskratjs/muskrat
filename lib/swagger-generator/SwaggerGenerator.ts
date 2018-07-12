import * as deepmerge from 'deepmerge';
import * as path from 'path';
import {
    IDecoratorConfig,
    IMetadataClass,
    IMetadataGeneratorOptions,
    IMetadataMethod,
    IMetadataParameter
} from '../model';
import {PathGenerator} from './PathGenerator';

export class SwaggerGenerator {
    constructor(
        private metadata: IMetadataClass[],
        private spec: any = {}
    ) {
    }

    public generate(options: IMetadataGeneratorOptions): object {
        this.spec = deepmerge({
            swagger: '2.0',
            info: {
                description: '',
                version: '1.0.0',
                title: 'Swagger',
            },
            host: 'localhost',
            paths: {},
            basePath: '',
        }, this.spec);

        for (const clazz of this.metadata) {
            const classDecorator = this.findDecorator(clazz, options.controllerDecorators.filter(
                d => d.type.indexOf('class') > -1
            ));

            const decoratorResolver = require(path.resolve(classDecorator.resolver)).default;
            const resolver = new decoratorResolver();

            console.log(classDecorator);

            console.log(resolver.resolve(classDecorator));

            const pathGenerator = new PathGenerator();

            for (const method of clazz.methods) {
            }
        }

        return this.spec;
    }

    findDecorator(
        metadata: IMetadataClass | IMetadataMethod | IMetadataParameter,
        decorators: IDecoratorConfig[]
    ) {
        for (const decorator of decorators) {
            if (metadata.decorators[decorator.name]) {
                return {
                    ...decorator,
                    ...metadata.decorators[decorator.name]
                };
            }
        }

        return;
    }
}
