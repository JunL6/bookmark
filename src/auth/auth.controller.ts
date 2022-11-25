import { Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    // constructor(private authService: AuthService) {
    // }

    @Post('signup')
    signup() {
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