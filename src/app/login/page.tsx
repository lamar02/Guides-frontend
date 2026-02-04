'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Sparkles, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useTranslation();
  const redirect = searchParams.get('redirect');

  const loginSchema = z.object({
    email: z.string().email(t('auth.login.emailError')),
    password: z.string().min(8, t('auth.login.passwordError')),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success(t('auth.login.success'));
      router.push(redirect || '/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('errors.connectionError'));
    }
  };

  const registerHref = redirect
    ? `/register?redirect=${encodeURIComponent(redirect)}`
    : '/register';

  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-lg font-semibold text-white">{t('common.brandName')}</span>
          </Link>

          <div>
            <h1 className="text-5xl font-bold text-white leading-tight mb-6">
              {t('auth.login.welcomeBack')}
              <br />
              <span className="text-yellow-400">{t('auth.login.welcomeBackHighlight')}</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              {t('auth.login.welcomeDescription')}
            </p>
          </div>

          <p className="text-gray-500 text-sm">
            {t('common.copyright')}
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile header */}
          <div className="lg:hidden mb-10">
            <div className="flex justify-between items-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t('common.back')}
              </Link>
              <LanguageSwitcher variant="minimal" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-lg font-semibold text-black">{t('common.brandName')}</span>
            </div>
          </div>

          {/* Desktop language switcher */}
          <div className="hidden lg:flex justify-end mb-6">
            <LanguageSwitcher variant="minimal" />
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-black mb-3">{t('auth.login.title')}</h2>
            <p className="text-gray-500">
              {redirect ? t('auth.login.subtitleRedirect') : t('auth.login.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                {t('auth.login.emailLabel')}
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.login.emailPlaceholder')}
                  {...register('email')}
                  disabled={isSubmitting}
                  className="h-14 pl-12 bg-white border-gray-200 rounded-xl text-base focus:border-yellow-400 focus:ring-yellow-400/20"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                {t('auth.login.passwordLabel')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.login.passwordPlaceholder')}
                  {...register('password')}
                  disabled={isSubmitting}
                  className="h-14 pl-12 bg-white border-gray-200 rounded-xl text-base focus:border-yellow-400 focus:ring-yellow-400/20"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-base font-semibold bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl transition-all hover:shadow-lg hover:shadow-yellow-400/25"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('auth.login.submitting')}
                </>
              ) : (
                t('auth.login.submitButton')
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              {t('auth.login.noAccount')}{' '}
              <Link href={registerHref} className="text-black font-semibold hover:text-yellow-600 transition-colors">
                {t('common.register')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
