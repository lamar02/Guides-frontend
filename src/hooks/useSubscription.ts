'use client';

import { useState, useEffect } from 'react';
import { paymentsService } from '@/services/payments';
import { Subscription } from '@/types/payment';
import { useAuth } from '@/hooks/useAuth';

export function useSubscription() {
  const { isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSubscribed = subscription?.status === 'active';

  useEffect(() => {
    const loadSubscription = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await paymentsService.getSubscription();
        setSubscription(result.subscription);
      } catch {
        // No subscription or error - that's fine
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, [isAuthenticated]);

  const subscribe = async (returnUrl?: string) => {
    setError(null);
    try {
      const url = returnUrl || `${window.location.origin}/payment/success?subscription=true`;
      const session = await paymentsService.createSubscription(url);
      window.location.href = session.checkoutUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Subscription error';
      setError(message);
    }
  };

  const cancel = async () => {
    setError(null);
    try {
      await paymentsService.cancelSubscription();
      setSubscription(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Cancellation error';
      setError(message);
    }
  };

  return { subscription, isSubscribed, isLoading, error, subscribe, cancel };
}
