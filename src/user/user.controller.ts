import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Controller("user")
export class UserController {
    @UseGuards(AuthGuard("jwt"))
    @Get("me")
    getMe(@Req() request: Request) {
        console.log({user: request.user});
        return "user";
    }
}