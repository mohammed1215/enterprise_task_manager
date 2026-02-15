import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy ,ExtractJwt} from "passport-jwt";
import { JwtPayload } from "./interface/jwt.interface";

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, 'jwt'){

    constructor( config:ConfigService){
        super({
            secretOrKey: config.getOrThrow('JWT_SECRET'),
            ignoreExpiration:false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    validate(payload:JwtPayload): unknown {
        return payload
    }
    
}