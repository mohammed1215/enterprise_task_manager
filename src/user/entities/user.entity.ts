import { Roles } from "src/enums/enum";
import { Task } from "src/task/entities/task.entity";
import {  Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    username:string;

    @Column()
    
    password:string;

    @Column({type:'varchar',enum: Roles,default:Roles.EMPLOYEE})
    role: Roles;

    @OneToMany(()=> Task,(taskList)=> taskList.employee)
    taskList: Task[]
}
