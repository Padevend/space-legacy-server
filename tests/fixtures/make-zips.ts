import AdmZip from 'adm-zip';
import type { BundleManifest, BundleMachine, BundleQuiz } from '../../app/modules/ingestion/models/ingestion_batch.js';

// Minimal 1x1 valid PNG
export const MINIMAL_PNG = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00,
  0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0a, 0x49,
  0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00,
  0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

export function makeValidMachine(overrides: Partial<BundleMachine> = {}): BundleMachine {
  return {
    body: 'moon',
    name: 'Surveyor 3',
    kind: 'LANDER',
    state: 'JOB_FINISHED',
    stateSince: '1967-05-04',
    launchYear: 1967,
    arrivalYear: 1967,
    summary: 'Third lunar lander of the Surveyor program, visited in 1969 by Apollo 12.',
    description: 'Surveyor 3 soft-landed inside a crater in Oceanus Procellarum on April 20, 1967.',
    missionPurpose: 'Demonstrate soft landings, photograph lunar terrain and sample regolith with a surface scoop.',
    howItWorked: 'Three throttleable vernier engines and radar altimeter controlled touchdown.',
    discoveries: 'Scooped lunar soil and returned 6,315 television pictures of the surface.',
    latitude: -3.015,
    longitude: -23.418,
    isPublished: true,
    sources: [
      {
        key: 'src-1',
        title: 'NASA Space Science Data Coordinated Archive: Surveyor 3',
        publisher: 'NASA / NSSDC',
        url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A',
      },
    ],
    facts: [
      {
        label: 'Landed Mass',
        value: '296.0',
        unit: 'kg',
        sourceKey: 'src-1',
        sortOrder: 1,
      },
    ],
    timeline: [
      {
        dateLabel: 'April 17, 1967',
        dateIso: '1967-04-17T07:13:00.000Z',
        title: 'Launch from Cape Kennedy',
        description: 'Launched aboard an Atlas-Centaur rocket into a lunar transfer trajectory.',
        sourceKey: 'src-1',
        sortOrder: 1,
      },
    ],
    images: [
      {
        filename: 'surveyor3.png',
        alt: 'Surveyor 3 robotic spacecraft on lunar surface',
        label: 'REAL_PHOTO',
        credit: 'NASA',
        sourceUrl: 'https://images.nasa.gov/details/AS12-48-7133',
        isCover: true,
        sortOrder: 1,
      },
    ],
    ...overrides,
  };
}

export function makeValidQuiz(overrides: Partial<BundleQuiz> = {}): BundleQuiz {
  return {
    title: 'Surveyor 3 Lunar Pioneer Quiz',
    level: 'EXPLORER',
    body: 'moon',
    machine: 'surveyor-3',
    isPublished: true,
    questions: [
      {
        prompt: 'Which Apollo mission landed next to Surveyor 3 and retrieved parts of it?',
        explanation: 'Apollo 12 made a precision touchdown within walking distance of Surveyor 3 in November 1969.',
        sortOrder: 1,
        options: [
          { label: 'Apollo 11', isCorrect: false, sortOrder: 1 },
          { label: 'Apollo 12', isCorrect: true, sortOrder: 2 },
          { label: 'Apollo 13', isCorrect: false, sortOrder: 3 },
        ],
      },
    ],
    ...overrides,
  };
}

export function makeValidTemplateZip(): Buffer {
  const zip = new AdmZip();
  const manifest: BundleManifest = {
    schemaVersion: 1,
    machines: ['surveyor-3'],
    quizzes: ['surveyor-3-quiz'],
  };

  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest, null, 2), 'utf8'));
  zip.addFile('machines/surveyor-3/machine.json', Buffer.from(JSON.stringify(makeValidMachine(), null, 2), 'utf8'));
  zip.addFile('machines/surveyor-3/images/surveyor3.png', MINIMAL_PNG);
  zip.addFile('quizzes/surveyor-3-quiz.json', Buffer.from(JSON.stringify(makeValidQuiz(), null, 2), 'utf8'));

  return zip.toBuffer();
}

export function makeZipSlipZip(): Buffer {
  const zip = new AdmZip();
  const manifest: BundleManifest = {
    schemaVersion: 1,
    machines: ['surveyor-3'],
    quizzes: [],
  };
  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest), 'utf8'));
  zip.addFile('machines/placeholder.json', Buffer.from('{}', 'utf8'));
  const entry = zip.getEntries().find((e) => e.entryName === 'machines/placeholder.json');
  if (entry) {
    entry.entryName = '../escaped.json';
  }
  return zip.toBuffer();
}

export function makeZipBombZip(): Buffer {
  const zip = new AdmZip();
  const manifest: BundleManifest = {
    schemaVersion: 1,
    machines: ['surveyor-3'],
    quizzes: [],
  };
  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest), 'utf8'));
  // High compression ratio: 2 MB of identical zeros compresses to ~2 KB (ratio ~1000:1 > 50:1)
  const hugeZeroBuffer = Buffer.alloc(2 * 1024 * 1024, 0x30);
  zip.addFile('machines/surveyor-3/machine.json', hugeZeroBuffer);
  return zip.toBuffer();
}

export function makeEncryptedZip(): Buffer {
  const zip = new AdmZip();
  const manifest: BundleManifest = {
    schemaVersion: 1,
    machines: ['surveyor-3'],
    quizzes: [],
  };
  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest), 'utf8'));
  const buf = zip.toBuffer();
  const modified = Buffer.from(buf);

  // Set encryption bit in Local File Header (offset 6)
  if (modified.length > 8 && modified.readUInt32LE(0) === 0x04034b50) {
    const flags = modified.readUInt16LE(6);
    modified.writeUInt16LE(flags | 0x0001, 6);
  }

  // Set encryption bit in Central Directory File Header (offset 8 from 0x02014b50 signature)
  const cdOffset = modified.indexOf(Buffer.from([0x50, 0x4b, 0x01, 0x02]));
  if (cdOffset !== -1) {
    const flags = modified.readUInt16LE(cdOffset + 8);
    modified.writeUInt16LE(flags | 0x0001, cdOffset + 8);
  }

  return modified;
}

export function makeForbiddenExtensionZip(): Buffer {
  const zip = new AdmZip();
  const manifest: BundleManifest = {
    schemaVersion: 1,
    machines: ['surveyor-3'],
    quizzes: [],
  };
  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest), 'utf8'));
  zip.addFile('machines/surveyor-3/machine.json', Buffer.from(JSON.stringify(makeValidMachine()), 'utf8'));
  zip.addFile('machines/surveyor-3/payload.exe', Buffer.from('MZ\x90\x00\x03\x00\x00\x00', 'utf8'));
  return zip.toBuffer();
}

export function makeSignatureMismatchZip(): Buffer {
  const zip = new AdmZip();
  const manifest: BundleManifest = {
    schemaVersion: 1,
    machines: ['surveyor-3'],
    quizzes: [],
  };
  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest), 'utf8'));
  zip.addFile('machines/surveyor-3/machine.json', Buffer.from(JSON.stringify(makeValidMachine()), 'utf8'));
  // File named .png but containing plain text string
  zip.addFile('machines/surveyor-3/images/surveyor3.png', Buffer.from('NOT A PNG IMAGE AT ALL', 'utf8'));
  return zip.toBuffer();
}

export function makeImageOversizedZip(): Buffer {
  const zip = new AdmZip();
  const manifest: BundleManifest = {
    schemaVersion: 1,
    machines: ['surveyor-3'],
    quizzes: [],
  };
  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest), 'utf8'));
  zip.addFile('machines/surveyor-3/machine.json', Buffer.from(JSON.stringify(makeValidMachine()), 'utf8'));

  // Create PNG with 5000x5000 in IHDR chunk
  const oversizedPng = Buffer.from(MINIMAL_PNG);
  oversizedPng.writeUInt32BE(5000, 16); // width = 5000
  oversizedPng.writeUInt32BE(5000, 20); // height = 5000
  zip.addFile('machines/surveyor-3/images/surveyor3.png', oversizedPng);
  return zip.toBuffer();
}

export function makeManifestMissingZip(): Buffer {
  const zip = new AdmZip();
  zip.addFile('machines/surveyor-3/machine.json', Buffer.from(JSON.stringify(makeValidMachine()), 'utf8'));
  return zip.toBuffer();
}

export function makeManifestMismatchZip(): Buffer {
  const zip = new AdmZip();
  const manifest: BundleManifest = {
    schemaVersion: 1,
    machines: ['surveyor-3', 'missing-rover'],
    quizzes: [],
  };
  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest), 'utf8'));
  zip.addFile('machines/surveyor-3/machine.json', Buffer.from(JSON.stringify(makeValidMachine()), 'utf8'));
  zip.addFile('machines/surveyor-3/images/surveyor3.png', MINIMAL_PNG);
  return zip.toBuffer();
}

export function makeSchemaInvalidZip(): Buffer {
  const zip = new AdmZip();
  const manifest: BundleManifest = {
    schemaVersion: 1,
    machines: ['surveyor-3'],
    quizzes: [],
  };
  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest), 'utf8'));
  // Machine JSON with missing required fields
  zip.addFile(
    'machines/surveyor-3/machine.json',
    Buffer.from(JSON.stringify({ name: 'Surveyor 3', invalidField: true }), 'utf8')
  );
  return zip.toBuffer();
}

export function makeUnknownReferenceZip(): Buffer {
  const zip = new AdmZip();
  const manifest: BundleManifest = {
    schemaVersion: 1,
    machines: ['surveyor-3'],
    quizzes: [],
  };
  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest), 'utf8'));
  const machine = makeValidMachine({ body: 'non-existent-pluto' });
  zip.addFile('machines/surveyor-3/machine.json', Buffer.from(JSON.stringify(machine), 'utf8'));
  zip.addFile('machines/surveyor-3/images/surveyor3.png', MINIMAL_PNG);
  return zip.toBuffer();
}

export function makeForbiddenHostSourceZip(): Buffer {
  const zip = new AdmZip();
  const manifest: BundleManifest = {
    schemaVersion: 1,
    machines: ['surveyor-3'],
    quizzes: [],
  };
  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest), 'utf8'));
  const machine = makeValidMachine({
    sources: [
      {
        key: 'src-1',
        title: 'Untrusted blog',
        publisher: 'Random Blog',
        url: 'https://evil-untrusted-source.org/surveyor',
      },
    ],
  });
  zip.addFile('machines/surveyor-3/machine.json', Buffer.from(JSON.stringify(machine), 'utf8'));
  zip.addFile('machines/surveyor-3/images/surveyor3.png', MINIMAL_PNG);
  return zip.toBuffer();
}

export function makeDuplicateSlugZip(): Buffer {
  const zip = new AdmZip();
  const manifest = {
    schemaVersion: 1,
    machines: ['surveyor-3', 'surveyor-3'],
    quizzes: [],
  };
  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest), 'utf8'));
  return zip.toBuffer();
}
