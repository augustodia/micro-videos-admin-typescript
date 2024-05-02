import { IUseCase } from '../../../../shared/application/use-case.interface';
import { Payment } from '../../domain/payment.entity';
import { IPaymentRepository } from '../../domain/payment.repository';
import { PaymentOutput, PaymentOutputMapper } from './common/payment-output';

export class ProcessPaymentUseCase implements IUseCase<ProcessPaymentInput, ProcessPaymentOutput> {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  async execute(input: ProcessPaymentInput): Promise<ProcessPaymentOutput> {
    const payment = new Payment(input);

    if (payment.notification.hasErrors()) {
      throw new Error('Payment details are invalid');
    }

    await this.paymentRepo.processPayment(payment);

    return PaymentOutputMapper.toOutput(payment);
  }
}

export type ProcessPaymentInput = {
  credit_card_number: string;
  credit_card_name: string;
  credit_card_expiration_date: Date;
  credit_card_cvv: string;
  amount: number;
};

export type ProcessPaymentOutput = PaymentOutput;
