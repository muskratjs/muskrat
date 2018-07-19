interface SomeObject {
    abc: 'foo';
    def?: 'bar';
}

const obj: SomeObject = {abc: 'foo'};
export type MyType = typeof obj.abc;


const a: MyType = 'foo';
// const b: MyType = "bar";
// const c: MyType = undefined;
