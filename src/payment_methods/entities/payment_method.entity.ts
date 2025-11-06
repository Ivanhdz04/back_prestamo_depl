import { Payment } from "src/payments/entities/payment.entity";
import { AfterUpdate, BeforeInsert, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { randomUUID } from "crypto";

@Entity()
export class PaymentMethod {
    @PrimaryColumn('uuid')
    idpayment_method: string;

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

    @OneToMany(() => Payment, pay => pay.payment_method)
    payments: Payment[];

    @BeforeInsert()
    generateId() {
        if (!this.idpayment_method) {
            this.idpayment_method = randomUUID();
        }
    }

    @AfterUpdate()
    updatedDate() {
        this.updateAt = new Date();
    }
}
