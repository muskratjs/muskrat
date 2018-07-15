import * as path from 'path';
import {describe} from 'mocha';
import {assert} from 'chai';
import {MetadataGenerator} from '../../lib/MetadataGenerator';

describe('Valid Type Resolve', () => {
    it('Generate metadata', () => {
        const metadataGenerator = new MetadataGenerator(
            './test/MetadataGenerator/microservice/index.ts',
            require(path.join(process.cwd(), 'tsconfig.json'))
        );

        const metadata = metadataGenerator.generate(['Controller', 'JsonController']);

        assert.isTrue(metadata.length > 0);
    });
});
