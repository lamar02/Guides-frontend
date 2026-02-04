'use client';

import { useState } from 'react';
import { paymentsService } from '@/services/payments';
import { PaymentSession } from '@/types/payment';

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (guideId: string): Promise<PaymentSession | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // URL de retour après paiement
      const returnUrl = `${window.location.origin}/payment/success?guideId=${guideId}`;

      const session = await paymentsService.createPayment(guideId, returnUrl);

      // Rediriger vers la page de paiement DodoPay
      window.location.href = session.checkoutUrl;

      return session;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de paiement';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { initiatePayment, isLoading, error };
}
