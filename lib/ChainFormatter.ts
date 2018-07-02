import {IFormatter, BaseType} from './model';
import {Definition} from './schema';
import {UnknownTypeException} from './exception';

export class ChainFormatter implements IFormatter {
    public constructor(
        private formatters: IFormatter[],
    ) {
    }

    public addFormatter(formatter: IFormatter): this {
        this.formatters.push(formatter);
        return this;
    }

    public isSupport(type: BaseType): boolean {
        return this.formatters.some((formatter) => formatter.isSupport(type));
    }

    public getDefinition(type: BaseType): Definition {
        return this.getFormatter(type).getDefinition(type);
    }

    public getChildren(type: BaseType): BaseType[] {
        return this.getFormatter(type).getChildren(type);
    }

    private getFormatter(type: BaseType): IFormatter {
        for (const formatter of this.formatters) {
            if (formatter.isSupport(type)) {
                return formatter;
            }
        }

        throw new UnknownTypeException(type);
    }
}
