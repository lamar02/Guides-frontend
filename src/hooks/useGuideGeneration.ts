'use client';

import { useState } from 'react';
import { guidesService } from '@/services/guides';
import { filesService } from '@/services/files';
import { Guide, GenerateGuideParams } from '@/types/guide';

interface GenerationState {
  step: 'idle' | 'uploading' | 'generating' | 'complete' | 'error';
  progress: number;
  guide: Guide | null;
  error: string | null;
}

export function useGuideGeneration() {
  const [state, setState] = useState<GenerationState>({
    step: 'idle',
    progress: 0,
    guide: null,
    error: null,
  });

  const generateGuideFromFile = async (
    file: File,
    params: Omit<GenerateGuideParams, 'fileUrl'>
  ) => {
    setState({ step: 'uploading', progress: 20, guide: null, error: null });

    try {
      // 1. Upload du fichier
      const uploadResult = await filesService.uploadPdf(file);
      setState((prev) => ({ ...prev, progress: 50 }));

      // 2. Génération du guide
      setState((prev) => ({ ...prev, step: 'generating', progress: 70 }));
      const guide = await guidesService.generateGuide({
        ...params,
        fileUrl: uploadResult.fileUrl,
      });

      setState({ step: 'complete', progress: 100, guide, error: null });
      return guide;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      setState({ step: 'error', progress: 0, guide: null, error: message });
      throw error;
    }
  };

  const generateGuideFromUrl = async (params: GenerateGuideParams) => {
    setState({ step: 'generating', progress: 50, guide: null, error: null });

    try {
      const guide = await guidesService.generateGuide(params);
      setState({ step: 'complete', progress: 100, guide, error: null });
      return guide;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      setState({ step: 'error', progress: 0, guide: null, error: message });
      throw error;
    }
  };

  const reset = () => {
    setState({ step: 'idle', progress: 0, guide: null, error: null });
  };

  return { ...state, generateGuideFromFile, generateGuideFromUrl, reset };
}
