import { Controller, Get, Post, Req, Session, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { GetUser, Roles } from "src/auth/decorators";
import { JwtAuthGuard } from "./JWTAuth.guard";
import { RolesGuard } from "./roles.guard";

@Controller("user")
export class UserController {
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER')
    @Get("me")
    getMe(@Req() request: Request, @GetUser() user) {
        console.log({user});
        return "user";
    }
}