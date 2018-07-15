import {loadConfig} from '../../lib/helper';
import {describe} from 'mocha';
import {assert} from 'chai';

describe('Config', () => {
    it('Load config', () => {
        const config = loadConfig();

        console.log(config);

        assert.exists(config.plugins);
    });
});
