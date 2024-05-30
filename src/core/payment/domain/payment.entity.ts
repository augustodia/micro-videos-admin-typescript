import { Entity } from '../../shared/domain/entity';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Notification } from '../../shared/domain/validators/notification';

export type PaymentProps = {
  payment_id?: Uuid | null;
  credit_card_number: string;
  credit_card_name: string;
  credit_card_expiration_date: Date;
  credit_card_cvv: string;
  amount: number;
  created_at?: Date;
};

export class Payment extends Entity {
  payment_id: Uuid;
  credit_card_number: string;
  credit_card_name: string;
  credit_card_expiration_date: Date;
  credit_card_cvv: string;
  amount: number;
  created_at: Date;

  constructor(props: PaymentProps) {
    super();
    this.payment_id = props.payment_id ?? new Uuid();
    this.credit_card_number = props.credit_card_number;
    this.credit_card_name = props.credit_card_name;
    this.credit_card_expiration_date = props.credit_card_expiration_date;
    this.credit_card_cvv = props.credit_card_cvv;
    this.amount = props.amount;
    this.created_at = props.created_at ?? new Date();
    this.validate();
  }

  get entity_id(): Uuid {
    return this.payment_id;
  }

  validate(): boolean {
    // Validation logic for credit card details
    // This should include checks for valid credit card number, CVV, expiration date, and non-negative amount
    // For simplicity, we're not implementing a full validation logic here
    if (this.amount < 0) {
      this.notification.addError('Amount must be non-negative');
    }
    // Additional validation checks should be added here
    return !this.notification.hasErrors();
  }

  public toJSON() {
    return {
      payment_id: this.payment_id.id,
      credit_card_number: this.credit_card_number,
      credit_card_name: this.credit_card_name,
      credit_card_expiration_date: this.credit_card_expiration_date,
      credit_card_cvv: this.credit_card_cvv,
      amount: this.amount,
      created_at: this.created_at,
    };
  }
}
