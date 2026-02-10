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

export interface SubscriptionSession {
  subscriptionId: string;
  checkoutUrl: string;
  amount: number;
  currency: string;
}

export interface Subscription {
  id: string;
  userId: string;
  status: 'pending' | 'active' | 'cancelled' | 'expired' | 'past_due';
  provider: string;
  providerSubscriptionId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelledAt: string | null;
  createdAt: string;
}

export interface SubscriptionStatus {
  isActive: boolean;
  subscription: Subscription | null;
}
