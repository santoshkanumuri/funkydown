export enum ViewMode {
  SPLIT = 'SPLIT',
  EDIT = 'EDIT',
  PREVIEW = 'PREVIEW'
}

export interface EnhanceOptions {
  type: 'grammar' | 'funky' | 'summarize' | 'professional';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}