import { Payment } from './payment.entity';

export interface IPaymentRepository {
  processPayment(payment: Payment): Promise<void>;
}
