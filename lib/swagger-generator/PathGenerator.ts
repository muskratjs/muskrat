import * as path from 'path';

export class PathGenerator {
    private paths: any = {};

    constructor(private basePath = '') {
    }

    addPath(urlPath: string, method: string) {
        const realPath = path.join(this.basePath, urlPath);

        if (this.paths[realPath]) {
            this.paths[realPath] = {};
        }

        if (!this.paths[realPath][method]) {
            this.paths[realPath][method] = {};
        }
    }
}
