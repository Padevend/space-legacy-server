import type { MachineKind, MachineState, MediaLabel } from '#shared/enums';

export interface MachineSourceModel {
  id: string;
  machineId: string;
  title: string;
  publisher: string;
  url: string;
}

export interface MachineFactModel {
  id: string;
  machineId: string;
  label: string;
  value: string;
  unit: string | null;
  sourceId: string;
  sortOrder: number;
  source?: MachineSourceModel | undefined;
}

export interface MachineEventModel {
  id: string;
  machineId: string;
  dateLabel: string;
  dateIso: Date | null;
  title: string;
  description: string;
  sourceId: string;
  sortOrder: number;
  source?: MachineSourceModel | undefined;
}

export interface MachineImageModel {
  id: string;
  machineId: string;
  path: string;
  alt: string;
  label: MediaLabel;
  credit: string;
  sourceUrl: string | null;
  width: number;
  height: number;
  isCover: boolean;
  sortOrder: number;
}

export interface MachineSummaryModel {
  id: string;
  slug: string;
  bodyId: string;
  bodySlug: string;
  bodyName: string;
  name: string;
  kind: MachineKind;
  state: MachineState;
  stateSince: string | null;
  launchYear: number | null;
  arrivalYear: number | null;
  summary: string;
  coverImage: MachineImageModel | null;
}

export interface MachineDetailModel {
  id: string;
  slug: string;
  bodyId: string;
  body: {
    id: string;
    slug: string;
    name: string;
  };
  name: string;
  kind: MachineKind;
  state: MachineState;
  stateSince: string | null;
  launchYear: number | null;
  arrivalYear: number | null;
  summary: string;
  description: string;
  missionPurpose: string;
  howItWorked: string;
  discoveries: string;
  currentStatusNote: string | null;
  latitude: number | null;
  longitude: number | null;
  sources: MachineSourceModel[];
  facts: MachineFactModel[];
  events: MachineEventModel[];
  images: MachineImageModel[];
}
