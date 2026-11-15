import type { ArchiveModel } from '../models/archive.js';
import type { ArchiveDto } from '../validators/archive.js';
import type { ArchiveMissionModel } from '../models/archive_mission.js';
import type { ArchiveEquipmentModel } from '../models/archive_equipment.js';
import type { ArchiveEventModel } from '../models/archive_event.js';
import type { ArchiveSourceModel } from '../models/archive_source.js';

export class ArchiveSerializer {
  serializeArchive(archive: ArchiveModel): ArchiveDto {
    return {
      archiveId: archive.archiveId,
      externalId: archive.externalId,
      archiveTitle: archive.archiveTitle,
      archiveProvider: archive.archiveProvider,
      originalUrl: archive.originalUrl,
      rawContent: archive.rawContent,
      retrievedAt: archive.retrievedAt.toISOString(),
      archiveVersion: archive.archiveVersion ?? null,
      contentHash: archive.contentHash ?? null,
    };
  }

  serializeArchiveMission(link: ArchiveMissionModel) {
    return {
      archiveId: link.archiveId,
      missionId: link.missionId,
      sectionName: link.sectionName,
    };
  }

  serializeArchiveEquipment(link: ArchiveEquipmentModel) {
    return {
      archiveId: link.archiveId,
      equipmentId: link.equipmentId,
      sectionName: link.sectionName,
      extractedReference: link.extractedReference,
    };
  }

  serializeArchiveEvent(link: ArchiveEventModel) {
    return {
      archiveId: link.archiveId,
      eventId: link.eventId,
      sectionName: link.sectionName,
      extractedReference: link.extractedReference,
    };
  }

  serializeArchiveSource(link: ArchiveSourceModel) {
    return {
      archiveId: link.archiveId,
      sourceId: link.sourceId,
      referenceContext: link.referenceContext,
    };
  }
}

export const archiveSerializer = new ArchiveSerializer();
