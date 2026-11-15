export const AccountRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;
export type AccountRole = (typeof AccountRole)[keyof typeof AccountRole];

export const UserRole = AccountRole;
export type UserRole = AccountRole;

export const MachineKind = {
  LANDER: 'LANDER',
  ROVER: 'ROVER',
  HELICOPTER: 'HELICOPTER',
  LANDING_CRAFT_STAGE: 'LANDING_CRAFT_STAGE',
  INSTRUMENT: 'INSTRUMENT',
  ORBITER: 'ORBITER',
  OTHER: 'OTHER',
} as const;
export type MachineKind = (typeof MachineKind)[keyof typeof MachineKind];

export const MachineState = {
  STILL_ACTIVE: 'STILL_ACTIVE',
  STOPPED_ANSWERING: 'STOPPED_ANSWERING',
  JOB_FINISHED: 'JOB_FINISHED',
  LEFT_ON_PURPOSE: 'LEFT_ON_PURPOSE',
  UNKNOWN: 'UNKNOWN',
} as const;
export type MachineState = (typeof MachineState)[keyof typeof MachineState];

export const MediaLabel = {
  REAL_PHOTO: 'REAL_PHOTO',
  RECONSTRUCTION: 'RECONSTRUCTION',
  AI_ILLUSTRATION: 'AI_ILLUSTRATION',
  DATA_CHART: 'DATA_CHART',
} as const;
export type MediaLabel = (typeof MediaLabel)[keyof typeof MediaLabel];

export const ContentOrigin = {
  AUTHORED: 'AUTHORED',
  GENERATED: 'GENERATED',
} as const;
export type ContentOrigin = (typeof ContentOrigin)[keyof typeof ContentOrigin];

export const GenerationKind = {
  VIDEO: 'VIDEO',
  ARTICLE: 'ARTICLE',
} as const;
export type GenerationKind = (typeof GenerationKind)[keyof typeof GenerationKind];

export const GenerationStatus = {
  QUEUED: 'QUEUED',
  RUNNING: 'RUNNING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
} as const;
export type GenerationStatus = (typeof GenerationStatus)[keyof typeof GenerationStatus];

export const QuizLevel = {
  EXPLORER: 'EXPLORER',
  EXPERT: 'EXPERT',
} as const;
export type QuizLevel = (typeof QuizLevel)[keyof typeof QuizLevel];

export const BadgeRule = {
  QUIZ_COMPLETED_COUNT: 'QUIZ_COMPLETED_COUNT',
  PERFECT_SCORE_COUNT: 'PERFECT_SCORE_COUNT',
  BODY_ALL_QUIZZES: 'BODY_ALL_QUIZZES',
} as const;
export type BadgeRule = (typeof BadgeRule)[keyof typeof BadgeRule];

export const IngestionStatus = {
  RECEIVED: 'RECEIVED',
  VALIDATED: 'VALIDATED',
  REJECTED: 'REJECTED',
  COMMITTED: 'COMMITTED',
  FAILED: 'FAILED',
} as const;
export type IngestionStatus = (typeof IngestionStatus)[keyof typeof IngestionStatus];
