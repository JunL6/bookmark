import { Body, Controller, Get, ParseIntPipe, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthDto } from "src/dto";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "./auth.service";
import * as argon from "argon2";

@Controller('auth')
export class AuthController{
    constructor(private prismaService: PrismaService) {
    }

    @Post('signup')
    async signup(@Body() dto: AuthDto) {
        // generate password
        const hash = await argon.hash(dto.password);

        // save the user to db
        const user = await this.prismaService.user.create({
            data: {
                email: dto.email,
                hash,
            }
        })

        // return user
        console.log({
            user
        });
        return user
    }

    // @Post('login')
    // login() {
    //     return this.authService.login();
    // }

    // @Get('user')
    // getUser() {
    //     return "this is user.";
    // }

    // @Get('')
    // getNone() {
    //     return "get."
    // }
}