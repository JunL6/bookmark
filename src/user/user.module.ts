import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './JWTAuth.guard';
import { RolesGuard } from './roles.guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    controllers: [UserController],
    providers: [UserService, RolesGuard, JwtAuthGuard],
    exports: [UserService]
})
export class UserModule {}
