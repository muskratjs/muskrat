import {loadConfig} from '../../lib/helper';
import {describe, it} from 'mocha';
import {assert} from 'chai';

describe('Config', () => {
    it('Load config', () => {
        const config = loadConfig();

        assert.exists(config.plugins);
    });
});
