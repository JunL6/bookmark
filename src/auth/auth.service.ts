import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
    signup() {
        return { msg: "signed up." };
    }

    login() {
        return "You have logged in."
    }
}