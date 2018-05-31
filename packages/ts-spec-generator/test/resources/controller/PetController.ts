import {Controller, Param, Body, Get, Post, Put, Delete, HttpCode} from "routing-controllers";
import {User} from "../model/User";

@Controller()
export class PetController {
    @Get("/pet")
    getAll(): User[] {
        return [
            new User(),
            new User(),
        ];
    }

    @Get("/pet/:id")
    getOne(@Param("id") id: number): User {
        return new User();
    }

    @Post("/pet")
    @HttpCode(201)
    post(@Body() user: User) {
        return "Saving user...";
    }

    @Put("/pet/:id")
    put(@Param("id") id: number, @Body() user: User) {
        return "Updating a user...";
    }

    @Delete("/pet/:id")
    remove(@Param("id") id: number) {
        return "Removing user...";
    }
}