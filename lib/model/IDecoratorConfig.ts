export type DecoratorType = 'class' | 'method' | 'parameter' | 'response' | 'endpoint';

export interface IDecoratorConfig {
    name: string;
    type: DecoratorType[];
}
