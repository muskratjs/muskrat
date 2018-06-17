import { UserController } from './controller/UserController';
import { PetController } from './controller/PetController';
import {createExpressServer} from 'routing-controllers';

createExpressServer({
    cors: true,
    controllers: [ UserController, PetController ],
    validation: true,
});

