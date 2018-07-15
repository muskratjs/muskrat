export interface MyObject {
    export: MyExportString;
    private: MyPrivateString;
}

export type MyExportString = string;

type MyPrivateString = string;
