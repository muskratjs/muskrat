export interface MyObject {
    value: MyGeneric<number>;
}

export interface MyGeneric<T> {
    field: T;
}
