import { Loan } from "src/loans/entities/loan.entity";
import { AfterUpdate, BeforeInsert, Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { randomUUID } from "crypto";

@Entity()
export class Contract {
    @PrimaryColumn('uuid')
    idcontract: string;

    @Column('text')
    link: number;

    @Column('boolean', {default: true})
    status: boolean;

    @Column('uuid')
    userCreated: string;

    @Column('timestamp without time zone', {default: () => 'now()'})
    createAt: Date;

    @Column('timestamp without time zone', {default: () => 'now()'})
    updateAt: Date;

    @OneToOne(() => Loan, loan => loan.contract)
    loan: Loan;

    @BeforeInsert()
    generateId() {
        if (!this.idcontract) {
            this.idcontract = randomUUID();
        }
    }

    @AfterUpdate()
    updatedDate() {
        this.updateAt = new Date();
    }
}
