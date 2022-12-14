import { Module } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    controllers: [UserController],
    providers: [UserService, RolesGuard],
    exports: [UserService]
})
export class UserModule {}
