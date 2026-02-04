'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  Lock,
  CheckCircle,
  Share2,
  Star,
  Wrench,
  BookOpen,
  Loader2,
  Sparkles,
  CreditCard,
  ArrowLeft,
  LayoutGrid,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { usePayment } from '@/hooks/usePayment';
import { guidesService } from '@/services/guides';
import { Guide, GuideStep } from '@/types/guide';

function StepCard({ step, isActive, t }: { step: GuideStep; isActive: boolean; t: (key: string) => string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isActive ? 1 : 0.6, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border-0 bg-white rounded-2xl transition-shadow ${isActive ? 'shadow-lg' : 'shadow-sm'}`}>
        <CardContent className="p-6 md:p-8">
          <div className="flex gap-5">
            <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0">
              {step.number}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-black mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>

              {step.tips && step.tips.length > 0 && (
                <div className="mt-5 p-5 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-700 font-semibold mb-3">
                    <Lightbulb className="w-5 h-5" />
                    {t('guide.tips')}
                  </div>
                  <ul className="space-y-2">
                    {step.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-blue-600">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {step.warnings && step.warnings.length > 0 && (
                <div className="mt-5 p-5 bg-amber-50 rounded-xl">
                  <div className="flex items-center gap-2 text-amber-700 font-semibold mb-3">
                    <AlertTriangle className="w-5 h-5" />
                    {t('guide.warning')}
                  </div>
                  <ul className="space-y-2">
                    {step.warnings.map((warning, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-600">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RatingStars({ onRate, successMessage }: { onRate: (r: number) => void; successMessage: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleRate = (star: number) => {
    setRating(star);
    onRate(star);
    toast.success(successMessage);
  };

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`w-10 h-10 ${
              star <= (hover || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function GuidePage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { initiatePayment, isLoading: paymentLoading } = usePayment();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'list'>('carousel');

  const guideId = params.id as string;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadGuide = async () => {
      if (isAuthenticated && guideId) {
        try {
          const data = await guidesService.getGuide(guideId);
          setGuide(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Guide non trouvé');
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadGuide();
  }, [isAuthenticated, guideId]);

  const handlePayment = () => {
    if (guide) {
      initiatePayment(guide.id);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: guide?.title || 'Guide',
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('guide.linkCopied'));
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <Skeleton className="h-8 w-32 mb-6 rounded-xl" />
          <Skeleton className="h-12 w-full mb-4 rounded-xl" />
          <Skeleton className="h-32 w-full mb-8 rounded-2xl" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full mb-4 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-3">{error || t('errors.guideNotFound')}</h1>
          <Button asChild className="bg-black hover:bg-gray-900 text-white rounded-xl h-12 px-6 mt-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.back')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const content = guide.content;
  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500">{t('guide.contentNotAvailable')}</p>
        </div>
      </div>
    );
  }

  const totalSteps = content.steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <nav className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">{t('common.back')}</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleShare} className="text-gray-500 hover:text-black rounded-xl">
            <Share2 className="w-5 h-5" />
          </Button>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Guide Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
              {guide.productCategory || 'Guide'}
            </span>
            {guide.hasFullAccess && (
              <span className="px-3 py-1 bg-green-100 rounded-full text-sm font-medium text-green-700">
                {t('dashboard.complete')}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">{content.title}</h1>

          {content.introduction && (
            <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">{content.introduction}</p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* View Toggle & Progress */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-black">{t('guide.steps')}</h2>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('carousel')}
              className={`rounded-lg ${viewMode === 'carousel' ? 'bg-white shadow-sm' : ''}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={`rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {viewMode === 'carousel' && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-3">
              <span className="font-medium">{t('guide.stepOf').replace('{current}', String(currentStep + 1)).replace('{total}', String(totalSteps))}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Steps */}
        <AnimatePresence mode="wait">
          {viewMode === 'carousel' ? (
            <div key="carousel">
              <StepCard step={content.steps[currentStep]} isActive={true} t={t} />
              <div className="flex items-center justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  disabled={currentStep === 0}
                  className="rounded-xl border-gray-200 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t('guide.previous')}
                </Button>
                <div className="flex gap-2">
                  {content.steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentStep(i)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i === currentStep
                          ? 'bg-yellow-400 scale-125'
                          : i < currentStep
                            ? 'bg-gray-400'
                            : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <Button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  disabled={currentStep === totalSteps - 1}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl"
                >
                  {t('guide.next')}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <motion.div key="list" className="space-y-6">
              {content.steps.map((step) => (
                <StepCard key={step.number} step={step} isActive={true} t={t} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment CTA */}
        {!guide.hasFullAccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12">
            <Card className="border-0 bg-black rounded-3xl overflow-hidden">
              <CardContent className="p-10 text-center">
                <Lock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{t('guide.unlockComplete')}</h3>
                <p className="text-gray-400 mb-6">{t('guide.allStepsPlus')}</p>
                <div className="text-5xl font-bold text-white mb-8">3,99 €</div>
                <Button
                  size="lg"
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl h-14 px-8 font-semibold"
                >
                  {paymentLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      {t('guide.buyNow')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Troubleshooting */}
        {guide.hasFullAccess && content.troubleshooting?.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Wrench className="w-6 h-6 text-gray-700" />
              </div>
              <h2 className="text-2xl font-bold text-black">{t('guide.troubleshooting')}</h2>
            </div>
            <div className="space-y-4">
              {content.troubleshooting.map((item, i) => (
                <Card key={i} className="border-0 bg-white rounded-2xl shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-red-500 font-bold">✕</span>
                      </div>
                      <div>
                        <p className="font-semibold text-black mb-1">{t('guide.problem')}</p>
                        <p className="text-gray-600">{item.problem}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-black mb-1">{t('guide.solution')}</p>
                        <p className="text-gray-600">{item.solution}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Conclusion */}
        {guide.hasFullAccess && content.conclusion && (
          <Card className="mt-12 border-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-green-800">{t('guide.congratulations')}</h2>
              </div>
              <p className="text-green-700 leading-relaxed">{content.conclusion}</p>
            </CardContent>
          </Card>
        )}

        {/* Rating */}
        {guide.hasFullAccess && (
          <Card className="mt-12 border-0 bg-white rounded-2xl shadow-sm">
            <CardContent className="py-10 text-center">
              <p className="text-gray-700 font-semibold mb-6">{t('guide.ratingQuestion')}</p>
              <div className="flex justify-center">
                <RatingStars onRate={(r) => console.log('Rating:', r)} successMessage={t('guide.ratingSuccess')} />
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
