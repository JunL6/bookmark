import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { AuthService } from "../auth.service";

@Injectable() 
export class JWTStrategy extends PassportStrategy(
        Strategy,
        'jwt'
    ) {
    constructor(
        private authservice: AuthService, 
        private config: ConfigService,
        private userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpirations: false,
            secretOrKey: config.get("JWT_SECRET")
        });
    }

    async validate(payload: any) {
        console.log({payload});
        const user = await this.userService.findUserById(payload.sub);
        if(!user) return false;

        delete user.hash;
        return user;

        // console.log(new Date().getTime() / 1000);
        // return payload;
    }
}