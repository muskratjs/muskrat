export class PetModel {

    id: number;

    fullName?: string;

    type = 'Panda';

    color = 'White';

    constructor(public name = 'Austin') {
    }

}
