'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { FileText, Zap, Shield, Clock, Upload, Link as LinkIcon, Loader2, Sparkles, ArrowRight, CheckCircle, LayoutDashboard } from 'lucide-react';
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
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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
      const result = await publicService.analyzeDocument(data.fileUrl, data.title || undefined);
      toast.success('Document analyzed successfully!');
      router.push(`/preview/${result.sessionToken}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('errors.genericError'));
      setIsLoading(false);
    }
  };

  const features = [
    { key: 'freePreview', icon: Shield },
    { key: 'oneTimePayment', icon: Clock },
    { key: 'permanentAccess', icon: CheckCircle },
  ];

  const steps = [
    { step: '01', icon: LinkIcon, key: 'step1' },
    { step: '02', icon: Zap, key: 'step2' },
    { step: '03', icon: FileText, key: 'step3' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] overflow-hidden">
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-40 px-6 py-5"
      >
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-black">{t('common.brandName')}</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="minimal" />
            {authLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : isAuthenticated ? (
              <Button asChild className="bg-black hover:bg-gray-900 text-white rounded-full px-6 font-medium">
                <Link href="/dashboard">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  {t('common.dashboard')}
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-gray-600 hover:text-black hover:bg-transparent font-medium">
                  <Link href="/login">{t('common.login')}</Link>
                </Button>
                <Button asChild className="bg-black hover:bg-gray-900 text-white rounded-full px-6 font-medium">
                  <Link href="/register">
                    {t('common.getStarted')}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 rounded-full mb-8">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">{t('home.badge')}</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-black leading-[1.1] tracking-tight mb-8">
                {t('home.heroTitle')}
                <br />
                <span className="relative">
                  {t('home.heroTitleHighlight')}
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 150 2 298 10" stroke="#fcba04" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-lg">
                {t('home.heroDescription')}
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-yellow-500" />
                    {t(`home.features.${feature.key}`)}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="relative bg-white border-0 shadow-2xl shadow-black/5 rounded-3xl overflow-hidden">
                {/* Card accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />

                <CardContent className="p-8 md:p-10">
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

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-6 mt-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-gray-500 text-lg">{t('home.howItWorks.subtitle')}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Card className="relative h-full bg-white border-gray-100 rounded-2xl hover:shadow-xl hover:shadow-black/5 transition-all duration-300 group overflow-hidden">
                  <CardContent className="p-8">
                    <span className="absolute top-6 right-6 text-6xl font-bold text-gray-100 group-hover:text-yellow-100 transition-colors">
                      {step.step}
                    </span>
                    <div className="relative">
                      <div className="w-14 h-14 bg-gray-100 group-hover:bg-yellow-400 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                        <step.icon className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors" />
                      </div>
                      <h3 className="text-xl font-bold text-black mb-3">
                        {t(`home.howItWorks.${step.key}.title`)}
                      </h3>
                      <p className="text-gray-500 leading-relaxed">
                        {t(`home.howItWorks.${step.key}.description`)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="max-w-7xl mx-auto px-6 mt-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Card className="bg-black text-white rounded-3xl overflow-hidden">
              <CardContent className="p-12 md:p-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <span className="text-yellow-400 font-semibold text-sm tracking-wider uppercase mb-4 block">
                      {t('home.pricing.label')}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                      {t('home.pricing.title')}
                      <br />
                      {t('home.pricing.titleHighlight')}
                    </h2>
                    <p className="text-gray-400 text-lg mb-8">
                      {t('home.pricing.description')}
                    </p>
                    <div className="space-y-3">
                      {['complete', 'expert', 'troubleshooting', 'permanent'].map((item) => (
                        <div key={item} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-yellow-400" />
                          <span className="text-gray-300">{t(`home.pricing.features.${item}`)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="inline-block bg-white/10 backdrop-blur rounded-3xl p-10">
                      <p className="text-gray-400 mb-2">{t('home.pricing.perGuide')}</p>
                      <div className="flex items-baseline justify-center md:justify-end gap-1 mb-6">
                        <span className="text-6xl md:text-7xl font-bold">3.99</span>
                        <span className="text-2xl">€</span>
                      </div>
                      <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl px-8 h-14">
                        <Link href="/register">
                          {t('home.pricing.cta')}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
            <span className="text-sm text-gray-600">{t('common.copyright')}</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-black transition-colors">{t('common.privacy')}</Link>
            <Link href="#" className="hover:text-black transition-colors">{t('common.terms')}</Link>
            <Link href="#" className="hover:text-black transition-colors">{t('common.contact')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
