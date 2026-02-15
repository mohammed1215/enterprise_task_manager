import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { Roles } from "src/enums/enum";

export class RolesGuard implements CanActivate{
    constructor(private allowedRoles:Roles[]){}
    canActivate(context: ExecutionContext) {
        const request:Request = context.switchToHttp().getRequest()
        if(!request.user ||!this.allowedRoles.includes(request.user['role'])){
            return false
        }
        return true
    }
}