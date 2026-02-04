import { api } from '@/lib/api';
import { UploadResult } from '@/types/files';

export const filesService = {
  async uploadPdf(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.postFormData<UploadResult>('/files/pdf', formData);
    return response.data!;
  },

  async uploadFromUrl(pdfUrl: string): Promise<UploadResult> {
    const response = await api.post<UploadResult>('/files/pdf', { pdfUrl });
    return response.data!;
  },
};
