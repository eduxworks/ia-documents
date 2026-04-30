export interface Document {
  _id?: string;
  filename: string;
  key: string;
  bucket: string;
  mimetype: string;
  size: number;
  uploadedAt: Date;
  metadata: Record<string, string>;
  tags: string[];
}

export interface UploadResponse {
  success: boolean;
  error?: string;
  document?: Document;
}

export interface DocumentsResponse {
  success: boolean;
  error?: string;
  documents?: Document[];
}
