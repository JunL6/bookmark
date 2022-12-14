import { CanActivate, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector) {}

    canActivate(context: any) {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        console.log({meta: roles})
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log({userRole: user.role})
        return this.matchRoles(roles, user.role);
    }

    private matchRoles(roles: string[], userRole: string) {
        return roles.some(role => role === userRole);
    }
}