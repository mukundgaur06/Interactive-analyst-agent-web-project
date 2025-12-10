export enum Feature {
  SUMMARIZER = 'SUMMARIZER',
  INTERPRETER = 'INTERPRETER',
  STORYTELLER = 'STORYTELLER',
}

export enum Tone {
  NEUTRAL = 'Neutral',
  URGENT = 'Urgent',
  OPTIMISTIC = 'Optimistic',
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface AIResponse {
  markdown: string;
  chartData?: ChartDataPoint[];
  chartType?: 'bar' | 'line' | 'pie';
  chartTitle?: string;
}

export interface ProcessingState {
  isLoading: boolean;
  error: string | null;
  result: AIResponse | null;
}

export interface FileInputData {
  base64: string;
  mimeType: string;
  name: string;
}