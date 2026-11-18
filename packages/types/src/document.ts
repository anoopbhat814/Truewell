export interface Document {
  id: string;
  patientId: string;
  title: string;
  category: string;
  storageKey: string;
  uploadedAt: string;
}

export interface DocumentInput {
  patientId: string;
  title: string;
  category: string;
  storageKey: string;
}

export type DocumentPatch = Partial<DocumentInput>;
