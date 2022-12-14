import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable({})
export class UserService {
    constructor(private prismaService: PrismaService) {

    }

   async findUserById(id: number) {
        const user = await this.prismaService.user.findFirst({
            where: {
                id
            }
        }) 
           
        return user;
    }
}