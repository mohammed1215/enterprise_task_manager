import { Roles } from "src/enums/enum";

export interface JwtPayload {
    userId: string,
    username:string,
    role:Roles
}