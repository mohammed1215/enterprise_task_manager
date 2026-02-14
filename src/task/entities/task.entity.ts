import { TaskStatus } from "src/enums/enum";
import { User } from "src/user/entities/user.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({nullable:false})
    title:string;

    @Column()
    description:string;

    @ManyToOne(()=>User,(user)=>user.taskList)
    employee: User;

    @Column({type:'varchar',enum: TaskStatus, default: TaskStatus.OPEN})
    status:string;

    @DeleteDateColumn()
    deletedAt:Date;
}
