export interface MyObject {
    value: MyGeneric<string, number>;
}

export interface MyGeneric<A, B> {
    field: MyGeneric<B, A>;
}
