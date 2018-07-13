import {IsInt, IsString, Length, Min} from 'class-validator';


/**
 * Pet Model
 */
export class PetModel {
    /**
     * Pet Id
     * @type {number}
     */
    @IsInt()
    @Min(1)
    id: number;

    /**
     * Pet Full Name
     * @type {string}
     */
    @Length(10, 20)
    fullName?: string;

    /**
     * Pet Type
     * @type {string}
     */
    @IsString()
    type = 'Panda';

    /**
     * Pet Color
     * @type {string}
     */
    @IsString()
    color = 'White';

    /**
     * @param {string} name Pet Name
     */
    constructor(public name = 'Austin') {
    }

}
