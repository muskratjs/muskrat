import {Schema} from '../schema';

export interface IMetadataParameter {
    param: string;
    decorators?: any;
    schema: Schema;
    params: IMetadataParameter[];
}
