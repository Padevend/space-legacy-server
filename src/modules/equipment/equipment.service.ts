import { equipmentRepository, type EquipmentRepository } from './equipment.repository.js';
import { missionsRepository, type MissionsRepository } from '../missions/missions.repository.js';
import { AppException } from '../../core/exceptions/AppException.js';
import type {
  ListEquipmentQueryDto,
  CreateEquipmentRequestDto,
  UpdateEquipmentRequestDto,
} from './equipment.schemas.js';
import type { Equipment, DatePrecision } from '@prisma/client';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_INCLUDES = ['parent', 'children', 'missions', 'locations'];

export interface AuditContext {
  actorId?: string | undefined;
  requestId?: string | undefined;
}

export class EquipmentService {
  constructor(
    private readonly repository: EquipmentRepository = equipmentRepository,
    private readonly missionsRepo: MissionsRepository = missionsRepository
  ) {}

  async list(query: ListEquipmentQueryDto): Promise<{ equipment: Equipment[]; total: number }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const listParams = {
      skip,
      take: pageSize,
      search: query.search,
      equipmentType: query.equipmentType,
      operationalStatus: query.operationalStatus,
      physicalStatus: query.physicalStatus,
      missionId: query.missionId,
      celestialBodyId: query.celestialBodyId,
      parentEquipmentId: query.parentEquipmentId,
      orderByField: (query.orderBy ?? 'name') as 'name' | 'equipmentType' | 'createdAt' | 'updatedAt',
      orderDirection: (query.order ?? 'asc') as 'asc' | 'desc',
    };

    const [equipment, total] = await Promise.all([
      this.repository.findMany(listParams),
      this.repository.count(listParams),
    ]);

    return { equipment, total };
  }

  async getByIdOrSlug(idOrSlug: string, includeParam?: string) {
    const isUuid = UUID_REGEX.test(idOrSlug);

    const includes = {
      parent: false,
      children: false,
      missions: false,
      locations: false,
    };

    if (includeParam) {
      const parts = includeParam.split(',').map((p) => p.trim());
      if (parts.length > 3) {
        throw AppException.unprocessable('Maximum of 3 include relations allowed.');
      }

      for (const part of parts) {
        if (part.includes('.')) {
          throw AppException.unprocessable('Nested includes deeper than one level are not supported.');
        }
        if (!ALLOWED_INCLUDES.includes(part)) {
          throw AppException.unprocessable(`Invalid include relation: '${part}'. Allowed: ${ALLOWED_INCLUDES.join(', ')}`);
        }
        if (part === 'parent') includes.parent = true;
        if (part === 'children') includes.children = true;
        if (part === 'missions') includes.missions = true;
        if (part === 'locations') includes.locations = true;
      }
    }

    const item = await this.repository.findByIdOrSlugWithIncludes(idOrSlug, isUuid, includes);
    if (!item) {
      throw AppException.notFound(`Equipment '${idOrSlug}' not found.`);
    }

    return item;
  }

  async getById(equipmentId: string): Promise<Equipment> {
    const item = await this.repository.findById(equipmentId);
    if (!item) {
      throw AppException.notFound(`Equipment with ID '${equipmentId}' not found.`);
    }
    return item;
  }

  private async assertNoHierarchyCycle(equipmentId: string, proposedParentId: string | null | undefined): Promise<void> {
    if (!proposedParentId) return;

    if (proposedParentId === equipmentId) {
      throw AppException.unprocessable('Equipment cannot be its own parent.');
    }

    // Traverse ancestors of proposedParentId to check if equipmentId is among them
    let currentId: string | null = proposedParentId;
    let depth = 0;

    while (currentId && depth < 50) {
      if (currentId === equipmentId) {
        throw AppException.unprocessable('Hierarchy cycle detected: equipment cannot be an ancestor of its parent.');
      }
      const parent = await this.repository.findById(currentId);
      if (!parent) {
        throw AppException.unprocessable(`Parent equipment '${currentId}' not found.`);
      }
      currentId = parent.parentEquipmentId;
      depth++;
    }
  }

  async create(data: CreateEquipmentRequestDto, ctx: AuditContext): Promise<Equipment> {
    const existingSlug = await this.repository.findBySlug(data.slug);
    if (existingSlug) {
      throw AppException.conflict(`Equipment with slug '${data.slug}' already exists.`);
    }

    if (data.parentEquipmentId) {
      const parent = await this.repository.findById(data.parentEquipmentId);
      if (!parent) {
        throw AppException.notFound(`Parent equipment '${data.parentEquipmentId}' not found.`);
      }
    }

    const created = await this.repository.create(data);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'CREATE',
      entity: 'Equipment',
      entityId: created.equipmentId,
      requestId: ctx.requestId,
      diffSummary: { slug: created.slug, name: created.name },
    });

    return created;
  }

  async update(equipmentId: string, data: UpdateEquipmentRequestDto, ctx: AuditContext): Promise<Equipment> {
    const existing = await this.getById(equipmentId);

    if (data.slug && data.slug !== existing.slug) {
      const slugOwner = await this.repository.findBySlug(data.slug);
      if (slugOwner && slugOwner.equipmentId !== equipmentId) {
        throw AppException.conflict(`Equipment with slug '${data.slug}' already exists.`);
      }
    }

    if (data.parentEquipmentId !== undefined && data.parentEquipmentId !== existing.parentEquipmentId) {
      await this.assertNoHierarchyCycle(equipmentId, data.parentEquipmentId);
    }

    const updated = await this.repository.update(equipmentId, data);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'UPDATE',
      entity: 'Equipment',
      entityId: updated.equipmentId,
      requestId: ctx.requestId,
      diffSummary: { updatedFields: Object.keys(data) },
    });

    return updated;
  }

  async delete(equipmentId: string, ctx: AuditContext): Promise<Equipment> {
    const existing = await this.getById(equipmentId);

    try {
      const deleted = await this.repository.delete(equipmentId);

      await this.repository.createAuditLog({
        actorId: ctx.actorId,
        action: 'DELETE',
        entity: 'Equipment',
        entityId: existing.equipmentId,
        requestId: ctx.requestId,
        diffSummary: { slug: existing.slug, name: existing.name },
      });

      return deleted;
    } catch (err: unknown) {
      if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P2003') {
        throw AppException.conflict('Cannot delete equipment with active child equipment, events, or measurements.');
      }
      throw err;
    }
  }

  // Sub-resources
  async getChildren(idOrSlug: string) {
    const item = await this.getByIdOrSlug(idOrSlug);
    return this.repository.findChildren(item.equipmentId);
  }

  async getEvents(idOrSlug: string) {
    const item = await this.getByIdOrSlug(idOrSlug);
    return this.repository.findEvents(item.equipmentId);
  }

  async getLocations(idOrSlug: string) {
    const item = await this.getByIdOrSlug(idOrSlug);
    return this.repository.findLocations(item.equipmentId);
  }

  async getMeasurements(idOrSlug: string) {
    const item = await this.getByIdOrSlug(idOrSlug);
    return this.repository.findMeasurements(item.equipmentId);
  }

  async getMedia(idOrSlug: string) {
    const item = await this.getByIdOrSlug(idOrSlug);
    return this.repository.findMedia(item.equipmentId);
  }

  async getSources(idOrSlug: string) {
    const item = await this.getByIdOrSlug(idOrSlug);
    return this.repository.findSources(item.equipmentId);
  }

  // Relations
  async linkMission(
    equipmentId: string,
    missionId: string,
    missionRole: string,
    participationDescription?: string | null,
    ctx: AuditContext = {}
  ) {
    await this.getById(equipmentId);
    return this.missionsRepo.linkEquipment(missionId, equipmentId, missionRole, participationDescription);
  }

  async unlinkMission(equipmentId: string, missionId: string, ctx: AuditContext = {}) {
    await this.getById(equipmentId);
    return this.missionsRepo.unlinkEquipment(missionId, equipmentId);
  }

  async linkLocation(
    equipmentId: string,
    locationId: string,
    startDate?: string | null,
    endDate?: string | null,
    locationPrecision: DatePrecision = 'UNKNOWN',
    ctx: AuditContext = {}
  ) {
    await this.getById(equipmentId);

    const sDate = startDate ? new Date(startDate) : null;
    const eDate = endDate ? new Date(endDate) : null;

    const link = await this.repository.linkLocation(
      equipmentId,
      locationId,
      sDate,
      eDate,
      locationPrecision
    );

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'LINK_LOCATION',
      entity: 'EquipmentLocation',
      entityId: link.equipmentLocationId,
      requestId: ctx.requestId,
      diffSummary: { locationId, startDate, endDate },
    });

    return link;
  }

  async unlinkLocation(equipmentLocationId: string, ctx: AuditContext = {}) {
    try {
      await this.repository.unlinkLocation(equipmentLocationId);
      await this.repository.createAuditLog({
        actorId: ctx.actorId,
        action: 'UNLINK_LOCATION',
        entity: 'EquipmentLocation',
        entityId: equipmentLocationId,
        requestId: ctx.requestId,
      });
    } catch {
      throw AppException.notFound(`Equipment location '${equipmentLocationId}' not found.`);
    }
  }

  async linkPerson(equipmentId: string, personId: string, roleInEquipment: string, ctx: AuditContext = {}) {
    await this.getById(equipmentId);

    const link = await this.repository.linkPerson(equipmentId, personId, roleInEquipment);
    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'LINK_PERSON',
      entity: 'EquipmentPerson',
      entityId: `${equipmentId}:${personId}`,
      requestId: ctx.requestId,
      diffSummary: { roleInEquipment },
    });
    return link;
  }

  async unlinkPerson(equipmentId: string, personId: string, ctx: AuditContext = {}) {
    await this.getById(equipmentId);

    try {
      await this.repository.unlinkPerson(equipmentId, personId);
      await this.repository.createAuditLog({
        actorId: ctx.actorId,
        action: 'UNLINK_PERSON',
        entity: 'EquipmentPerson',
        entityId: `${equipmentId}:${personId}`,
        requestId: ctx.requestId,
      });
    } catch {
      throw AppException.notFound(`Link between equipment '${equipmentId}' and person '${personId}' not found.`);
    }
  }

  async linkSource(
    equipmentId: string,
    sourceId: string,
    claimDescription?: string | null,
    ctx: AuditContext = {}
  ) {
    await this.getById(equipmentId);

    const link = await this.repository.linkSource(equipmentId, sourceId, claimDescription);
    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'LINK_SOURCE',
      entity: 'EquipmentSource',
      entityId: `${equipmentId}:${sourceId}`,
      requestId: ctx.requestId,
      diffSummary: { claimDescription: claimDescription ?? null },
    });
    return link;
  }

  async unlinkSource(equipmentId: string, sourceId: string, ctx: AuditContext = {}) {
    await this.getById(equipmentId);

    try {
      await this.repository.unlinkSource(equipmentId, sourceId);
      await this.repository.createAuditLog({
        actorId: ctx.actorId,
        action: 'UNLINK_SOURCE',
        entity: 'EquipmentSource',
        entityId: `${equipmentId}:${sourceId}`,
        requestId: ctx.requestId,
      });
    } catch {
      throw AppException.notFound(`Link between equipment '${equipmentId}' and source '${sourceId}' not found.`);
    }
  }
}

export const equipmentService = new EquipmentService();
