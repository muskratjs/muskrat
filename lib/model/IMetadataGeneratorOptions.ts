import {IDecoratorConfig} from './IDecoratorConfig';

export interface IMetadataGeneratorOptions {
    controllerDecorators: IDecoratorConfig[];
    methodDecorators: IDecoratorConfig[];
    parameterDecorators: IDecoratorConfig[];
}
