import { Exclude } from "class-transformer";
import { Roles } from "src/enums/enum";
import { Task } from "src/task/entities/task.entity";
import {  Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'varchar',unique:true})
    username:string;

    @Column()
    @Exclude()
    password:string;

    @Column({type:'varchar',enum: Roles,default:Roles.EMPLOYEE})
    role: Roles;

    @OneToMany(()=> Task,(taskList)=> taskList.employee)
    taskList: Task[]

    @DeleteDateColumn()
    deletedAt:Date;
}
