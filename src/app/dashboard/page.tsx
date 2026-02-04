'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  BookOpen,
  Lock,
  CheckCircle,
  Calendar,
  Loader2,
  Sparkles,
  LogOut,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { guidesService } from '@/services/guides';
import { Guide } from '@/types/guide';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadGuides = async () => {
      if (isAuthenticated) {
        try {
          const data = await guidesService.getGuides();
          setGuides(data);
        } catch (error) {
          console.error('Error loading guides:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadGuides();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
      </div>
    );
  }

  const completedGuides = guides.filter((g) => g.hasFullAccess).length;
  const previewGuides = guides.filter((g) => !g.hasFullAccess).length;
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black rounded-lg sm:rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            </div>
            <span className="text-base sm:text-lg font-semibold text-black hidden sm:block">{t('common.brandName')}</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher variant="minimal" />

            <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-full px-3 sm:px-5 font-medium text-sm sm:text-base">
              <Link href="/">
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{t('dashboard.newGuide')}</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-black text-white font-semibold">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-black">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 rounded-lg cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('common.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2 sm:mb-3">
            {t('dashboard.welcome')}{user?.email ? `, ${user.email.split('@')[0]}` : ''}
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">
            {t('dashboard.subtitle')}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 sm:mb-12"
        >
          {[
            { icon: BookOpen, label: t('dashboard.stats.total'), value: guides.length, color: 'bg-gray-100', iconColor: 'text-gray-700' },
            { icon: CheckCircle, label: t('dashboard.stats.complete'), value: completedGuides, color: 'bg-green-100', iconColor: 'text-green-600' },
            { icon: Lock, label: t('dashboard.stats.preview'), value: previewGuides, color: 'bg-amber-100', iconColor: 'text-amber-600' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 bg-white rounded-xl sm:rounded-2xl shadow-sm">
              <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-5">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${stat.iconColor}`} />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black">{stat.value}</p>
                  <p className="text-gray-500 text-xs sm:text-sm md:text-base">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Guides */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-black">{t('dashboard.myGuides')}</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 sm:h-48 rounded-xl sm:rounded-2xl" />
            ))}
          </div>
        ) : guides.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-0 bg-white rounded-2xl sm:rounded-3xl shadow-sm">
              <CardContent className="py-12 sm:py-20 px-4 sm:px-6 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-black mb-2 sm:mb-3">
                  {t('dashboard.noGuides')}
                </h2>
                <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">
                  {t('dashboard.noGuidesDescription')}
                </p>
                <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl h-11 sm:h-12 px-5 sm:px-6 font-medium text-sm sm:text-base">
                  <Link href="/">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {t('dashboard.analyzeFirst')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {guides.map((guide) => (
                <motion.div key={guide.id} variants={itemVariants}>
                  <Link href={`/guides/${guide.id}`}>
                    <Card className="h-full border-0 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                            {guide.productCategory || 'Guide'}
                          </span>
                          {guide.hasFullAccess ? (
                            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full text-xs font-medium text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              {t('dashboard.complete')}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 rounded-full text-xs font-medium text-amber-700">
                              <Lock className="w-3 h-3" />
                              {t('dashboard.previewBadge')}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-yellow-600 transition-colors line-clamp-2">
                          {guide.title || guide.productName}
                        </h3>

                        <p className="text-gray-500 text-sm mb-6 line-clamp-1">
                          {guide.productName}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(guide.createdAt).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                          <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {t('dashboard.open')}
                            <ArrowUpRight className="w-4 h-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}
