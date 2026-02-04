export interface PaymentSession {
  transactionId: string;
  checkoutUrl: string;
  paymentId: string;
  amount: number;
  currency: string;
}

export interface Transaction {
  id: string;
  guideId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  guide?: {
    id: string;
    title: string;
    productName: string;
  };
}
