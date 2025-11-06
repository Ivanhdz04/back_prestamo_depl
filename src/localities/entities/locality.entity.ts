import { City } from "src/cities/entities/city.entity";
import { Direction } from "src/directions/entities/direction.entity";
import { AfterUpdate, BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { randomUUID } from "crypto";

@Entity()
export class Locality {
    @PrimaryColumn('uuid')
    idlocality: string;

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

    @ManyToOne(() => City, city => city.localities)
    city: City;

    @OneToMany(() => Direction, dir => dir.locality)
    directions: Direction[]

    @BeforeInsert()
    generateId() {
        if (!this.idlocality) {
            this.idlocality = randomUUID();
        }
    }

    @AfterUpdate()
    updatedDate() {
        this.updateAt = new Date();
    }
}
