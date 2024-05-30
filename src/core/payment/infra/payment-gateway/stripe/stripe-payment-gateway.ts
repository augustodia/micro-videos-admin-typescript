import { IPaymentGateway } from "../payment-gateway.interface";

export class StripePaymentGateway implements IPaymentGateway {
  constructor(private readonly stripeClient: any) {}

  async authorize(creditCardNumber: string, creditCardName: string, creditCardExpirationDate: Date, creditCardCVV: string, amount: number): Promise<boolean> {
    // Implementation for authorizing payment through Stripe API
    // This is a simplified example and does not represent a real Stripe API call
    console.log("Authorizing payment through Stripe");
    return true;
  }

  async capture(transactionId: string): Promise<boolean> {
    // Implementation for capturing payment through Stripe API
    console.log("Capturing payment through Stripe");
    return true;
  }

  async cancel(transactionId: string): Promise<boolean> {
    // Implementation for canceling payment through Stripe API
    console.log("Canceling payment through Stripe");
    return true;
  }
}
