import {Schema} from '../schema';

export interface IMetadataParameter {
    param: string;
    annotations: any;
    decorators?: any;
    schema: Schema;
    params: IMetadataParameter[];
}
