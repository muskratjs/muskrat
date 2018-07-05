process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

import * as fs from 'fs';
import * as path from 'path';
import * as config from 'config';
import {IConfig} from '../model';

let configObj: IConfig = null;

function _loadConfig() {
    const fileNames = ['.muskrat', '.muskrat.config', 'muskrat', 'muskrat.config'];
    const extensions = ['json', 'json5', 'js', 'ts', 'yaml', 'yml'];
    const defaultConfig = (config.util as any).parseFile(path.join(__dirname, '../../.muskrat.json'));

    for (const name of fileNames) {
        for (const extension of extensions) {
            const filePath = path.join(process.cwd(), `${name}.${extension}`);
            if (fs.existsSync(filePath)) {

                return config.util.extendDeep(
                    defaultConfig,
                    (config.util as any).parseFile(filePath)
                );
            }
        }
    }

    return defaultConfig;
}

export function loadConfig(): IConfig {
    if (configObj) {
        return configObj;
    }

    configObj = _loadConfig();

    return configObj;
}
