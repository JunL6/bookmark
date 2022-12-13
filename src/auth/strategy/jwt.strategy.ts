import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";

@Injectable() 
export class JWTStrategy extends PassportStrategy(
        Strategy,
        'jwt'
    ) {
    constructor(private authservice: AuthService, private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpirations: false,
            secretOrKey: config.get("JWT_SECRET")
        });
    }

    async validate(payload: any) {
        console.log({payload});
        return { email: payload.email };
    }
}