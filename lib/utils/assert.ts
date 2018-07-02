import {AssertionException} from '../exception';

export function assertDefined<T>(
    value: T | undefined,
    message?: string,
): T {
    if (value === undefined) {
        throw new AssertionException(message || `Value "${value}" should not be undefined`);
    }

    return value;
}

export function assertInstanceOf<T>(
    value: any,
    type: { new(...args: any[]): T },
    message?: string,
): T {
    if (!(value instanceof type)) {
        throw new AssertionException(`Value "${value}" should be instanceof "${type.name}"`);
    }

    return value;
}
