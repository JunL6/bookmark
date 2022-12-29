import { Body, Controller, Get,  Ip, ParseIntPipe, Post } from "@nestjs/common";
import { Request } from "express";
import { AuthDto } from "src/dto";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {
    }

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto);
    }

    @Post('login')
    login(@Body() dto: AuthDto) {
        return this.authService.login(dto);
    }
}