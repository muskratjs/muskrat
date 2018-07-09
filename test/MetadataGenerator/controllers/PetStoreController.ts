import {Body, Controller, Delete, Get, Param, Patch, Post, Put} from 'routing-controllers';
import {Inject} from 'typedi';
import {PetService} from '../services/PetService';
import {PetModel} from '../models/PetModel';

@Controller('/pets')
export class PetStoreController {
    @Inject()
    petService: PetService;

    @Get('/')
    async get(): Promise<PetModel[]> {
        return this.petService.list();
    }

    @Get('/:id')
    async getById(@Param('id') id: number): Promise<PetModel> {
        return this.petService.get(id);
    }

    @Post('/')
    async save(@Body() pet: PetModel): Promise<PetModel> {
        return pet;
    }

    @Put('/:id')
    async put(@Param('id') id: number, @Body() pet: PetModel): Promise<PetModel> {
        return pet;
    }

    @Patch('/:id')
    async patch(@Param('id') id: number, @Body() pet: PetModel): Promise<PetModel> {
        return pet;
    }

    @Delete('/:id')
    async remove(@Param('id') id: number): Promise<void> {
        // delete
    }

}
