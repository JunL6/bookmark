import { Controller, Post } from "@nestjs/common";

@Controller()
export class UserController {
    @Post('lock')
    lock() {
        return "lock";
    }
}