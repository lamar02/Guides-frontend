'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Sparkles, Mail, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { t } = useTranslation();
  const redirect = searchParams.get('redirect');

  const registerSchema = z.object({
    email: z.string().email(t('auth.login.emailError')),
    password: z.string().min(8, t('auth.login.passwordError')),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.register.confirmPasswordError'),
    path: ['confirmPassword'],
  });

  type RegisterFormData = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({ email: data.email, password: data.password });
      toast.success(t('auth.register.success'));
      router.push(redirect || '/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('errors.genericError'));
    }
  };

  const loginHref = redirect
    ? `/login?redirect=${encodeURIComponent(redirect)}`
    : '/login';

  const benefits = ['free', 'noCard', 'instant'];

  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-lg font-semibold text-white">{t('common.brandName')}</span>
          </Link>

          <div>
            <h1 className="text-5xl font-bold text-white leading-tight mb-6">
              {t('auth.register.createYour')}
              <br />
              <span className="text-yellow-400">{t('auth.register.createHighlight')}</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md mb-8">
              {t('auth.register.welcomeDescription')}
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">{t(`auth.register.benefits.${benefit}`)}</span>
                </motion.div>
              ))}
            </div>
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
            <h2 className="text-3xl font-bold text-black mb-3">{t('auth.register.title')}</h2>
            <p className="text-gray-500">{t('auth.register.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                {t('auth.register.emailLabel')}
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.register.emailPlaceholder')}
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
                {t('auth.register.passwordLabel')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.register.passwordPlaceholder')}
                  {...register('password')}
                  disabled={isSubmitting}
                  className="h-14 pl-12 bg-white border-gray-200 rounded-xl text-base focus:border-yellow-400 focus:ring-yellow-400/20"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                {t('auth.register.confirmPasswordLabel')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
                  {...register('confirmPassword')}
                  disabled={isSubmitting}
                  className="h-14 pl-12 bg-white border-gray-200 rounded-xl text-base focus:border-yellow-400 focus:ring-yellow-400/20"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 font-medium">{errors.confirmPassword.message}</p>
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
                  {t('auth.register.submitting')}
                </>
              ) : (
                t('auth.register.submitButton')
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              {t('auth.register.hasAccount')}{' '}
              <Link href={loginHref} className="text-black font-semibold hover:text-yellow-600 transition-colors">
                {t('common.login')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
