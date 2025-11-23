export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64Data: string; // Raw base64 without prefix
  mimeType: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GenerationResult {
  imageUrl: string;
}
