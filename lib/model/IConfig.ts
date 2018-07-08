import {IDecoratorConfig} from './IDecoratorConfig';

export interface IConfig {
    annotations: {
        text: string[];
        json: string[];
    };
    decorators: {
        controller: IDecoratorConfig;
        method: IDecoratorConfig;
        parameter: IDecoratorConfig;
    };
}
