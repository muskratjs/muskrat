import * as fs from 'fs';
import * as path from 'path';
import * as config from 'config';

export function loadConfig() {
    const configFileNames = [
        '.muskrat.json',            '.muskrat.json5',               '.muskrat.js',
        '.muskrat.ts',              '.muskrat.yaml',                '.muskrat.yml',

        'muskrat.json',             'muskrat.json5',                'muskrat.js',
        'muskrat.ts',               'muskrat.yaml',                 'muskrat.yml',

        'muskrat.config.json',      'muskrat.config.json5',         'muskrat.config.js',
        'muskrat.config.ts',        'muskrat.config.yaml',          'muskrat.config.yml',

        '.muskrat.config.json',     '.muskrat.config.json5',        '.muskrat.config.js',
        '.muskrat.config.ts',       '.muskrat.config.yaml',         '.muskrat.config.yml',
    ];

    const defaultConfig = (config.util as any).parseFile(path.join(__dirname, '../../.muskrat.json'));

    for (const name of configFileNames) {
        if (fs.existsSync(path.join(process.cwd(), name))) {

            return config.util.extendDeep(
                defaultConfig,
                (config.util as any).parseFile(path.join(process.cwd(), name))
            );
        }
    }

    return defaultConfig;
}
