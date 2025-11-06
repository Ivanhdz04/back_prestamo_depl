import { Loan } from "src/loans/entities/loan.entity";
import { PaymentMethod } from "src/payment_methods/entities/payment_method.entity";
import { AfterUpdate, BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { randomUUID } from "crypto";

@Entity()
export class Payment {
    @PrimaryColumn('uuid')
    idpayment: string;

    @Column('numeric')
    amount: number;

    @Column('timestamp without time zone')
    payment_date: Date;

    @Column('boolean', {default: true})
    status: boolean;

    @Column('uuid')
    userCreated: string;

    @Column('timestamp without time zone', {default: () => 'now()'})
    createAt: Date;

    @Column('timestamp without time zone', {default: () => 'now()'})
    updateAt: Date;

    @ManyToOne(() => Loan, loan => loan.payments)
    loan: Loan;

    @ManyToOne(() => PaymentMethod, payMethod => payMethod.payments)
    payment_method: PaymentMethod;

    @BeforeInsert()
    generateId() {
        if (!this.idpayment) {
            this.idpayment = randomUUID();
        }
    }

    @AfterUpdate()
    updatedDate() {
        this.updateAt = new Date();
    }
}
