import 'reflect-metadata';
import {createExpressServer} from 'routing-controllers';
import {PetStoreController} from './controllers/PetStoreController';

const app = createExpressServer({
    controllers: [PetStoreController],
});

app.listen(3000);
