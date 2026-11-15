export interface OverviewCounters {
  machines: {
    total: number;
    published: number;
    unpublished: number;
  };
  celestialBodies: {
    total: number;
    published: number;
    unpublished: number;
  };
  logbook: {
    total: number;
    published: number;
    unpublished: number;
  };
  quizzes: {
    total: number;
    published: number;
    unpublished: number;
  };
}

export interface DashboardOverviewModel {
  counters: OverviewCounters;
  latestIngestion: {
    id: string;
    filename: string;
    status: string;
    createdAt: Date;
    finishedAt: Date | null;
  } | null;
  failedJobsCount: number;
  unpublishedContent: {
    machines: Array<{ id: string; slug: string; name: string }>;
    logbook: Array<{ id: string; slug: string; title: string }>;
  };
}
