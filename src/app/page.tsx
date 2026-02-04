'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  FileText,
  Zap,
  Shield,
  Clock,
  Upload,
  Link as LinkIcon,
  Loader2,
  Sparkles,
  ArrowRight,
  CheckCircle,
  LayoutDashboard,
  Lock,
  Lightbulb,
  AlertTriangle,
  Wrench,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  WashingMachine,
  Sofa,
  Wifi,
  Monitor,
  Headphones,
  Building2,
  CreditCard,
  Eye,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { publicService } from '@/services/public';

export default function HomePage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const analyzeSchema = z.object({
    fileUrl: z.string().url(t('home.form.urlError')),
    title: z.string().optional(),
  });

  type AnalyzeFormData = z.infer<typeof analyzeSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AnalyzeFormData>({
    resolver: zodResolver(analyzeSchema)
  });

  const onSubmit = async (data: AnalyzeFormData) => {
    setIsLoading(true);
    try {
      const result = await publicService.analyzeDocument(data.fileUrl, data.title || undefined, locale);
      toast.success(locale === 'fr' ? 'Document analyse avec succes !' : 'Document analyzed successfully!');
      router.push(`/preview/${result.sessionToken}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('errors.genericError'));
      setIsLoading(false);
    }
  };

  const scrollToForm = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Testimonials auto-scroll
  const testimonials = ['1', '2', '3', '4', '5', '6'];

  const nextTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, [nextTestimonial]);

  const useCaseIcons = [WashingMachine, Sofa, Wifi, Monitor, Headphones, Building2];
  const useCaseKeys = ['appliance', 'furniture', 'router', 'software', 'support', 'internal'];

  return (
    <div className="min-h-screen bg-[#fafafa] overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-4 sm:py-5 bg-[#fafafa]/80 backdrop-blur-lg"
      >
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            </div>
            <span className="text-base sm:text-lg font-semibold tracking-tight text-black">{t('common.brandName')}</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher variant="minimal" />
            {authLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : isAuthenticated ? (
              <Button asChild className="bg-black hover:bg-gray-900 text-white rounded-full px-4 sm:px-6 font-medium text-sm sm:text-base">
                <Link href="/dashboard">
                  <LayoutDashboard className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">{t('common.dashboard')}</span>
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden sm:flex text-gray-600 hover:text-black hover:bg-transparent font-medium">
                  <Link href="/login">{t('common.login')}</Link>
                </Button>
                <Button asChild className="bg-black hover:bg-gray-900 text-white rounded-full px-4 sm:px-6 font-medium text-sm sm:text-base">
                  <Link href="/register">
                    <span className="hidden sm:inline">{t('common.getStarted')}</span>
                    <span className="sm:hidden">{t('common.login')}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </motion.header>

      {/* ===== SECTION 1: HERO ===== */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="absolute top-20 left-0 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-0 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-400/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-400/10 rounded-full mb-6 sm:mb-8">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">{t('home.badge')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-[1.1] tracking-tight mb-6 sm:mb-8">
                {t('home.heroTitle')}
                <br />
                <span className="relative inline-block">
                  {t('home.heroTitleHighlight')}
                  <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 150 2 298 10" stroke="#fcba04" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0">
                {t('home.heroDescription')}
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
                {['freePreview', 'oneTimePayment', 'permanentAccess'].map((key, i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <span>{t(`home.features.${key}`)}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="relative bg-white border-0 shadow-2xl shadow-black/5 rounded-2xl sm:rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
                <CardContent className="p-5 sm:p-8 md:p-10">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">{t('home.form.title')}</h2>
                    <p className="text-gray-500">{t('home.form.subtitle')}</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="fileUrl" className="text-sm font-medium text-gray-700">
                        {t('home.form.urlLabel')}
                      </Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="fileUrl"
                          type="url"
                          placeholder={t('home.form.urlPlaceholder')}
                          {...register('fileUrl')}
                          disabled={isLoading}
                          className="h-14 pl-12 bg-gray-50 border-0 rounded-xl text-base focus:bg-white focus:ring-2 focus:ring-yellow-400/50 transition-all"
                        />
                      </div>
                      {errors.fileUrl && (
                        <p className="text-sm text-red-500 font-medium">{errors.fileUrl.message}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                        {t('home.form.titleLabel')} <span className="text-gray-400 font-normal">{t('home.form.titleOptional')}</span>
                      </Label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="title"
                          type="text"
                          placeholder={t('home.form.titlePlaceholder')}
                          {...register('title')}
                          disabled={isLoading}
                          className="h-14 pl-12 bg-gray-50 border-0 rounded-xl text-base focus:bg-white focus:ring-2 focus:ring-yellow-400/50 transition-all"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-base font-semibold bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl transition-all hover:shadow-lg hover:shadow-yellow-400/25"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {t('home.form.analyzing')}
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-2" />
                          {t('home.form.submitButton')}
                        </>
                      )}
                    </Button>
                  </form>

                  <p className="text-center text-sm text-gray-400 mt-6">
                    {t('home.form.footer')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: BEFORE/AFTER ===== */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3">
              {t('home.beforeAfter.title')}
            </h2>
            <p className="text-gray-500 text-lg">{t('home.beforeAfter.subtitle')}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-2 border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 flex items-center gap-2">
                  <span className="px-2 py-1 bg-gray-300 rounded text-xs font-medium text-gray-600">
                    {t('home.beforeAfter.before.label')}
                  </span>
                </div>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                    <h3 className="text-xl font-bold text-gray-700">{t('home.beforeAfter.before.title')}</h3>
                  </div>
                  <div className="space-y-2 text-gray-400 text-sm">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-3 bg-gray-200 rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
                    ))}
                  </div>
                  <p className="mt-6 text-gray-500 italic">{t('home.beforeAfter.before.description')}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* After */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-2 border-yellow-400 rounded-2xl overflow-hidden shadow-lg shadow-yellow-400/10">
                <div className="bg-yellow-400 px-4 py-2 flex items-center gap-2">
                  <span className="px-2 py-1 bg-yellow-500 rounded text-xs font-medium text-black">
                    {t('home.beforeAfter.after.label')}
                  </span>
                </div>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-8 h-8 text-yellow-500" />
                    <h3 className="text-xl font-bold text-black">{t('home.beforeAfter.after.title')}</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: CheckCircle, key: 'steps', color: 'text-green-500' },
                      { icon: Lightbulb, key: 'tips', color: 'text-blue-500' },
                      { icon: AlertTriangle, key: 'warnings', color: 'text-amber-500' },
                      { icon: Wrench, key: 'troubleshooting', color: 'text-gray-600' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        <span className="font-medium text-gray-700">{t(`home.beforeAfter.after.${item.key}`)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: HOW IT WORKS ===== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-gray-500 text-lg">{t('home.howItWorks.subtitle')}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: '01', icon: LinkIcon, key: 'step1' },
              { step: '02', icon: Eye, key: 'step2' },
              { step: '03', icon: Lock, key: 'step3' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="relative h-full bg-white border-gray-100 rounded-2xl hover:shadow-xl transition-all group overflow-hidden">
                  <CardContent className="p-6 sm:p-8">
                    <span className="absolute top-6 right-6 text-6xl font-bold text-gray-100 group-hover:text-yellow-100 transition-colors">
                      {item.step}
                    </span>
                    <div className="relative">
                      <div className="w-14 h-14 bg-gray-100 group-hover:bg-yellow-400 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                        <item.icon className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors" />
                      </div>
                      <h3 className="text-xl font-bold text-black mb-3">
                        {t(`home.howItWorks.${item.key}.title`)}
                      </h3>
                      <p className="text-gray-500 leading-relaxed">
                        {t(`home.howItWorks.${item.key}.description`)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Button onClick={scrollToForm} size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl px-8 h-14 font-semibold">
              {t('home.howItWorks.cta')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 4: EXAMPLE GUIDE ===== */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3">
              {t('home.example.title')}
            </h2>
            <p className="text-gray-500 text-lg">{t('home.example.subtitle')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
              <div className="bg-black px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">{t('home.example.guideTitle')}</span>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                  {t('dashboard.complete')}
                </span>
              </div>
              <CardContent className="p-6 sm:p-8">
                <p className="text-gray-600 mb-6 italic">{t('home.example.introduction')}</p>

                <div className="space-y-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                        {num}
                      </div>
                      <p className="text-gray-700 pt-2">{t(`home.example.step${num}`)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
                  <Lock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">{t('home.example.locked')}</p>
                  <p className="text-gray-400 text-sm">{t('home.example.lockedSub')}</p>
                </div>

                <div className="mt-6 text-center">
                  <Button onClick={scrollToForm} className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl px-6 h-12 font-semibold">
                    {t('home.example.cta')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 5: BENEFITS ===== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3">
              {t('home.benefits.title')}
            </h2>
            <p className="text-gray-500 text-lg">{t('home.benefits.subtitle')}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { key: 'clear', icon: FileText, color: 'bg-blue-100 text-blue-600' },
              { key: 'time', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
              { key: 'free', icon: Eye, color: 'bg-green-100 text-green-600' },
              { key: 'permanent', icon: Shield, color: 'bg-purple-100 text-purple-600' },
            ].map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 bg-white shadow-lg shadow-black/5 rounded-2xl hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-black mb-2">
                      {t(`home.benefits.items.${item.key}.title`)}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {t(`home.benefits.items.${item.key}.description`)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: TESTIMONIALS CAROUSEL ===== */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3">
              {t('home.testimonials.title')}
            </h2>
          </motion.div>

          <div className="relative">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-3 gap-6"
                >
                  {[0, 1, 2].map((offset) => {
                    const index = (currentTestimonial + offset) % testimonials.length;
                    const id = testimonials[index];
                    return (
                      <Card key={`${id}-${offset}`} className={`border-0 bg-white shadow-lg rounded-2xl ${offset > 0 ? 'hidden md:block' : ''}`}>
                        <CardContent className="p-6">
                          <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-gray-700 italic mb-6">
                            "{t(`home.testimonials.items.${id}.quote`)}"
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                              {t(`home.testimonials.items.${id}.name`).charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-black">{t(`home.testimonials.items.${id}.name`)}</p>
                              <p className="text-sm text-gray-500">{t(`home.testimonials.items.${id}.role`)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentTestimonial ? 'bg-yellow-400 w-6' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
              <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 7: USE CASES ===== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3">
              {t('home.useCases.title')}
            </h2>
            <p className="text-gray-500 text-lg">{t('home.useCases.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {useCaseKeys.map((key, index) => {
              const Icon = useCaseIcons[index];
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 bg-white shadow-md hover:shadow-lg rounded-xl transition-shadow cursor-pointer group">
                    <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-gray-100 group-hover:bg-yellow-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
                        <Icon className="w-6 h-6 text-gray-600 group-hover:text-yellow-600 transition-colors" />
                      </div>
                      <p className="font-medium text-gray-700 text-sm sm:text-base">
                        {t(`home.useCases.items.${key}`)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SECTION 8: PRICING ===== */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-black text-white rounded-2xl sm:rounded-3xl overflow-hidden">
              <CardContent className="p-8 sm:p-12 md:p-16 text-center">
                <span className="text-yellow-400 font-semibold text-sm tracking-wider uppercase mb-4 block">
                  {t('home.pricing.label')}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                  {t('home.pricing.title')} {t('home.pricing.titleHighlight')}
                </h2>
                <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
                  {t('home.pricing.description')}
                </p>

                <div className="inline-block bg-white/10 backdrop-blur rounded-2xl p-8 mb-8">
                  <p className="text-gray-400 mb-2">{t('home.pricing.perGuide')}</p>
                  <div className="flex items-baseline justify-center gap-1 mb-6">
                    <span className="text-6xl sm:text-7xl font-bold">3.99</span>
                    <span className="text-2xl">€</span>
                  </div>

                  <div className="space-y-3 text-left mb-6">
                    {['complete', 'expert', 'troubleshooting', 'permanent', 'multilang'].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                        <span className="text-gray-300">{t(`home.pricing.features.${item}`)}</span>
                      </div>
                    ))}
                  </div>

                  <Button onClick={scrollToForm} size="lg" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl h-14">
                    {t('home.pricing.cta')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>

                <p className="text-gray-500 text-sm">{t('home.pricing.guarantee')}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 9: TRUST ===== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
              {t('home.trust.title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { key: 'secure', icon: Shield },
              { key: 'noCard', icon: CreditCard },
              { key: 'instant', icon: Zap },
              { key: 'ai', icon: Cpu },
            ].map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-gray-700" />
                </div>
                <h3 className="font-semibold text-black mb-1">{t(`home.trust.items.${item.key}.title`)}</h3>
                <p className="text-gray-500 text-sm">{t(`home.trust.items.${item.key}.description`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 10: FAQ ===== */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
              {t('home.faq.title')}
            </h2>
          </motion.div>

          <div className="space-y-4">
            {['1', '2', '3', '4', '5'].map((id, index) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-black pr-4">{t(`home.faq.items.${id}.question`)}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 text-gray-600">
                          {t(`home.faq.items.${id}.answer`)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 11: FINAL CTA ===== */}
      <section className="py-16 sm:py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {t('home.cta.title')}
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              {t('home.cta.subtitle')}
            </p>
            <Button onClick={scrollToForm} size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl px-8 h-14 text-lg">
              {t('home.cta.button')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-gray-200 py-8 sm:py-10 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-lg sm:rounded-xl flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
            </div>
            <span className="text-xs sm:text-sm text-gray-600">{t('common.copyright')}</span>
          </div>
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
            <Link href="#" className="hover:text-black transition-colors">{t('common.privacy')}</Link>
            <Link href="#" className="hover:text-black transition-colors">{t('common.terms')}</Link>
            <Link href="#" className="hover:text-black transition-colors">{t('common.faq')}</Link>
            <Link href="#" className="hover:text-black transition-colors">{t('common.contact')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
