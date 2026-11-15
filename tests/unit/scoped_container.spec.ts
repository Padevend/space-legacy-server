import { describe, it, expect } from 'vitest';
import { Container } from '#infrastructure/container/container';

describe('Scoped Module Container (Section 2.4 & 2.10)', () => {
  it('allows module containers to resolve shared infrastructure tokens', () => {
    const root = new Container();
    root.singleton('database', () => ({ connected: true }));

    const mod = root.forModule('equipment');
    expect(mod.make('database')).toEqual({ connected: true });
  });

  it('allows module container to bind and resolve its own token', () => {
    const root = new Container();
    const mod = root.forModule('equipment');
    mod.bind('EquipmentService', () => ({ name: 'equipment_service' }));

    expect(mod.make('EquipmentService')).toEqual({ name: 'equipment_service' });
  });

  it('throws an isolation error when a module container resolves a token owned by another module', () => {
    const root = new Container();
    const missions = root.forModule('missions');
    missions.bind('MissionService', () => ({ name: 'mission_service' }));

    const equipment = root.forModule('equipment');
    expect(() => equipment.make('MissionService')).toThrowError(
      /Isolation violation: Module 'equipment' cannot resolve foreign token 'MissionService' owned by module 'missions'/
    );
  });
});
