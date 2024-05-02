export interface IPaymentGateway {
  authorize(creditCardNumber: string, creditCardName: string, creditCardExpirationDate: Date, creditCardCVV: string, amount: number): Promise<boolean>;
  capture(transactionId: string): Promise<boolean>;
  cancel(transactionId: string): Promise<boolean>;
}
