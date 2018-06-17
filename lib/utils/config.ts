import * as fs from 'fs';
import * as path from 'path';
const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.ssg.config.json')).toString());

export { config };
