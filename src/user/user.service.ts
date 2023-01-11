import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EditUserDto } from "./dto";

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

    async editUser(userId: number, editUserDto: EditUserDto) {
        const user = await this.prismaService.user.update({
            where: {
                id: userId
            },
            data: {
                ...editUserDto
            }
        })

        delete user.hash;
        return user;
    }

    async getName() {
        throw new Error('name is required');
    }
}