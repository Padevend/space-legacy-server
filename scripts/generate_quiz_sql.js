#!/usr/bin/env node

/**
 * Quiz SQL Generator for Space Legacy
 * Reads authentic NASA quiz files from data-seed/quiz and generates
 * standard PostgreSQL seeder script adhering to prisma/schema.prisma.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Deterministic UUID generator from namespace + key
function deterministicUuid(seedStr) {
  const hash = crypto.createHash('sha256').update(seedStr).digest('hex');
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    '4' + hash.substring(13, 16),
    ((parseInt(hash.substring(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0') + hash.substring(18, 20),
    hash.substring(20, 32),
  ].join('-');
}

function sqlEscape(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function convertQuestion(q) {
  const prompt = q.question;
  const explanation = q.explication || 'Donnée authentique validée par la NASA.';
  let options = [];

  if (q.type === 'qcm') {
    options = (q.choix || []).map((ch, idx) => ({
      label: String(ch).trim(),
      isCorrect: String(ch).trim().toLowerCase() === String(q.reponse).trim().toLowerCase(),
      sortOrder: idx + 1,
    }));
    if (!options.some((o) => o.isCorrect)) {
      const matchIdx = options.findIndex(
        (o) => o.label.includes(String(q.reponse)) || String(q.reponse).includes(o.label)
      );
      if (matchIdx >= 0) options[matchIdx].isCorrect = true;
      else if (options.length > 0) options[0].isCorrect = true;
    }
  } else if (q.type === 'vrai_faux') {
    const isTrue = q.reponse === true || String(q.reponse).toLowerCase() === 'vrai';
    options = [
      { label: 'Vrai', isCorrect: isTrue, sortOrder: 1 },
      { label: 'Faux', isCorrect: !isTrue, sortOrder: 2 },
    ];
  } else if (q.type === 'saisie_numerique') {
    const num = Number(q.reponse);
    const unit = q.unite ? ` ${q.unite}` : '';
    if (isNaN(num)) {
      options = [
        { label: String(q.reponse) + unit, isCorrect: true, sortOrder: 1 },
        { label: 'Valeur alternative' + unit, isCorrect: false, sortOrder: 2 },
      ];
    } else {
      const d1 = num === 0 ? 1 : Math.round(num * 1.5);
      const d2 = num === 0 ? 2 : Math.max(0, Math.round(num * 0.5));
      const d3 = num + (num > 10 ? 10 : 3);
      options = [
        { label: `${num}${unit}`, isCorrect: true, sortOrder: 1 },
        { label: `${d1}${unit}`, isCorrect: false, sortOrder: 2 },
        { label: `${d2}${unit}`, isCorrect: false, sortOrder: 3 },
        { label: `${d3}${unit}`, isCorrect: false, sortOrder: 4 },
      ];
    }
  } else if (q.type === 'ordre') {
    const arr = Array.isArray(q.reponse) ? q.reponse : q.elements || [];
    const correctSeq = arr.map((item, i) => `${i + 1}. ${item}`).join(' ➔ ');
    const distractor1 = [...arr].reverse().map((item, i) => `${i + 1}. ${item}`).join(' ➔ ');
    const distractor2 =
      arr.length > 2
        ? [arr[1], arr[0], ...arr.slice(2)].map((item, i) => `${i + 1}. ${item}`).join(' ➔ ')
        : `${arr.join(' et ensuite ')}`;
    options = [
      { label: correctSeq, isCorrect: true, sortOrder: 1 },
      { label: distractor1, isCorrect: false, sortOrder: 2 },
      { label: distractor2, isCorrect: false, sortOrder: 3 },
    ];
  } else if (q.type === 'association') {
    const pairs = Array.isArray(q.reponse) ? q.reponse : [];
    const correctStr = pairs.map((p) => `${p.gauche || p.terme} = ${p.droite || p.definition}`).join(' | ');
    const reversed = pairs
      .map(
        (p, i, a) =>
          `${p.gauche || p.terme} = ${(a[(i + 1) % a.length]).droite || (a[(i + 1) % a.length]).definition}`
      )
      .join(' | ');
    options = [
      { label: correctStr, isCorrect: true, sortOrder: 1 },
      { label: reversed, isCorrect: false, sortOrder: 2 },
    ];
  } else if (q.type === 'qcm_multiple') {
    const correctAnswers = Array.isArray(q.reponses) ? q.reponses : [q.reponse];
    const choices = q.choix || [];
    const correctLabel = correctAnswers.join(' ET ');
    const falseChoices = choices.filter((c) => !correctAnswers.includes(c));
    const distractor1 = falseChoices.length > 0 ? falseChoices.join(' ET ') : choices.slice(0, 2).join(' ET ');
    const distractor2 = correctAnswers.length > 1 ? correctAnswers[0] : 'Aucune de ces réponses';
    options = [
      { label: correctLabel, isCorrect: true, sortOrder: 1 },
      { label: distractor1, isCorrect: false, sortOrder: 2 },
      { label: distractor2, isCorrect: false, sortOrder: 3 },
    ];
  } else {
    options = [
      { label: String(q.reponse || 'Réponse correcte'), isCorrect: true, sortOrder: 1 },
      { label: 'Autre possibilité', isCorrect: false, sortOrder: 2 },
    ];
  }

  // Ensure unique sortOrders
  options.forEach((opt, idx) => {
    opt.sortOrder = idx + 1;
  });

  return { prompt, explanation, options };
}

const quizSources = [
  {
    file: 'data-seed/quiz/lune/quiz-atterrisseurs-robotises.json',
    slugBase: 'atterrisseurs-robotises',
    titleBase: 'Surveyor 3 et Atterrisseurs Lunaires',
    bodySlug: 'moon',
    machineSlug: 'surveyor-1',
  },
  {
    file: 'data-seed/quiz/lune/quiz-modules-lunaires-apollo.json',
    slugBase: 'modules-lunaires-apollo',
    titleBase: 'Modules Lunaires Apollo & Eagle (Apollo 11)',
    bodySlug: 'moon',
    machineSlug: 'apollo-11-lm',
  },
  {
    file: 'data-seed/quiz/lune/quiz-modules-scientifiques-alsep.json',
    slugBase: 'modules-scientifiques-alsep',
    titleBase: 'Stations Scientifiques ALSEP & Apollo 12',
    bodySlug: 'moon',
    machineSlug: 'apollo-12-lm',
  },
  {
    file: 'data-seed/quiz/lune/quiz-vehicules-lunaires-mobiles-lrv.json',
    slugBase: 'vehicules-lunaires-mobiles-lrv',
    titleBase: 'Véhicules Lunaires Mobiles LRV & Apollo 15',
    bodySlug: 'moon',
    machineSlug: 'apollo-15-lrv',
  },
  {
    file: 'data-seed/quiz/mars/quiz_ingenuity.json',
    slugBase: 'helicoptere-ingenuity',
    titleBase: 'Hélicoptère Ingenuity sur Mars',
    bodySlug: 'mars',
    machineSlug: 'ingenuity',
  },
  {
    file: 'data-seed/quiz/mars/quiz-atterrisseurs-viking-1-et-2.json',
    slugBase: 'atterrisseurs-viking',
    titleBase: 'Atterrisseurs Viking 1 & 2 sur Mars',
    bodySlug: 'mars',
    machineSlug: 'viking-1',
  },
  {
    file: 'data-seed/quiz/mars/quiz_sojourner.json',
    slugBase: 'rover-sojourner',
    titleBase: 'Rover Sojourner & Mars Pathfinder',
    bodySlug: 'mars',
    machineSlug: null,
  },
  {
    file: 'data-seed/quiz/mars/quiz-atterrisseurs-phoenix-et-insight.json',
    slugBase: 'phoenix-insight',
    titleBase: 'Atterrisseurs Phoenix & InSight',
    bodySlug: 'mars',
    machineSlug: null,
  },
  {
    file: 'data-seed/quiz/mars/quiz-a-proximite-de-shoemaker.json',
    slugBase: 'near-shoemaker',
    titleBase: 'Sonde NEAR Shoemaker sur Éros',
    bodySlug: null,
    machineSlug: null,
  },
  {
    file: 'data-seed/quiz/mars/quiz-pioneer-10-et-11.json',
    slugBase: 'pioneer-10-11',
    titleBase: 'Sondes Pionnières Pioneer 10 & 11',
    bodySlug: null,
    machineSlug: null,
  },
  {
    file: 'data-seed/quiz/mars/quiz-vaisseau-spatial-dawn.json',
    slugBase: 'vaisseau-dawn',
    titleBase: 'Mission Dawn vers Vesta et Cérès',
    bodySlug: null,
    machineSlug: null,
  },
  {
    file: 'data-seed/quiz/mars/quiz_kepler.json',
    slugBase: 'telescope-kepler',
    titleBase: 'Télescope Spatial Kepler & Exoplanètes',
    bodySlug: null,
    machineSlug: null,
  },
];

export function generateQuizSql() {
  const lines = [
    '--',
    '-- Space Legacy - Official Quiz Dataset Seeder (see_quizzz.sql)',
    '-- Compatible with PostgreSQL and Prisma schema (prisma/schema.prisma)',
    '--',
    '',
    'BEGIN;',
    '',
  ];

  let quizCount = 0;
  let questionCount = 0;
  let optionCount = 0;

  for (const src of quizSources) {
    const rawData = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), src.file), 'utf8'));
    const niveaux = rawData.niveaux || {};

    // 1. Explorer Level (using niveau_1_enfants questions)
    const explorerQuestions = (niveaux.niveau_1_enfants?.questions || []).slice(0, 15);
    // 2. Expert Level (using niveau_3_adultes or niveau_2_adolescents questions)
    const expertQuestions = (
      niveaux.niveau_3_adultes?.questions ||
      niveaux.niveau_2_adolescents?.questions ||
      []
    ).slice(0, 15);

    const quizConfigs = [
      {
        slug: `${src.slugBase}-explorer`,
        title: `${src.titleBase} (Explorateur)`,
        level: 'EXPLORER',
        questions: explorerQuestions,
      },
      {
        slug: `${src.slugBase}-expert`,
        title: `${src.titleBase} (Expert)`,
        level: 'EXPERT',
        questions: expertQuestions,
      },
    ];

    for (const cfg of quizConfigs) {
      if (cfg.questions.length === 0) continue;

      const quizId = deterministicUuid(`quiz:${cfg.slug}`);
      const bodyExpr = src.bodySlug
        ? `(SELECT "id" FROM "celestial_bodies" WHERE "slug" = '${src.bodySlug}' LIMIT 1)`
        : 'NULL';
      const machineExpr = src.machineSlug
        ? `(SELECT "id" FROM "machines" WHERE "slug" = '${src.machineSlug}' LIMIT 1)`
        : 'NULL';

      lines.push(`-- Quiz: ${cfg.title} (${cfg.slug})`);
      lines.push(
        `INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")`
      );
      lines.push(
        `VALUES ('${quizId}', ${sqlEscape(cfg.slug)}, ${sqlEscape(cfg.title)}, '${cfg.level}'::"QuizLevel", ${bodyExpr}, ${machineExpr}, true, NOW(), NOW())`
      );
      lines.push(
        `ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();`
      );
      lines.push('');
      quizCount++;

      // Questions & Options
      cfg.questions.forEach((qRaw, qIdx) => {
        const qConv = convertQuestion(qRaw);
        const questionId = deterministicUuid(`question:${cfg.slug}:${qIdx}:${qRaw.id || qRaw.question}`);
        const sortOrder = qIdx + 1;

        lines.push(
          `INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")`
        );
        lines.push(
          `VALUES ('${questionId}', '${quizId}', ${sqlEscape(qConv.prompt)}, ${sqlEscape(qConv.explanation)}, ${sortOrder})`
        );
        lines.push(
          `ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";`
        );
        questionCount++;

        qConv.options.forEach((opt, optIdx) => {
          const optionId = deterministicUuid(`option:${questionId}:${optIdx}:${opt.label}`);
          lines.push(
            `INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")`
          );
          lines.push(
            `VALUES ('${optionId}', '${questionId}', ${sqlEscape(opt.label)}, ${opt.isCorrect ? 'true' : 'false'}, ${opt.sortOrder})`
          );
          lines.push(
            `ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";`
          );
          optionCount++;
        });

        lines.push('');
      });
    }
  }

  lines.push('COMMIT;');
  lines.push('');
  lines.push(`-- Summary: ${quizCount} quizzes, ${questionCount} questions, ${optionCount} options generated.`);

  return { sql: lines.join('\n'), quizCount, questionCount, optionCount };
}

if (process.argv[1]?.endsWith('generate_quiz_sql.js')) {
  console.info('Generating Quiz SQL Seeder...');
  const { sql, quizCount, questionCount, optionCount } = generateQuizSql();

  const paths = [
    'see_quizzz.sql',
    'seed_quizzes.sql',
    'data-seed/see_quizzz.sql',
    'data-seed/seed_quizzes.sql',
    'prisma/see_quizzz.sql',
    'prisma/seed_quizzes.sql',
  ];

  for (const relPath of paths) {
    const fullPath = path.resolve(process.cwd(), relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, sql, 'utf8');
    console.info(`✓ Wrote ${fullPath}`);
  }

  console.info(`\n🎉 Successfully generated: ${quizCount} quizzes, ${questionCount} questions, ${optionCount} options!`);
}
