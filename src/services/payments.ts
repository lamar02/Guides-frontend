import { api } from '@/lib/api';
import { PaymentSession, SubscriptionSession, SubscriptionStatus } from '@/types/payment';

export const paymentsService = {
  async createPayment(guideId: string, returnUrl: string): Promise<PaymentSession> {
    const response = await api.post<PaymentSession>('/payments', {
      guideId,
      returnUrl,
    });
    return response.data!;
  },

  async createSubscription(returnUrl: string): Promise<SubscriptionSession> {
    const response = await api.post<SubscriptionSession>('/subscriptions', {
      returnUrl,
    });
    return response.data!;
  },

  async getSubscription(): Promise<SubscriptionStatus> {
    const response = await api.get<SubscriptionStatus>('/subscriptions');
    return response.data!;
  },

  async cancelSubscription(): Promise<void> {
    await api.delete<void>('/subscriptions');
  },
};
