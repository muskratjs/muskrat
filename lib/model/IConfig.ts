export interface IConfig {
    annotations: {
        text: string[];
        json: string[];
    };
    decorators: {
        controller: {
            [decorator: string]: {
                resolver: string,
                unique: boolean
            }
        };
        method: object;
        parameter: object;
    };
}
