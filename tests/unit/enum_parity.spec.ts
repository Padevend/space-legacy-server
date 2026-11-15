import { describe, it, expect } from 'vitest';
import * as PrismaClientPkg from '@prisma/client';
import * as DomainEnums from '#shared/enums';

describe('Enum Parity Test (Section 2.4 & 2.10)', () => {
  const enumsToCheck = [
    'MissionStatus',
    'EquipmentType',
    'OperationalStatus',
    'PhysicalStatus',
    'EventType',
    'DatePrecision',
    'CelestialBodyType',
    'LocationType',
    'SourceType',
    'StoryType',
    'PublicationStatus',
    'UserRole',
    'IngestionStatus',
  ];

  for (const enumName of enumsToCheck) {
    it(`ensures domain enum ${enumName} matches Prisma enum values exactly`, () => {
      const prismaEnum = (PrismaClientPkg as Record<string, any>)[enumName];
      const domainEnum = (DomainEnums as Record<string, any>)[enumName];

      expect(prismaEnum, `Prisma must define enum ${enumName}`).toBeDefined();
      expect(domainEnum, `Domain enums must define ${enumName}`).toBeDefined();

      const prismaValues = Object.values(prismaEnum).sort();
      const domainValues = Object.values(domainEnum).sort();

      expect(domainValues).toEqual(prismaValues);
    });
  }
});
