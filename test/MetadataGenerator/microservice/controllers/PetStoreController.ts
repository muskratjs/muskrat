import {Body, Controller, Delete, Get, Param, Patch, Post, Put} from 'routing-controllers';
import {Inject} from 'typedi';
import {PetService} from '../services/PetService';
import {PetModel} from '../models/PetModel';

/**
 * Pet Endpoints
 */
@Controller('/pets')
export class PetStoreController {
    @Inject()
    petService: PetService;

    /**
     * Get pet list
     * @return {Promise<PetModel[]>}
     */
    @Get('/')
    async get(): Promise<PetModel[]> {
        return this.petService.list();
    }

    /**
     * Get pet By Id
     * @param {number} id Pet Id
     * @return {Promise<PetModel>}
     */
    @Get('/:id')
    async getById(@Param('id') id: number): Promise<PetModel> {
        return this.petService.get(id);
    }

    /**
     * Save new pet
     * @param {PetModel} pet Pet model
     * @return {Promise<PetModel>}
     */
    @Post('/')
    async save(@Body() pet: PetModel): Promise<PetModel> {
        return pet;
    }

    /**
     * Update pet
     * @param {number} id Pet Id
     * @param {PetModel} pet Pet Model
     * @return {Promise<PetModel>}
     */
    @Put('/:id')
    async put(@Param('id') id: number, @Body() pet: PetModel): Promise<PetModel> {
        return pet;
    }

    /**
     * Update pet
     * @param {number} id Pet Id
     * @param {PetModel} pet Pet Model
     * @return {Promise<PetModel>}
     */
    @Patch('/:id')
    async patch(@Param('id') id: number, @Body() pet: PetModel): Promise<PetModel> {
        return pet;
    }

    /**
     * Delete pet
     * @param {number} id Pet Id
     * @return {Promise<void>}
     */
    @Delete('/:id')
    async remove(@Param('id') id: number): Promise<void> {
        // delete
    }

}
