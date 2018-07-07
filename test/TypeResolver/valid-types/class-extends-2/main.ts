class Base {
    propA: number;
}

export class MyObject extends Base {
    propB: number;
    propC: MyObject2;
}

export class MyObject2 extends Base {
    prop: number;
}
