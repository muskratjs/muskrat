import {Contains, IsEmail, IsNotEmpty, IsNumber, IsString, Length, Max, Min, MinLength} from 'class-validator';

export enum NumberEnum {
    FOO = 1,
    BOO = 2,
}

export enum StringEnum {
    FOOS = 'foo',
    BOOS = 'boo',
    WOOS = 'woo',
}

export interface IUser {
    id: number;
    age: number;
}

export class User implements IUser{
    @IsNotEmpty()
    @IsNumber()
    id: number;
    // iuser: IUser;

    litstring = '10000';
    litnumber = 4;
    litboolean = true;
    nuzz: null = null;
    unde: undefined = undefined;
    an: any;
    // enu: NumberEnum;
    // enus: StringEnum;

    arr: string[] = ['foo', 'boo'];
    users: User;

    @IsString()
    @IsNotEmpty()
    @Length(3, 20)
    name: string;

    @IsString()
    @Contains('About me')
    about: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @Max(120, {
        message: 'Max age $value',
    })
    @Min(18, {
        message: 'Min age $value',
    })
    @IsNumber()
    age: number;
}
