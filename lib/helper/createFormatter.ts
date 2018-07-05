import {values} from 'lodash';
import * as formatters from '../type-formatter';
import {TypeFormatter} from '../TypeFormatter';
import {CircularReferenceFormatter} from '../CircularReferenceFormatter';

export function createFormatter() {
    const typeFormatter = new TypeFormatter([]);
    const circularReferenceFormatter = new CircularReferenceFormatter(typeFormatter);

    for (const formatter of values(formatters)) {
        typeFormatter.addFormatter(new (formatter as any)(circularReferenceFormatter));
    }

    return circularReferenceFormatter;
}
