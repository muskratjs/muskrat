export class PetService {
    create() {
        throw new Error('todo!');
    }

    async get(id: number) {
        return {
            id,
            type: 'Panda',
            color: 'White',
            name: 'foo',
        };
    }

    async list() {
        return [
            {
                id: 1,
                type: 'Panda',
                color: 'White',
                name: 'foo',
            },
            {
                id: 2,
                type: 'Panda',
                color: 'Black',
                name: 'boo',
            }
        ];
    }

    async update() {
        throw new Error('todo!');
    }

    async destroy() {
        throw new Error('todo!');
    }

}
