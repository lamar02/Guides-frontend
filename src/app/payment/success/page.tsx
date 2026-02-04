'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle, Clock, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { guidesService } from '@/services/guides';
import { Guide } from '@/types/guide';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const guideId = searchParams.get('guideId');
  const confettiTriggered = useRef(false);

  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const triggerConfetti = () => {
    if (confettiTriggered.current) return;
    confettiTriggered.current = true;

    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#fcba04', '#fbbf24', '#10B981', '#000000', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!guideId || !isAuthenticated) return;

    const checkAccess = async () => {
      try {
        const guideData = await guidesService.getGuide(guideId);

        if (guideData.hasFullAccess) {
          setGuide(guideData);
          setIsLoading(false);
          triggerConfetti();
        } else if (retryCount < 10) {
          setTimeout(() => setRetryCount((c) => c + 1), 2000);
        } else {
          setIsLoading(false);
        }
      } catch {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [guideId, retryCount, isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-yellow-100 rounded-3xl flex items-center justify-center mx-auto">
              <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-black mb-3">
            {t('payment.verifying')}
          </h1>
          <p className="text-gray-500">
            {t('payment.verifyingDescription')}
          </p>
          <div className="mt-8 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-yellow-400 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (guide?.hasFullAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-10 text-center">
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="relative mb-8"
              >
                <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                >
                  🎉
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-black mb-4">
                  {t('payment.success')}
                </h1>
                <p className="text-gray-500 mb-8">
                  {t('payment.successDescription')}
                </p>

                {guide.title && (
                  <Card className="bg-gray-50 border-0 rounded-2xl mb-8">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-7 h-7 text-yellow-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-black line-clamp-1">{guide.title}</p>
                        <p className="text-sm text-gray-500">{guide.productName}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  asChild
                  size="lg"
                  className="w-full h-14 text-base font-semibold bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl"
                >
                  <Link href={`/guides/${guideId}`}>
                    {t('payment.viewGuide')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>

                <Button variant="ghost" asChild className="w-full mt-4 text-gray-500 hover:text-black">
                  <Link href="/dashboard">
                    {t('payment.backToDashboard')}
                  </Link>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-xl rounded-3xl">
          <CardContent className="p-10 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-black mb-3">
              {t('payment.processing')}
            </h1>
            <p className="text-gray-500 mb-8">
              {t('payment.processingDescription')}
            </p>
            <Button variant="outline" asChild className="w-full h-12 rounded-xl border-gray-200">
              <Link href="/dashboard">
                {t('payment.backToDashboard')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
