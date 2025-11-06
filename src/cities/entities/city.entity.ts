import { Locality } from "src/localities/entities/locality.entity";
import { Municipality } from "src/municipality/entities/municipality.entity";
import { AfterUpdate, BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { randomUUID } from "crypto";

@Entity()
export class City {
    @PrimaryColumn('uuid')
    idcity: string;

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

    @ManyToOne(() => Municipality, mun => mun.cities)
    municipality: Municipality;

    @OneToMany(() => Locality, loc => loc.city)
    localities: Locality[];

    @BeforeInsert()
    generateId() {
        if (!this.idcity) {
            this.idcity = randomUUID();
        }
    }

    @AfterUpdate()
    updatedDate() {
        this.updateAt = new Date();
    }
}
