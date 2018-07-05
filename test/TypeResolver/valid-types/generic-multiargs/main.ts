export interface MyObject {
    value1: MyGeneric<string, number>;
    value2: MyGeneric<number, string>;
}

export interface MyGeneric<A, B> {
    a: A;
    b: B;
}
