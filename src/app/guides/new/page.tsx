'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Link as LinkIcon,
  Upload,
  FileText,
  Loader2,
  Sparkles,
  X,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { publicService } from '@/services/public';
import { filesService } from '@/services/files';

type InputMode = 'url' | 'upload';

export default function NewGuidePage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<InputMode>('url');
  const [fileUrl, setFileUrl] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = mode === 'upload'
    ? [t('newGuide.steps.uploading'), t('newGuide.steps.extracting'), t('newGuide.steps.aiAnalysis'), t('newGuide.steps.generating')]
    : [t('newGuide.steps.connecting'), t('newGuide.steps.extracting'), t('newGuide.steps.aiAnalysis'), t('newGuide.steps.generating')];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 2500);
      return () => clearInterval(interval);
    } else {
      setLoadingStep(0);
    }
  }, [isLoading, loadingSteps.length]);

  const getErrorMessage = (error: unknown): string => {
    const msg = error instanceof Error ? error.message : '';
    const msgLower = msg.toLowerCase();

    if (msgLower.includes('extraction insuffisante') || msgLower.includes('0 mots')) {
      return `${t('errors.scannedPdf')}\n\n${t('errors.scannedPdfTip')}`;
    }
    if (msgLower.includes('ocr') || msgLower.includes('scanné') || msgLower.includes('scanned') || msgLower.includes('image')) {
      return t('errors.scannedPdf');
    }
    if (msgLower.includes('invalide') || msgLower.includes('corrompu') || msgLower.includes('invalid') || msgLower.includes('corrupted')) {
      return t('errors.invalidContent');
    }
    if (msgLower.includes('extraction') || msgLower.includes('extract')) {
      return t('errors.extractionFailed');
    }
    if (msgLower.includes('process') || msgLower.includes('traitement')) {
      return t('errors.processingFailed');
    }

    return msg || t('errors.genericError');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let analyzeUrl = fileUrl;

      // If upload mode, upload file first
      if (mode === 'upload' && selectedFile) {
        const uploadResult = await filesService.uploadPdf(selectedFile);
        analyzeUrl = uploadResult.fileUrl;
      }

      if (!analyzeUrl) {
        toast.error(t('home.form.urlError'));
        setIsLoading(false);
        return;
      }

      const result = await publicService.analyzeDocument(analyzeUrl, title || undefined, locale);
      toast.success(locale === 'fr' ? 'Document analysé avec succès !' : 'Document analyzed successfully!');
      router.push(`/preview/${result.sessionToken}`);
    } catch (err) {
      toast.error(getErrorMessage(err), { duration: 8000 });
      setIsLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error(locale === 'fr' ? 'Seuls les fichiers PDF sont acceptés' : 'Only PDF files are accepted');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(locale === 'fr' ? 'Le fichier ne doit pas dépasser 10 Mo' : 'File must be under 10 MB');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const canSubmit = mode === 'url' ? fileUrl.trim().length > 0 : selectedFile !== null;

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <nav className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">{t('newGuide.backToDashboard')}</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
            <span className="text-base font-semibold text-black hidden sm:block">{t('common.brandName')}</span>
          </Link>
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            {t('newGuide.title')}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            {t('newGuide.subtitle')}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 bg-white rounded-2xl shadow-sm">
            <CardContent className="p-6 sm:p-8">
              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setMode('url')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                    mode === 'url'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  {t('newGuide.tabUrl')}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('upload')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                    mode === 'upload'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {t('newGuide.tabUpload')}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* URL Input */}
                {mode === 'url' && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">URL</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="url"
                        placeholder={t('newGuide.urlPlaceholder')}
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                        className="pl-10 h-12 rounded-xl border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {/* File Upload */}
                {mode === 'upload' && (
                  <div>
                    {selectedFile ? (
                      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-green-800 truncate">{selectedFile.name}</p>
                          <p className="text-xs text-green-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                          isDragging
                            ? 'border-yellow-400 bg-yellow-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Upload className={`w-8 h-8 mx-auto mb-3 ${isDragging ? 'text-yellow-500' : 'text-gray-400'}`} />
                        <p className="text-sm font-medium text-gray-700 mb-1">{t('newGuide.dropzone')}</p>
                        <p className="text-xs text-gray-400 mb-2">{t('newGuide.dropzoneSub')}</p>
                        <p className="text-xs text-gray-300">{t('newGuide.maxSize')}</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                  </div>
                )}

                {/* Title (optional) */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    {t('newGuide.titleLabel')} <span className="text-gray-400 font-normal">{t('newGuide.titleOptional')}</span>
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={t('newGuide.titlePlaceholder')}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={!canSubmit || isLoading}
                  className="w-full h-13 sm:h-14 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl text-base disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{loadingSteps[loadingStep]}</span>
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      {t('newGuide.submit')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
