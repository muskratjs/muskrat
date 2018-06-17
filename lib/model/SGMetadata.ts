export namespace SGMetadata {
    export interface Type {
        dataType: 'string' | 'number' | 'double' | 'float' | 'integer' |
            'long' | 'enum' | 'array' | 'datetime' | 'date' | 'buffer' |
            'void' | 'object' | 'any' | 'refEnum' | 'refObject'
        ;
    }
    export interface Property {
        default?: any;
        description?: string;
        name: string;
        type: Type;
        required: boolean;
    }
}
