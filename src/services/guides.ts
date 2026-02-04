import { api } from '@/lib/api';
import { Guide, GenerateGuideParams, GuideRating } from '@/types/guide';

export const guidesService = {
  async generateGuide(params: GenerateGuideParams): Promise<Guide> {
    const response = await api.post<Guide>('/guides/generate', params);
    return response.data!;
  },

  async getGuides(): Promise<Guide[]> {
    const response = await api.get<{ guides: Guide[] }>('/guides');
    return response.data!.guides;
  },

  async getGuide(id: string): Promise<Guide> {
    const response = await api.get<Guide>(`/guides/${id}`);
    return response.data!;
  },

  async rateGuide(params: GuideRating): Promise<void> {
    await api.post('/guides/rate', params);
  },
};
