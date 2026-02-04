import { api } from '@/lib/api';
import { PaymentSession } from '@/types/payment';

export const paymentsService = {
  async createPayment(guideId: string, returnUrl: string): Promise<PaymentSession> {
    const response = await api.post<PaymentSession>('/payments', {
      guideId,
      returnUrl,
    });
    return response.data!;
  },
};
