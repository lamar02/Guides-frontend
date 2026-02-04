export interface Question {
  id: string;
  question: string;
  type: 'select' | 'text' | 'multiselect';
  options?: string[];
  required: boolean;
}

export interface Questionnaire {
  category: string;
  description: string;
  questions: Question[];
  availableCategories: string[];
}

export type QuestionnaireAnswers = Record<string, string | string[]>;
