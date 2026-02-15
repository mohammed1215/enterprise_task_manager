import { Roles } from "../../enums/enum";

export interface JwtPayload {
    userId: string,
    username:string,
    role:Roles
}