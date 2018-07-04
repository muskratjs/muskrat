export interface MyObject {
    value1: MyGeneric<number>;
    value2: MyGeneric<string>;
}

export interface MyGeneric<T> {
    field: T;
}
