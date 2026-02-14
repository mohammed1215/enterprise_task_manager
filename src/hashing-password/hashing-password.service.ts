import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt'
@Injectable()
export class HashingPasswordService {
   async hashPassword(password:string){
        const saltRounds = 10;
        const hash = await bcrypt.hash(password,saltRounds)
        return hash
    }

    async comparePassword(hashPassword:string,password:string){
        return await bcrypt.compare(password,hashPassword)
    }
}
