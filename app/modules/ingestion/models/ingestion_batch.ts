import type { IngestionStatus, MachineKind, MachineState, MediaLabel, QuizLevel } from '#shared/enums';

export interface IngestionRejectionDetail {
  file?: string;
  field?: string;
  issue: string;
  code?: string;
}

export interface IngestionReport {
  status: IngestionStatus;
  summary: {
    machinesCount: number;
    quizzesCount: number;
    imagesCount: number;
  };
  errors: IngestionRejectionDetail[];
  warnings: string[];
  processedAt: string;
}

export interface IngestionBatchDto {
  id: string;
  requestedById: string | null;
  filename: string;
  sizeBytes: number;
  sha256: string;
  status: IngestionStatus;
  rejectCode: string | null;
  rejectReason: string | null;
  report: IngestionReport | null;
  createdAt: Date;
  finishedAt: Date | null;
}

// Bundle JSON shapes
export interface BundleManifest {
  schemaVersion: number;
  machines: string[];
  quizzes?: string[];
}

export interface BundleSource {
  key: string;
  title: string;
  publisher: string;
  url: string;
}

export interface BundleFact {
  label: string;
  value: string;
  unit?: string | null;
  sourceKey: string;
  sortOrder?: number;
}

export interface BundleEvent {
  dateLabel: string;
  dateIso?: string | null;
  title: string;
  description: string;
  sourceKey: string;
  sortOrder?: number;
}

export interface BundleImage {
  filename: string;
  alt: string;
  label: MediaLabel;
  credit: string;
  sourceUrl?: string | null;
  isCover?: boolean;
  sortOrder?: number;
}

export interface BundleMachine {
  body: string;
  name: string;
  kind: MachineKind;
  state: MachineState;
  stateSince?: string | null;
  launchYear?: number | null;
  arrivalYear?: number | null;
  summary: string;
  description: string;
  missionPurpose: string;
  howItWorked: string;
  discoveries: string;
  currentStatusNote?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isPublished?: boolean;
  sources: BundleSource[];
  facts: BundleFact[];
  timeline: BundleEvent[];
  images: BundleImage[];
}

export interface BundleQuizOption {
  label: string;
  isCorrect: boolean;
  sortOrder?: number;
}

export interface BundleQuizQuestion {
  prompt: string;
  explanation: string;
  sortOrder?: number;
  options: BundleQuizOption[];
}

export interface BundleQuiz {
  title: string;
  level: QuizLevel;
  body?: string | null;
  machine?: string | null;
  isPublished?: boolean;
  questions: BundleQuizQuestion[];
}

export interface ValidatedBundle {
  manifest: BundleManifest;
  machines: Array<{
    slug: string;
    data: BundleMachine;
    bodyId: string;
    imageBuffers: Array<{
      filename: string;
      buffer: Buffer;
      meta: {
        alt: string;
        label: MediaLabel;
        credit: string;
        sourceUrl?: string | null;
        width: number;
        height: number;
        isCover?: boolean;
        sortOrder?: number;
      };
    }>;
  }>;
  quizzes: Array<{
    slug: string;
    data: BundleQuiz;
    bodyId?: string | null;
    machineId?: string | null;
  }>;
}
