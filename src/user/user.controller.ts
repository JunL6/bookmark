import { Controller, Get, Post, Req, Session, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";
import { GetUser, Roles } from "src/auth/decorators";
import { JwtAuthGuard } from "./JWTAuth.guard";
import { RolesGuard } from "./roles.guard";

@Controller("user")
export class UserController {
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
}