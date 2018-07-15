
type BasicArray = (string | number)[];

export type MyUnion = (string | MyObject)[];

export interface MyObject {
    array: BasicArray;
}
