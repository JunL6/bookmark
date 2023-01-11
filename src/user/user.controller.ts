import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Req, Session, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";
import { GetUser, Roles } from "src/auth/decorators";
import { EditUserDto } from "./dto";
import { JwtAuthGuard } from "./JWTAuth.guard";
import { RolesGuard } from "./roles.guard";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private userService: UserService) {}
    @Get("me")
    @Roles('USER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    getMe(@Req() request: Request,
        @GetUser() user: User,
        @GetUser('email') email: string,
    ) {
        console.log({ email })
        console.log({ user });
        return "user";
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    editUser(@GetUser('id') userId: number, @Body() editUserDto: EditUserDto) {
        console.log({editUserDto})
        if(editUserDto && Object.keys(editUserDto).length == 0) throw new HttpException('request body is required.', HttpStatus.BAD_REQUEST) 

        return this.userService.editUser(userId, editUserDto);
    }

    @Get("name")   
    async getName() {
        try {
            await this.userService.getName();
        } catch (error) {
            throw new HttpException({ message: 'name is required', cause: "blasphemy", statusCode: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
        }
    }
}