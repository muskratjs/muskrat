import {IMetadataMethod} from './IMetadataMethod';

export interface IMetadataClass {
    controller: string;
    decorators?: any;
    methods: IMetadataMethod[];
}
