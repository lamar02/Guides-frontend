import { api } from '@/lib/api';
import { Questionnaire } from '@/types/questionnaire';

export const questionnaireService = {
  async getQuestionnaire(category?: string): Promise<Questionnaire> {
    const endpoint = category
      ? `/questionnaire?category=${encodeURIComponent(category)}`
      : '/questionnaire';
    const response = await api.get<Questionnaire>(endpoint);
    return response.data!;
  },
};
