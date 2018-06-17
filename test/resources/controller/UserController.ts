import {Controller, Param, Body, Get, Post, Put, Delete, HttpCode} from "routing-controllers";
import {User} from "../model/User";

@Controller()
export class UserController {
    @Get("/users")
    getAll(): User[] {
        return [
            new User(),
            new User(),
        ];
    }

    @Get("/users/:id")
    getOne(@Param("id") id: number): User {
        return new User();
    }

    @Post("/users")
    @HttpCode(201)
    post(@Body() user: User) {
        return "Saving user...";
    }

    @Put("/users/:id")
    put(@Param("id") id: number, @Body() user: User) {
        return "Updating a user...";
    }

    @Delete("/users/:id")
    remove(@Param("id") id: number) {
        return "Removing user...";
    }
}