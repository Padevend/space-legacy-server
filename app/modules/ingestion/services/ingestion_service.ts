import AdmZip from 'adm-zip';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';
import { IngestionRepository, ingestionRepository } from '../repositories/ingestion_repository.js';
import type {
  IngestionBatchDto,
  IngestionReport,
  IngestionRejectionDetail,
  ValidatedBundle,
  BundleManifest,
  BundleMachine,
  BundleQuiz,
} from '../models/ingestion_batch.js';
import { bundleManifestSchema, bundleMachineSchema, bundleQuizSchema } from '../validators/ingestion.js';
import { validateImageBuffer } from './image_validator_service.js';
import { ingestionConfig } from '#config/ingestion';
import { isAllowedSourceUrl } from '#shared/security/sources';
import { AppException } from '#exceptions/app_exception';

export class IngestionService {
  constructor(private repo: IngestionRepository = ingestionRepository) {}

  getSpecification(): Record<string, any> {
    return {
      schemaVersion: 1,
      bundleStructure: {
        'manifest.json': 'Root manifest listing schemaVersion, machines and quizzes slugs',
        'machines/<slug>/machine.json': 'Machine definition with sources, facts, timeline, images',
        'machines/<slug>/images/<filename>': 'Image binaries (jpg, jpeg, png, webp)',
        'quizzes/<slug>.json': 'Quiz questions and options',
      },
      limits: {
        maxArchiveBytes: ingestionConfig.maxArchiveBytes,
        maxEntries: ingestionConfig.maxEntries,
        maxTotalUncompressedBytes: ingestionConfig.maxTotalUncompressedBytes,
        maxEntryUncompressedBytes: ingestionConfig.maxEntryUncompressedBytes,
        maxJsonSizeBytes: ingestionConfig.maxJsonSizeBytes,
        maxCompressionRatio: ingestionConfig.maxCompressionRatio,
        maxPathDepth: ingestionConfig.maxPathDepth,
        maxFilenameLength: ingestionConfig.maxFilenameLength,
        maxImageWidth: ingestionConfig.maxImageWidth,
        maxImageHeight: ingestionConfig.maxImageHeight,
        maxMegapixels: ingestionConfig.maxMegapixels,
      },
      allowedExtensions: ingestionConfig.allowedExtensions,
      allowedSourceHosts: ingestionConfig.allowedSourceHosts,
      errorCodes: [
        'ZIP_INVALID',
        'ZIP_TOO_LARGE',
        'ZIP_TOO_MANY_ENTRIES',
        'ZIP_BOMB_SUSPECTED',
        'ZIP_ENCRYPTED',
        'ZIP_PATH_TRAVERSAL',
        'ZIP_FORBIDDEN_ENTRY',
        'FORBIDDEN_EXTENSION',
        'SIGNATURE_MISMATCH',
        'IMAGE_INVALID',
        'MANIFEST_MISSING',
        'MANIFEST_MISMATCH',
        'SCHEMA_INVALID',
        'REFERENCE_UNKNOWN',
        'SOURCE_MISSING',
        'URL_NOT_ALLOWED',
        'DUPLICATE_SLUG',
      ],
    };
  }

  generateTemplateZip(): Buffer {
    const zip = new AdmZip();

    const manifest: BundleManifest = {
      schemaVersion: 1,
      machines: ['surveyor-3'],
      quizzes: ['surveyor-3-quiz'],
    };

    const machine: BundleMachine = {
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
          value: '296',
          unit: 'kg',
          sourceKey: 'src-1',
          sortOrder: 1,
        },
      ],
      timeline: [
        {
          dateLabel: 'April 20, 1967',
          dateIso: '1967-04-20T00:04:53Z',
          title: 'Lunar Touchdown',
          description: 'Surveyor 3 touched down softly on the Moon inside a crater in Oceanus Procellarum.',
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
    };

    const quiz: BundleQuiz = {
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
    };

    // Minimal 1x1 valid PNG buffer
    const minimalPng = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0a, 0x49,
      0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00,
      0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]);

    zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest, null, 2), 'utf8'));
    zip.addFile('machines/surveyor-3/machine.json', Buffer.from(JSON.stringify(machine, null, 2), 'utf8'));
    zip.addFile('machines/surveyor-3/images/surveyor3.png', minimalPng);
    zip.addFile('quizzes/surveyor-3-quiz.json', Buffer.from(JSON.stringify(quiz, null, 2), 'utf8'));

    return zip.toBuffer();
  }

  async validateOrParseBundle(
    buffer: Buffer,
    filename: string,
    requestedById?: string | null
  ): Promise<{
    batch: IngestionBatchDto;
    validatedBundle?: ValidatedBundle;
    report: IngestionReport;
  }> {
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    const sizeBytes = buffer.length;

    // Create Initial Ingestion Batch
    const batch = await this.repo.createBatch({
      requestedById: requestedById ?? null,
      filename,
      sizeBytes,
      sha256,
      status: 'RECEIVED',
    });

    const errors: IngestionRejectionDetail[] = [];
    const warnings: string[] = [];

    const fail = async (code: string, message: string, details: IngestionRejectionDetail[] = []): Promise<never> => {
      const finalReport: IngestionReport = {
        status: 'REJECTED',
        summary: { machinesCount: 0, quizzesCount: 0, imagesCount: 0 },
        errors: details.length > 0 ? details : [{ issue: message, code }],
        warnings,
        processedAt: new Date().toISOString(),
      };

      await this.repo.updateBatch(batch.id, {
        status: 'REJECTED',
        rejectCode: code,
        rejectReason: message,
        report: finalReport,
        finishedAt: new Date(),
      });

      throw new AppException({
        code: code as any,
        message,
        details: finalReport.errors.map((e) => ({
          path: e.field || e.file || '',
          message: e.issue,
        })) as any,
        status: 422,
      });
    };

    // 1. Archive size check
    if (sizeBytes > ingestionConfig.maxArchiveBytes) {
      return await fail(
        'ZIP_TOO_LARGE',
        `ZIP archive size (${(sizeBytes / (1024 * 1024)).toFixed(2)} MB) exceeds limit of ${ingestionConfig.maxArchiveBytes / (1024 * 1024)} MB.`
      );
    }

    // 2. Parse ZIP
    let zip: AdmZip;
    let entries: AdmZip.IZipEntry[];
    try {
      zip = new AdmZip(buffer);
      entries = zip.getEntries();
    } catch {
      return await fail('ZIP_INVALID', 'Corrupt or unreadable ZIP archive.');
    }

    // 3. Entries count check
    if (entries.length > ingestionConfig.maxEntries) {
      return await fail(
        'ZIP_TOO_MANY_ENTRIES',
        `ZIP entry count (${entries.length}) exceeds maximum allowed entries (${ingestionConfig.maxEntries}).`
      );
    }

    let totalUncompressed = 0;
    const entryMap = new Map<string, AdmZip.IZipEntry>();

    for (const entry of entries) {
      if (entry.isDirectory) continue;

      const rawPath = entry.entryName;

      // Zip path traversal check
      if (
        rawPath.includes('..') ||
        rawPath.startsWith('/') ||
        rawPath.startsWith('\\') ||
        rawPath.includes('\\') ||
        rawPath.includes('\0')
      ) {
        return await fail('ZIP_PATH_TRAVERSAL', `Zip Slip detected in path: '${rawPath}'`, [
          { file: rawPath, issue: 'Illegal path traversal characters detected' },
        ]);
      }

      // Check depth and filename length
      const parts = rawPath.split('/');
      if (parts.length > ingestionConfig.maxPathDepth) {
        return await fail(
          'ZIP_FORBIDDEN_ENTRY',
          `Path depth of '${rawPath}' exceeds limit of ${ingestionConfig.maxPathDepth}`
        );
      }

      const basename = parts[parts.length - 1]!;
      if (basename.length > ingestionConfig.maxFilenameLength) {
        return await fail(
          'ZIP_FORBIDDEN_ENTRY',
          `Filename '${basename}' exceeds max length of ${ingestionConfig.maxFilenameLength}`
        );
      }

      // Hidden files, symlinks, nested archives
      if (basename.startsWith('.') || basename === '__MACOSX') {
        continue; // safely ignore macos metadata
      }

      const ext = basename.split('.').pop()?.toLowerCase();
      if (!ext || !ingestionConfig.allowedExtensions.includes(ext as any)) {
        return await fail(
          'FORBIDDEN_EXTENSION',
          `Forbidden file extension '.${ext}' in '${rawPath}'. Only ${ingestionConfig.allowedExtensions.join(', ')} permitted.`,
          [{ file: rawPath, issue: `Forbidden file extension '.${ext}'` }]
        );
      }

      // Encryption check
      if (entry.header && (entry.header.flags & 0x01) !== 0) {
        return await fail(
          'ZIP_ENCRYPTED',
          `Encrypted entry detected: '${rawPath}'. Encrypted archives are forbidden.`,
          [{ file: rawPath, issue: 'Entry is encrypted' }]
        );
      }

      // Zip Bomb & Size checks
      const uncompressedSize = entry.header ? entry.header.size : 0;
      const compressedSize = entry.header ? entry.header.compressedSize : 0;

      if (uncompressedSize > ingestionConfig.maxEntryUncompressedBytes) {
        return await fail(
          'ZIP_BOMB_SUSPECTED',
          `Entry '${rawPath}' uncompressed size (${uncompressedSize} bytes) exceeds limit of ${ingestionConfig.maxEntryUncompressedBytes} bytes.`,
          [{ file: rawPath, issue: 'Entry exceeds maximum uncompressed size limit' }]
        );
      }

      if (ext === 'json' && uncompressedSize > ingestionConfig.maxJsonSizeBytes) {
        return await fail(
          'ZIP_BOMB_SUSPECTED',
          `JSON file '${rawPath}' exceeds maximum size of ${ingestionConfig.maxJsonSizeBytes} bytes.`,
          [{ file: rawPath, issue: 'JSON size exceeds limit' }]
        );
      }

      if (compressedSize > 0) {
        const ratio = uncompressedSize / compressedSize;
        if (ratio > ingestionConfig.maxCompressionRatio) {
          return await fail(
            'ZIP_BOMB_SUSPECTED',
            `Compression ratio ${ratio.toFixed(1)}:1 on '${rawPath}' exceeds threshold of ${ingestionConfig.maxCompressionRatio}:1.`,
            [{ file: rawPath, issue: 'High compression ratio indicates potential zip bomb' }]
          );
        }
      }

      totalUncompressed += uncompressedSize;
      if (totalUncompressed > ingestionConfig.maxTotalUncompressedBytes) {
        return await fail(
          'ZIP_BOMB_SUSPECTED',
          `Total uncompressed size exceeds limit of ${ingestionConfig.maxTotalUncompressedBytes / (1024 * 1024)} MB.`
        );
      }

      entryMap.set(rawPath, entry);
    }

    // 4. Manifest check
    const manifestEntry = entryMap.get('manifest.json');
    if (!manifestEntry) {
      return await fail('MANIFEST_MISSING', "Required 'manifest.json' file not found in root of archive.");
    }

    let manifestRaw: any;
    try {
      manifestRaw = JSON.parse(manifestEntry.getData().toString('utf8'));
    } catch {
      return await fail('SCHEMA_INVALID', "Failed to parse 'manifest.json' as valid JSON.", [
        { file: 'manifest.json', issue: 'Invalid JSON syntax' },
      ]);
    }

    const manifestParsed = bundleManifestSchema.safeParse(manifestRaw);
    if (!manifestParsed.success) {
      const details = manifestParsed.error.issues.map((i) => ({
        file: 'manifest.json',
        field: i.path.join('.'),
        issue: i.message,
      }));
      return await fail('SCHEMA_INVALID', "Validation failed for 'manifest.json'.", details);
    }

    const manifest = manifestParsed.data;

    // Check duplicate slugs
    const machineSlugs = new Set<string>();
    for (const m of manifest.machines) {
      if (machineSlugs.has(m)) {
        return await fail('DUPLICATE_SLUG', `Duplicate machine slug in manifest: '${m}'`, [
          { file: 'manifest.json', field: 'machines', issue: `Duplicate slug '${m}'` },
        ]);
      }
      machineSlugs.add(m);
    }

    const quizSlugs = new Set<string>();
    for (const q of manifest.quizzes) {
      if (quizSlugs.has(q)) {
        return await fail('DUPLICATE_SLUG', `Duplicate quiz slug in manifest: '${q}'`, [
          { file: 'manifest.json', field: 'quizzes', issue: `Duplicate slug '${q}'` },
        ]);
      }
      quizSlugs.add(q);
    }

    // Check manifest machines match files
    for (const slug of manifest.machines) {
      const machineFilePath = `machines/${slug}/machine.json`;
      if (!entryMap.has(machineFilePath)) {
        return await fail('MANIFEST_MISMATCH', `Declared machine '${slug}' missing '${machineFilePath}'.`, [
          { file: machineFilePath, issue: 'Machine definition file not found' },
        ]);
      }
    }

    // Check manifest quizzes match files
    for (const slug of manifest.quizzes) {
      const quizFilePath = `quizzes/${slug}.json`;
      if (!entryMap.has(quizFilePath)) {
        return await fail('MANIFEST_MISMATCH', `Declared quiz '${slug}' missing '${quizFilePath}'.`, [
          { file: quizFilePath, issue: 'Quiz definition file not found' },
        ]);
      }
    }

    // 5. Parse and validate Machines
    const validatedMachines: ValidatedBundle['machines'] = [];

    for (const slug of manifest.machines) {
      const machineFilePath = `machines/${slug}/machine.json`;
      const entry = entryMap.get(machineFilePath)!;
      let rawJson: any;
      try {
        rawJson = JSON.parse(entry.getData().toString('utf8'));
      } catch {
        return await fail('SCHEMA_INVALID', `Invalid JSON in '${machineFilePath}'.`, [
          { file: machineFilePath, issue: 'Invalid JSON syntax' },
        ]);
      }

      const parsed = bundleMachineSchema.safeParse(rawJson);
      if (!parsed.success) {
        const details = parsed.error.issues.map((i) => ({
          file: machineFilePath,
          field: i.path.join('.'),
          issue: i.message,
        }));
        return await fail('SCHEMA_INVALID', `Validation failed for '${machineFilePath}'.`, details);
      }

      const machineData = parsed.data;

      // Validate Celestial Body reference
      const body = await this.repo.findCelestialBodyBySlug(machineData.body);
      if (!body) {
        return await fail(
          'REFERENCE_UNKNOWN',
          `Celestial body '${machineData.body}' referenced in '${machineFilePath}' does not exist.`,
          [{ file: machineFilePath, field: 'body', issue: `Body '${machineData.body}' not found in database.` }]
        );
      }

      // Validate sources
      if (!machineData.sources || machineData.sources.length === 0) {
        return await fail('SOURCE_MISSING', `Machine '${slug}' must have at least one source (N7).`, [
          { file: machineFilePath, field: 'sources', issue: 'Sources array cannot be empty' },
        ]);
      }

      const sourceKeys = new Set<string>();
      for (const src of machineData.sources) {
        sourceKeys.add(src.key);
        if (!isAllowedSourceUrl(src.url)) {
          return await fail(
            'URL_NOT_ALLOWED',
            `Source URL domain '${src.url}' in '${machineFilePath}' is not allowed.`,
            [
              {
                file: machineFilePath,
                field: `sources.${src.key}.url`,
                issue: `Domain must belong to allowed hosts (${ingestionConfig.allowedSourceHosts.join(', ')})`,
              },
            ]
          );
        }
      }

      // Validate facts source references
      for (const fact of machineData.facts) {
        if (!sourceKeys.has(fact.sourceKey)) {
          return await fail(
            'REFERENCE_UNKNOWN',
            `Fact '${fact.label}' references unknown sourceKey '${fact.sourceKey}' in '${machineFilePath}'.`,
            [{ file: machineFilePath, field: 'facts', issue: `sourceKey '${fact.sourceKey}' not found in sources` }]
          );
        }
      }

      // Validate timeline source references
      for (const ev of machineData.timeline) {
        if (!sourceKeys.has(ev.sourceKey)) {
          return await fail(
            'REFERENCE_UNKNOWN',
            `Timeline event '${ev.title}' references unknown sourceKey '${ev.sourceKey}' in '${machineFilePath}'.`,
            [{ file: machineFilePath, field: 'timeline', issue: `sourceKey '${ev.sourceKey}' not found in sources` }]
          );
        }
      }

      // Validate Images binaries and metadata
      const imageBuffers: ValidatedBundle['machines'][0]['imageBuffers'] = [];
      for (const img of machineData.images) {
        const imageZipPath = `machines/${slug}/images/${img.filename}`;
        const imgEntry = entryMap.get(imageZipPath);
        if (!imgEntry) {
          return await fail(
            'REFERENCE_UNKNOWN',
            `Image file '${imageZipPath}' declared in machine.json does not exist.`,
            [{ file: imageZipPath, issue: 'Image file declared in machine.json missing in archive' }]
          );
        }

        const imgBuffer = imgEntry.getData();
        const imgValidation = validateImageBuffer(imgBuffer, img.filename);
        if (!imgValidation.valid) {
          return await fail(imgValidation.code || 'IMAGE_INVALID', imgValidation.issue || 'Image validation failed', [
            { file: imageZipPath, issue: imgValidation.issue || 'Invalid image binary' },
          ]);
        }

        imageBuffers.push({
          filename: img.filename,
          buffer: imgBuffer,
          meta: {
            alt: img.alt,
            label: img.label,
            credit: img.credit,
            sourceUrl: img.sourceUrl ?? null,
            width: imgValidation.width!,
            height: imgValidation.height!,
            isCover: img.isCover ?? false,
            sortOrder: img.sortOrder ?? 0,
          },
        });
      }

      validatedMachines.push({
        slug,
        data: machineData as BundleMachine,
        bodyId: body.id,
        imageBuffers,
      });
    }

    // 6. Parse and validate Quizzes
    const validatedQuizzes: ValidatedBundle['quizzes'] = [];

    for (const slug of manifest.quizzes) {
      const quizFilePath = `quizzes/${slug}.json`;
      const entry = entryMap.get(quizFilePath)!;
      let rawJson: any;
      try {
        rawJson = JSON.parse(entry.getData().toString('utf8'));
      } catch {
        return await fail('SCHEMA_INVALID', `Invalid JSON in '${quizFilePath}'.`, [
          { file: quizFilePath, issue: 'Invalid JSON syntax' },
        ]);
      }

      const parsed = bundleQuizSchema.safeParse(rawJson);
      if (!parsed.success) {
        const details = parsed.error.issues.map((i) => ({
          file: quizFilePath,
          field: i.path.join('.'),
          issue: i.message,
        }));
        return await fail('SCHEMA_INVALID', `Validation failed for '${quizFilePath}'.`, details);
      }

      const quizData = parsed.data;
      let bodyId: string | null = null;
      let machineId: string | null = null;

      if (quizData.body) {
        const b = await this.repo.findCelestialBodyBySlug(quizData.body);
        if (!b) {
          return await fail('REFERENCE_UNKNOWN', `Quiz references unknown celestial body: '${quizData.body}'`, [
            { file: quizFilePath, field: 'body', issue: `Celestial body '${quizData.body}' not found` },
          ]);
        }
        bodyId = b.id;
      }

      if (quizData.machine) {
        const m =
          validatedMachines.find((vm) => vm.slug === quizData.machine) ||
          (await this.repo.findMachineBySlug(quizData.machine));
        if (!m) {
          return await fail('REFERENCE_UNKNOWN', `Quiz references unknown machine: '${quizData.machine}'`, [
            { file: quizFilePath, field: 'machine', issue: `Machine '${quizData.machine}' not found` },
          ]);
        }
        machineId = 'id' in m ? (m as any).id : null;
      }

      validatedQuizzes.push({
        slug,
        data: quizData as BundleQuiz,
        bodyId,
        machineId,
      });
    }

    const validatedBundle: ValidatedBundle = {
      manifest,
      machines: validatedMachines,
      quizzes: validatedQuizzes,
    };

    const report: IngestionReport = {
      status: 'VALIDATED',
      summary: {
        machinesCount: validatedMachines.length,
        quizzesCount: validatedQuizzes.length,
        imagesCount: validatedMachines.reduce((acc, m) => acc + m.imageBuffers.length, 0),
      },
      errors: [],
      warnings,
      processedAt: new Date().toISOString(),
    };

    return {
      batch,
      validatedBundle,
      report,
    };
  }

  async validateBundle(
    buffer: Buffer,
    filename: string,
    requestedById?: string | null
  ): Promise<{ batchId: string; report: IngestionReport }> {
    const { batch, report } = await this.validateOrParseBundle(buffer, filename, requestedById);

    await this.repo.updateBatch(batch.id, {
      status: 'VALIDATED',
      report,
      finishedAt: new Date(),
    });

    return {
      batchId: batch.id,
      report,
    };
  }

  async commitBundle(
    buffer: Buffer,
    filename: string,
    requestedById?: string | null
  ): Promise<{ batchId: string; report: IngestionReport }> {
    const { batch, validatedBundle, report } = await this.validateOrParseBundle(buffer, filename, requestedById);

    if (!validatedBundle) {
      throw AppException.badRequest('Bundle validation failed unexpectedly.');
    }

    // Save image files to public disk storage safely
    for (const machine of validatedBundle.machines) {
      if (machine.imageBuffers.length > 0) {
        const targetDir = path.resolve(process.cwd(), `public/images/machines/${machine.slug}`);
        await fs.mkdir(targetDir, { recursive: true });

        for (const img of machine.imageBuffers) {
          const filePath = path.join(targetDir, img.filename);
          await fs.writeFile(filePath, img.buffer);
        }
      }
    }

    // Upsert database transaction
    await this.repo.upsertBundleData(validatedBundle);

    report.status = 'COMMITTED';
    await this.repo.updateBatch(batch.id, {
      status: 'COMMITTED',
      report,
      finishedAt: new Date(),
    });

    return {
      batchId: batch.id,
      report,
    };
  }

  async getBatchById(id: string): Promise<IngestionBatchDto> {
    const batch = await this.repo.findBatchById(id);
    if (!batch) {
      throw AppException.notFound('IngestionBatch', `Ingestion batch '${id}' not found.`);
    }
    return batch;
  }
}

export const ingestionService = new IngestionService();
