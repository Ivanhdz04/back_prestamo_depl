import { Municipality } from "src/municipality/entities/municipality.entity";
import { AfterUpdate, BeforeInsert, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { randomUUID } from "crypto";

@Entity()
export class State {
    @PrimaryColumn('uuid')
    idstate: string;

    @Column('character varying')
    name: string;

    @Column('boolean', {default: true})
    status: boolean;

    @Column('uuid')
    userCreated: string;

    @Column('timestamp without time zone', {default: () => 'now()'})
    createAt: Date;

    @Column('timestamp without time zone', {default: () => 'now()'})
    updateAt: Date;

    @OneToMany(() => Municipality, mun => mun.state)
    municipalities: Municipality[];

    @BeforeInsert()
    generateId() {
        if (!this.idstate) {
            this.idstate = randomUUID();
        }
    }

    @AfterUpdate()
    updatedDate() {
        this.updateAt = new Date();
    }
}
