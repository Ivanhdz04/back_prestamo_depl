import { Client } from "src/clients/entities/client.entity";
import { Locality } from "src/localities/entities/locality.entity";
import { AfterUpdate, BeforeInsert, Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { randomUUID } from "crypto";

@Entity()
export class Direction {
    @PrimaryColumn('uuid')
    iddirection: string;

    @Column('character varying')
    street: string;

    @Column('character varying')
    postal_code: string;

    @Column('character varying', {nullable: true})
    external_number?: string;

    @Column('character varying', {nullable: true})
    internal_number?: string;

    @Column('boolean', {default: true})
    status: boolean;

    @Column('uuid')
    userCreated: string;

    @Column('timestamp without time zone', {default: () => 'now()'})
    createAt: Date;

    @Column('timestamp without time zone', {default: () => 'now()'})
    updateAt: Date;

    @ManyToOne(() => Locality, loc => loc.directions)
    locality: Locality;

    @OneToOne(() => Client, client => client.direction)
    client: Client;

    @BeforeInsert()
    generateId() {
        if (!this.iddirection) {
            this.iddirection = randomUUID();
        }
    }

    @AfterUpdate()
    updatedDate() {
        this.updateAt = new Date();
    }
}
