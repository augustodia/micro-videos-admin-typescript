import { Module } from '@nestjs/common';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { PaymentRepository } from './infra/db/payment.repository';
import { StripePaymentGateway } from './infra/payment-gateway/stripe/stripe-payment-gateway';
import { PayPalPaymentGateway } from './infra/payment-gateway/paypal/paypal-payment-gateway';

@Module({
  providers: [
    ProcessPaymentUseCase,
    PaymentRepository,
    StripePaymentGateway,
    PayPalPaymentGateway,
  ],
  exports: [ProcessPaymentUseCase],
})
export class PaymentModule {}
