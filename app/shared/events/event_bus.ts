import type { Prisma } from '@prisma/client';
import type { DomainEventMap } from './contracts.js';

type EventHandler<T> = (payload: T, tx: Prisma.TransactionClient) => Promise<void>;

class DomainEventBus {
  private handlers = new Map<keyof DomainEventMap, Set<EventHandler<any>>>();

  subscribe<K extends keyof DomainEventMap>(event: K, handler: EventHandler<DomainEventMap[K]>): () => void {
    let set = this.handlers.get(event);
    if (!set) {
      set = new Set();
      this.handlers.set(event, set);
    }
    set.add(handler);

    return () => {
      set?.delete(handler);
    };
  }

  async emit<K extends keyof DomainEventMap>(
    event: K,
    payload: DomainEventMap[K],
    tx: Prisma.TransactionClient
  ): Promise<void> {
    const set = this.handlers.get(event);
    if (!set || set.size === 0) return;

    for (const handler of set) {
      await handler(payload, tx);
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}

export const eventBus = new DomainEventBus();
