import {Schema} from '../schema';
import {IMetadataParameter} from './IMetadataParameter';

export interface IMetadataMethod {
    method: string;
    decorators: any;
    schema: Schema;
    params: IMetadataParameter[];
}
