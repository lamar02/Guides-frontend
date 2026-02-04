'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Lock,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Sparkles,
  CreditCard,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/contexts/LanguageContext';
import { publicService, PreviewData } from '@/services/public';
import { useAuth } from '@/hooks/useAuth';
import { paymentsService } from '@/services/payments';

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const previewId = params.id as string;

  useEffect(() => {
    const loadPreview = async () => {
      try {
        const data = await publicService.getPreview(previewId);
        setPreview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Preview not found');
      } finally {
        setIsLoading(false);
      }
    };

    if (previewId) {
      loadPreview();
    }
  }, [previewId]);

  const handlePayment = async () => {
    if (!isAuthenticated) {
      localStorage.setItem('pendingPreviewId', previewId);
      router.push(`/login?redirect=/preview/${previewId}`);
      return;
    }

    setIsPaymentLoading(true);
    try {
      const claimResult = await publicService.claimPreview(
        previewId,
        localStorage.getItem('apiKey') || ''
      );

      const returnUrl = `${window.location.origin}/payment/success?guideId=${claimResult.guideId}`;
      const paymentResult = await paymentsService.createPayment(claimResult.guideId, returnUrl);

      window.location.href = paymentResult.checkoutUrl;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('preview.paymentError'));
      setIsPaymentLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <Skeleton className="h-10 w-64 mb-8 rounded-xl" />
          <Skeleton className="h-6 w-96 mb-12 rounded-lg" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !preview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-3">{t('preview.notFound')}</h1>
          <p className="text-gray-500 mb-8 max-w-sm">
            {error || t('preview.notFoundDescription')}
          </p>
          <Button asChild className="bg-black hover:bg-gray-900 text-white rounded-xl h-12 px-6">
            <Link href="/">{t('common.home')}</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  if (preview.status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-3xl flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-black mb-3">{t('preview.processing')}</h1>
          <p className="text-gray-500">{t('preview.processingDescription')}</p>
        </motion.div>
      </div>
    );
  }

  const stepsCount = preview.content?.steps?.length || 0;
  const totalSteps = stepsCount + 7;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <nav className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-lg font-semibold text-black">{t('common.brandName')}</span>
          </Link>
          <div className="flex gap-3 items-center">
            <LanguageSwitcher variant="minimal" />
            {authLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : isAuthenticated ? (
              <Button variant="ghost" asChild className="text-gray-600 hover:text-black">
                <Link href="/dashboard">{t('common.dashboard')}</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-gray-600 hover:text-black">
                  <Link href={`/login?redirect=/preview/${previewId}`}>{t('common.login')}</Link>
                </Button>
                <Button asChild className="bg-black hover:bg-gray-900 text-white rounded-full px-5">
                  <Link href={`/register?redirect=/preview/${previewId}`}>{t('common.register')}</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Guide Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
              {preview.productCategory || 'Guide'}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              {t('preview.validFor')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
            {preview.title || preview.productName}
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Steps Preview */}
          <div className="lg:col-span-2">
            <AnimatePresence>
              {preview.content && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {preview.content.introduction && (
                    <Card className="mb-8 border-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                      <CardContent className="p-6">
                        <p className="text-gray-700 leading-relaxed">{preview.content.introduction}</p>
                      </CardContent>
                    </Card>
                  )}

                  <h2 className="text-xl font-bold text-black mb-6">{t('preview.stepsPreview')}</h2>

                  <div className="space-y-4">
                    {preview.content.steps.map((step, index) => (
                      <motion.div
                        key={step.number}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 * index }}
                      >
                        <Card className="border-0 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex gap-5">
                              <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0">
                                {step.number}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-black mb-2">
                                  {step.title}
                                </h3>
                                <p className="text-gray-600">{step.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Locked indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center"
                  >
                    <Lock className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">
                      {t('preview.moreSteps').replace('{count}', String(totalSteps - stepsCount))}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {t('preview.includingTroubleshooting')}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky Payment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 bg-black text-white rounded-3xl overflow-hidden shadow-2xl">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-2">{t('preview.unlockFull')}</h3>
                    <p className="text-gray-400 mb-6">{t('preview.unlockDescription')}</p>

                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-5xl font-bold">3,99</span>
                      <span className="text-xl text-gray-400">€</span>
                    </div>

                    <div className="space-y-3 mb-8">
                      {[
                        { icon: CheckCircle, key: 'complete' },
                        { icon: Zap, key: 'expert' },
                        { icon: Shield, key: 'troubleshooting' },
                        { icon: Clock, key: 'permanent' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-yellow-400" />
                          <span className="text-gray-300">{t(`preview.features.${item.key}`)}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      size="lg"
                      onClick={handlePayment}
                      disabled={isPaymentLoading}
                      className="w-full h-14 text-base font-semibold bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl"
                    >
                      {isPaymentLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {t('preview.redirecting')}
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          {t('preview.unlockButton')}
                        </>
                      )}
                    </Button>

                    <p className="text-center text-gray-500 text-sm mt-4 flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" />
                      {t('common.securePayment')}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
