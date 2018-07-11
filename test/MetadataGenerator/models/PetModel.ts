import {IsInt, IsString, Length, Min} from 'class-validator';

export class PetModel {
    @IsInt()
    @Min(1)
    id: number;

    @Length(10, 20)
    fullName?: string;

    @IsString()
    type = 'Panda';

    @IsString()
    color = 'White';

    constructor(public name = 'Austin') {
    }

}
