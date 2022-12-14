import { Controller, Get, Post, Req, Session, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "./roles.guard";

@Controller("user")
export class UserController {
    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles('USER')
    @Get("me")
    getMe(@Req() request: Request) {
        console.log({user: request.user});
        return "user";
    }
}