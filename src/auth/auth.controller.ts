import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthDto } from "src/dto";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(private prismaService: PrismaService) {
    }

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        console.log({
            dto
        });
        return "sign up"
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