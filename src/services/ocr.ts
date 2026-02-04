import { api } from '@/lib/api';
import { OcrResult } from '@/types/ocr';

export const ocrService = {
  async processOcr(fileUrl: string): Promise<OcrResult> {
    const response = await api.post<OcrResult>('/ocr', { fileUrl });
    return response.data!;
  },
};
