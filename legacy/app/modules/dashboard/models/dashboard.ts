export interface DashboardStatsModel {
  counts: {
    equipment: number;
    missions: number;
    events: number;
    stories: number;
    media: number;
    sources: number;
    users: number;
  };
  storiesByStatus: {
    draft: number;
    review: number;
    published: number;
    archived: number;
  };
  mediaAiCount: number;
}
