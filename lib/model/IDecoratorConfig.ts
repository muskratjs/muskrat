export interface IDecoratorConfig {
    [decorator: string]: {
        resolver: string,
        unique: boolean
    };
}
