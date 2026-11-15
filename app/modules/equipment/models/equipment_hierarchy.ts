import { EquipmentCycleException } from '../exceptions/equipment_cycle_exception.js';

export class EquipmentHierarchy {
  static assertNoSelfParent(equipmentId: string, parentEquipmentId: string | null | undefined): void {
    if (parentEquipmentId && equipmentId === parentEquipmentId) {
      throw new EquipmentCycleException(`Equipment '${equipmentId}' cannot be its own parent.`);
    }
  }

  static async assertNoCycle(
    equipmentId: string,
    proposedParentId: string | null | undefined,
    getParentFn: (id: string) => Promise<string | null>
  ): Promise<void> {
    if (!proposedParentId) return;

    this.assertNoSelfParent(equipmentId, proposedParentId);

    const visited = new Set<string>([equipmentId]);
    let currentId: string | null = proposedParentId;

    while (currentId) {
      if (visited.has(currentId)) {
        throw new EquipmentCycleException(
          `Cycle detected in equipment hierarchy: '${equipmentId}' already exists in parent ancestor chain.`
        );
      }
      visited.add(currentId);
      currentId = await getParentFn(currentId);
    }
  }
}
