export interface VisitorMergedEvent {
  fromId: string;
  toId: string;
}

export interface VisitorDeletedEvent {
  id: string;
}

export interface DomainEventMap {
  VisitorMerged: VisitorMergedEvent;
  VisitorDeleted: VisitorDeletedEvent;
}
