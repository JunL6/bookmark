import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "src/dto";
import * as argon from "argon2";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable({})
export class AuthService {
    constructor(private prismaService: PrismaService) {
    }

    async signup(dto: AuthDto) {
        // generate password
        const hash = await argon.hash(dto.password);

        try {
            // save the user to db
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    hash,
                }
            })

            delete user.hash;

            // return user
            console.log({
                user
            });
            return user
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code == 'P2002') {
                    throw new ForbiddenException("This email has been registered.");
                }
            }
            throw error;
        }
        
        
    }

    async login(dto: AuthDto) {
        // find the user by email
        const user = await this.prismaService.user.findUnique({
            where: {email: dto.email}
        })
        // if the user doesn't exist, throw an expection
        if(!user) throw new ForbiddenException("User associated with this email doesn't exist.")
        
        // check password, if the password is incorrect, throw an expection
        if(!await argon.verify(user.hash, dto.password)) {
            throw new ForbiddenException("Password incorrect.");
        }

        // return 
        delete user.hash;
        return user;
    }
}