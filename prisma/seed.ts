import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '#infrastructure/database/prisma_client';
import { hashPassword } from '#shared/security/password';

export async function main() {
  // eslint-disable-next-line no-console
  console.log('Seeding authentic NASA lunar and Martian dataset (Section 5 & N7)...');

  // 1. Initial Admin Account (attached to a Visitor)
  const adminPasswordHash = await hashPassword('AdminSpaceLegacy2026!');
  const adminEmail = 'admin@spacelegacy.test';

  let existingAccount = await prisma.account.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAccount) {
    const adminVisitor = await prisma.visitor.create({
      data: {},
    });

    existingAccount = await prisma.account.create({
      data: {
        visitorId: adminVisitor.id,
        email: adminEmail,
        passwordHash: adminPasswordHash,
        displayName: 'NASA Space Legacy Administrator',
        role: 'ADMIN',
      },
    });
    // eslint-disable-next-line no-console
    console.log(`Created admin account: ${adminEmail}`);
  }

  // 2. Celestial Bodies (Moon and Mars only per N1 & N7)
  const moon = await prisma.celestialBody.upsert({
    where: { slug: 'moon' },
    update: {
      name: 'Moon',
      summary: "Earth's natural satellite, home to NASA's historic Apollo landing sites and early robotic probes.",
      imagePath: '/images/bodies/moon.webp',
      sortOrder: 1,
      isPublished: true,
    },
    create: {
      slug: 'moon',
      name: 'Moon',
      summary: "Earth's natural satellite, home to NASA's historic Apollo landing sites and early robotic probes.",
      imagePath: '/images/bodies/moon.webp',
      sortOrder: 1,
      isPublished: true,
    },
  });

  const mars = await prisma.celestialBody.upsert({
    where: { slug: 'mars' },
    update: {
      name: 'Mars',
      summary: "The Red Planet, host to pioneering NASA rovers, stationary landers, and the Ingenuity helicopter.",
      imagePath: '/images/bodies/mars.webp',
      sortOrder: 2,
      isPublished: true,
    },
    create: {
      slug: 'mars',
      name: 'Mars',
      summary: "The Red Planet, host to pioneering NASA rovers, stationary landers, and the Ingenuity helicopter.",
      imagePath: '/images/bodies/mars.webp',
      sortOrder: 2,
      isPublished: true,
    },
  });

  // 3. Machines - Moon

  // 3.1 Apollo 11 Lunar Module (Eagle)
  const apollo11 = await prisma.machine.upsert({
    where: { slug: 'apollo-11-lm' },
    update: {},
    create: {
      slug: 'apollo-11-lm',
      bodyId: moon.id,
      name: 'Apollo 11 Lunar Module (Eagle)',
      kind: 'LANDER',
      state: 'JOB_FINISHED',
      stateSince: '1969-07-21',
      launchYear: 1969,
      arrivalYear: 1969,
      summary: 'First crewed spacecraft to land on the Moon on July 20, 1969.',
      description:
        'The Apollo 11 Lunar Module Eagle carried Neil Armstrong and Buzz Aldrin to Mare Tranquillitatis. While the ascent stage lifted off to return the crew to orbit, the descent stage remains intact at Tranquility Base as a monumental human artifact.',
      missionPurpose: 'Land two astronauts on the lunar surface and return them safely to lunar orbit.',
      howItWorked:
        'A two-stage spacecraft designed strictly for the vacuum of space. The descent stage housed a throttleable rocket engine and landing gear, serving as the launch pad for the ascent stage.',
      discoveries:
        'Demonstrated that humans can safely land, work, and collect samples on another celestial body. Returned 21.55 kg of lunar samples.',
      currentStatusNote: 'Descent stage remains permanently parked at Tranquility Base.',
      latitude: 0.67408,
      longitude: 23.47297,
      isPublished: true,
    },
  });

  const apollo11Source1 = await prisma.machineSource.upsert({
    where: {
      machineId_url: {
        machineId: apollo11.id,
        url: 'https://science.nasa.gov/mission/apollo-11/',
      },
    },
    update: {},
    create: {
      machineId: apollo11.id,
      title: 'Apollo 11 Mission Overview',
      publisher: 'NASA Science',
      url: 'https://science.nasa.gov/mission/apollo-11/',
    },
  });

  const apollo11Source2 = await prisma.machineSource.upsert({
    where: {
      machineId_url: {
        machineId: apollo11.id,
        url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C',
      },
    },
    update: {},
    create: {
      machineId: apollo11.id,
      title: 'Apollo 11 Lunar Module / EASEP',
      publisher: 'NASA Space Science Data Coordinated Archive',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C',
    },
  });

  await prisma.machineFact.createMany({
    data: [
      {
        machineId: apollo11.id,
        label: 'Landed Dry Mass',
        value: '2034',
        unit: 'kg',
        sourceId: apollo11Source2.id,
        sortOrder: 1,
      },
      {
        machineId: apollo11.id,
        label: 'Lunar Surface Stay Duration',
        value: '21.6',
        unit: 'hours',
        sourceId: apollo11Source1.id,
        sortOrder: 2,
      },
      {
        machineId: apollo11.id,
        label: 'Samples Collected',
        value: '21.55',
        unit: 'kg',
        sourceId: apollo11Source1.id,
        sortOrder: 3,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.machineEvent.createMany({
    data: [
      {
        machineId: apollo11.id,
        dateLabel: 'July 20, 1969',
        dateIso: new Date('1969-07-20T20:17:40Z'),
        title: 'Lunar Surface Landing',
        description:
          'Eagle landed in Mare Tranquillitatis with Neil Armstrong and Buzz Aldrin aboard, with approximately 25 seconds of descent fuel remaining.',
        sourceId: apollo11Source1.id,
        sortOrder: 1,
      },
      {
        machineId: apollo11.id,
        dateLabel: 'July 21, 1969',
        dateIso: new Date('1969-07-21T02:56:15Z'),
        title: 'First Human Step on the Moon',
        description:
          'Neil Armstrong stepped off the ladder declaring: "That\'s one small step for [a] man, one giant leap for mankind."',
        sourceId: apollo11Source1.id,
        sortOrder: 2,
      },
      {
        machineId: apollo11.id,
        dateLabel: 'July 21, 1969',
        dateIso: new Date('1969-07-21T17:54:00Z'),
        title: 'Ascent Stage Liftoff',
        description: 'The ascent stage fired its engine, leaving the descent stage behind at Tranquility Base.',
        sourceId: apollo11Source2.id,
        sortOrder: 3,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.machineImage.createMany({
    data: [
      {
        machineId: apollo11.id,
        path: '/images/machines/apollo-11-lm/eagle_tranquility.webp',
        alt: 'Apollo 11 Lunar Module Eagle on the surface of the Moon',
        label: 'REAL_PHOTO',
        credit: 'NASA / Neil Armstrong',
        sourceUrl: 'https://images.nasa.gov/details/AS11-40-5922',
        width: 1920,
        height: 1080,
        isCover: true,
        sortOrder: 1,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.logbookEntry.upsert({
    where: {
      machineId_slug: {
        machineId: apollo11.id,
        slug: 'tranquility-base',
      },
    },
    update: {},
    create: {
      machineId: apollo11.id,
      slug: 'tranquility-base',
      title: 'Tranquility Base: One Giant Leap',
      summary: 'How computer overload alarms and a boulder field nearly diverted the first landing.',
      articleMarkdown: `# Tranquility Base: One Giant Leap\n\nWhen the Lunar Module Eagle descended toward the Moon on July 20, 1969, computer program alarms (1202 and 1201) sounded repeatedly...\n\nNeil Armstrong piloted past a large boulder field into a safe clearing in Mare Tranquillitatis.`,
      articleOrigin: 'AUTHORED',
      videoUrl: 'https://images.nasa.gov/details/Apollo11LandingHighlight',
      videoOrigin: 'AUTHORED',
      videoDurationSec: 184,
      isPublished: true,
      publishedAt: new Date('1969-07-21T00:00:00Z'),
    },
  });

  // 3.2 Surveyor 1
  const surveyor1 = await prisma.machine.upsert({
    where: { slug: 'surveyor-1' },
    update: {},
    create: {
      slug: 'surveyor-1',
      bodyId: moon.id,
      name: 'Surveyor 1',
      kind: 'LANDER',
      state: 'JOB_FINISHED',
      stateSince: '1967-01-07',
      launchYear: 1966,
      arrivalYear: 1966,
      summary: "NASA's first robotic soft landing on the Moon, paving the way for Apollo.",
      description:
        'Surveyor 1 touched down in Oceanus Procellarum on June 2, 1966. It transmitted 11,237 high-resolution television pictures, proving that the lunar soil would support the weight of Apollo landers.',
      missionPurpose: 'Demonstrate soft landing technology and survey the lunar terrain in preparation for Apollo.',
      howItWorked:
        'Guided by radar altimetry, a solid rocket slowed the spacecraft before three throttleable vernier engines brought it to touchdown.',
      discoveries: 'Proved the lunar regolith has adequate bearing strength to support a human landing module.',
      currentStatusNote: 'Resting in Oceanus Procellarum.',
      latitude: -2.4745,
      longitude: -43.3399,
      isPublished: true,
    },
  });

  const surveyor1Source = await prisma.machineSource.upsert({
    where: {
      machineId_url: {
        machineId: surveyor1.id,
        url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1966-045A',
      },
    },
    update: {},
    create: {
      machineId: surveyor1.id,
      title: 'Surveyor 1 Mission Details',
      publisher: 'NASA Space Science Data Coordinated Archive',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1966-045A',
    },
  });

  await prisma.machineFact.createMany({
    data: [
      {
        machineId: surveyor1.id,
        label: 'Landed Mass',
        value: '294.3',
        unit: 'kg',
        sourceId: surveyor1Source.id,
        sortOrder: 1,
      },
      {
        machineId: surveyor1.id,
        label: 'Pictures Transmitted',
        value: '11237',
        unit: 'photos',
        sourceId: surveyor1Source.id,
        sortOrder: 2,
      },
    ],
    skipDuplicates: true,
  });

  // 3.3 Apollo 15 Lunar Roving Vehicle
  const apollo15Lrv = await prisma.machine.upsert({
    where: { slug: 'apollo-15-lrv' },
    update: {},
    create: {
      slug: 'apollo-15-lrv',
      bodyId: moon.id,
      name: 'Apollo 15 Lunar Roving Vehicle',
      kind: 'ROVER',
      state: 'LEFT_ON_PURPOSE',
      stateSince: '1971-08-02',
      launchYear: 1971,
      arrivalYear: 1971,
      summary: 'The first electric rover driven by humans on the Moon.',
      description:
        'Driven by astronauts David Scott and James Irwin at Hadley Rille, the Lunar Roving Vehicle covered 27.8 kilometers, enabling the recovery of the famous 4-billion-year-old Genesis Rock.',
      missionPurpose: 'Dramatically expand astronaut range and scientific sample collection on the lunar surface.',
      howItWorked:
        'Battery-powered electric rover with four steerable wheels, each driven by its own electric motor.',
      discoveries: 'Enabled exploration of Hadley Rille and recovery of pristine primordial anorthosite crust.',
      currentStatusNote: 'Parked at the Hadley-Apennine landing site.',
      latitude: 26.1322,
      longitude: 3.63386,
      isPublished: true,
    },
  });

  const apollo15Source = await prisma.machineSource.upsert({
    where: {
      machineId_url: {
        machineId: apollo15Lrv.id,
        url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C',
      },
    },
    update: {},
    create: {
      machineId: apollo15Lrv.id,
      title: 'Apollo 15 Lunar Roving Vehicle',
      publisher: 'NASA Space Science Data Coordinated Archive',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C',
    },
  });

  await prisma.machineFact.createMany({
    data: [
      {
        machineId: apollo15Lrv.id,
        label: 'Distance Traveled',
        value: '27.8',
        unit: 'km',
        sourceId: apollo15Source.id,
        sortOrder: 1,
      },
      {
        machineId: apollo15Lrv.id,
        label: 'Top Speed',
        value: '13',
        unit: 'km/h',
        sourceId: apollo15Source.id,
        sortOrder: 2,
      },
    ],
    skipDuplicates: true,
  });

  // 4. Machines - Mars

  // 4.1 Curiosity Rover
  const curiosity = await prisma.machine.upsert({
    where: { slug: 'curiosity' },
    update: {},
    create: {
      slug: 'curiosity',
      bodyId: mars.id,
      name: 'Curiosity Rover (Mars Science Laboratory)',
      kind: 'ROVER',
      state: 'STILL_ACTIVE',
      stateSince: '2012-08-06',
      launchYear: 2011,
      arrivalYear: 2012,
      summary: 'Car-sized robotic laboratory exploring past habitability inside Gale Crater.',
      description:
        'Curiosity landed in Gale Crater using a rocket-powered sky crane on August 6, 2012. It has climbed the lower slopes of Mount Sharp, discovering ancient lakes, river pebbles, and organic molecules.',
      missionPurpose: 'Determine whether Gale Crater ever had environmental conditions suitable for microbial life.',
      howItWorked:
        'Nuclear-powered (MMRTG) six-wheel rocker-bogie rover carrying 10 science instruments including laser spectroscopy (ChemCam) and a chemical lab (SAM).',
      discoveries:
        'Confirmed ancient Mars had liquid fresh-water lakes with neutral pH, carbon, hydrogen, oxygen, nitrogen, and phosphorus.',
      currentStatusNote: 'Active and driving up Mount Sharp as of 2026.',
      latitude: -4.5895,
      longitude: 137.4417,
      isPublished: true,
    },
  });

  const curiositySource1 = await prisma.machineSource.upsert({
    where: {
      machineId_url: {
        machineId: curiosity.id,
        url: 'https://science.nasa.gov/mission/msl-curiosity/',
      },
    },
    update: {},
    create: {
      machineId: curiosity.id,
      title: 'Mars Science Laboratory - Curiosity Overview',
      publisher: 'NASA Science',
      url: 'https://science.nasa.gov/mission/msl-curiosity/',
    },
  });

  const curiositySource2 = await prisma.machineSource.upsert({
    where: {
      machineId_url: {
        machineId: curiosity.id,
        url: 'https://mars.nasa.gov/msl/',
      },
    },
    update: {},
    create: {
      machineId: curiosity.id,
      title: 'Curiosity Mission Updates',
      publisher: 'NASA Jet Propulsion Laboratory',
      url: 'https://mars.nasa.gov/msl/',
    },
  });

  await prisma.machineFact.createMany({
    data: [
      {
        machineId: curiosity.id,
        label: 'Rover Mass',
        value: '899',
        unit: 'kg',
        sourceId: curiositySource1.id,
        sortOrder: 1,
      },
      {
        machineId: curiosity.id,
        label: 'Science Payload Mass',
        value: '75',
        unit: 'kg',
        sourceId: curiositySource1.id,
        sortOrder: 2,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.machineImage.createMany({
    data: [
      {
        machineId: curiosity.id,
        path: '/images/machines/curiosity/self_portrait.webp',
        alt: 'Curiosity rover self-portrait at Mount Sharp on Mars',
        label: 'REAL_PHOTO',
        credit: 'NASA / JPL-Caltech / MSSS',
        sourceUrl: 'https://mars.nasa.gov/msl/multimedia/images/',
        width: 1920,
        height: 1080,
        isCover: true,
        sortOrder: 1,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.logbookEntry.upsert({
    where: {
      machineId_slug: {
        machineId: curiosity.id,
        slug: 'seven-minutes-of-terror',
      },
    },
    update: {},
    create: {
      machineId: curiosity.id,
      slug: 'seven-minutes-of-terror',
      title: 'Seven Minutes of Terror: The Sky Crane Landing',
      summary: 'How Curiosity touched down in Gale Crater suspended from rocket cables.',
      articleMarkdown: `# Seven Minutes of Terror\n\nEntry, descent, and landing on Mars took seven minutes, while radio signals took fourteen minutes to reach Earth...\n\nThe rocket-powered descent stage lowered Curiosity directly onto its wheels.`,
      articleOrigin: 'AUTHORED',
      videoUrl: 'https://images.nasa.gov/details/CuriositySkyCraneDescent',
      videoOrigin: 'AUTHORED',
      videoDurationSec: 300,
      isPublished: true,
      publishedAt: new Date('2012-08-06T00:00:00Z'),
    },
  });

  // 4.2 Perseverance Rover
  const perseverance = await prisma.machine.upsert({
    where: { slug: 'perseverance' },
    update: {},
    create: {
      slug: 'perseverance',
      bodyId: mars.id,
      name: 'Perseverance Rover (Mars 2020)',
      kind: 'ROVER',
      state: 'STILL_ACTIVE',
      stateSince: '2021-02-18',
      launchYear: 2020,
      arrivalYear: 2021,
      summary: 'Seeking signs of ancient life and collecting rock core samples in Jezero Crater.',
      description:
        'Perseverance landed in Jezero Crater on February 18, 2021. It carries an advanced drill to seal geological core samples in ultra-clean tubes for future return to Earth.',
      missionPurpose: 'Identify ancient habitable environments and seek biosignatures of ancient microbial life.',
      howItWorked:
        'Powered by an MMRTG, with Terrain-Relative Navigation, MOXIE oxygen generation, and PIXL/SHERLOC spectroscopic instruments.',
      discoveries:
        'Generated breathable oxygen from Mars atmosphere using MOXIE and confirmed Jezero Crater was once filled with a lake and river delta.',
      currentStatusNote: 'Active in Jezero Crater caching samples.',
      latitude: 18.4447,
      longitude: 77.4508,
      isPublished: true,
    },
  });

  const perseveranceSource = await prisma.machineSource.upsert({
    where: {
      machineId_url: {
        machineId: perseverance.id,
        url: 'https://mars.nasa.gov/mars2020/',
      },
    },
    update: {},
    create: {
      machineId: perseverance.id,
      title: 'Mars 2020 Perseverance Mission',
      publisher: 'NASA Jet Propulsion Laboratory',
      url: 'https://mars.nasa.gov/mars2020/',
    },
  });

  await prisma.machineFact.createMany({
    data: [
      {
        machineId: perseverance.id,
        label: 'Rover Mass',
        value: '1025',
        unit: 'kg',
        sourceId: perseveranceSource.id,
        sortOrder: 1,
      },
      {
        machineId: perseverance.id,
        label: 'Sample Tubes Capacity',
        value: '43',
        unit: 'tubes',
        sourceId: perseveranceSource.id,
        sortOrder: 2,
      },
    ],
    skipDuplicates: true,
  });

  // 4.3 Ingenuity Mars Helicopter
  const ingenuity = await prisma.machine.upsert({
    where: { slug: 'ingenuity' },
    update: {},
    create: {
      slug: 'ingenuity',
      bodyId: mars.id,
      name: 'Ingenuity Mars Helicopter',
      kind: 'HELICOPTER',
      state: 'JOB_FINISHED',
      stateSince: '2024-01-25',
      launchYear: 2020,
      arrivalYear: 2021,
      summary: 'First powered, controlled extraterrestrial flight in human history.',
      description:
        'Originally designed as a five-flight technology demonstration, Ingenuity exceeded all expectations by flying 72 times across Jezero Crater over nearly three years.',
      missionPurpose: 'Demonstrate powered flight in the extremely thin Martian atmosphere (1% density of Earth).',
      howItWorked:
        'Counter-rotating carbon-fiber rotors spinning at ~2,400 RPM, solar-charged lithium-ion batteries, and autonomous navigation.',
      discoveries: 'Proved rotorcraft can scout terrain and travel ahead of rovers on Mars.',
      currentStatusNote: 'Rotor blade damaged on 72nd flight; resting permanently at Valinor Hills.',
      latitude: 18.4447,
      longitude: 77.4508,
      isPublished: true,
    },
  });

  const ingenuitySource = await prisma.machineSource.upsert({
    where: {
      machineId_url: {
        machineId: ingenuity.id,
        url: 'https://mars.nasa.gov/technology/helicopter/',
      },
    },
    update: {},
    create: {
      machineId: ingenuity.id,
      title: 'Ingenuity Mars Helicopter Overview',
      publisher: 'NASA Jet Propulsion Laboratory',
      url: 'https://mars.nasa.gov/technology/helicopter/',
    },
  });

  await prisma.machineFact.createMany({
    data: [
      {
        machineId: ingenuity.id,
        label: 'Total Flights Completed',
        value: '72',
        unit: 'flights',
        sourceId: ingenuitySource.id,
        sortOrder: 1,
      },
      {
        machineId: ingenuity.id,
        label: 'Total Distance Flown',
        value: '17.0',
        unit: 'km',
        sourceId: ingenuitySource.id,
        sortOrder: 2,
      },
      {
        machineId: ingenuity.id,
        label: 'Total Flight Time',
        value: '128.8',
        unit: 'minutes',
        sourceId: ingenuitySource.id,
        sortOrder: 3,
      },
    ],
    skipDuplicates: true,
  });

  // 4.4 Viking 1 Lander
  const viking1 = await prisma.machine.upsert({
    where: { slug: 'viking-1' },
    update: {},
    create: {
      slug: 'viking-1',
      bodyId: mars.id,
      name: 'Viking 1 Lander',
      kind: 'LANDER',
      state: 'STOPPED_ANSWERING',
      stateSince: '1982-11-13',
      launchYear: 1975,
      arrivalYear: 1976,
      summary: 'First long-duration surface mission to Mars, transmitting the first color panoramas.',
      description:
        'Viking 1 touched down in Chryse Planitia on July 20, 1976. It operated for more than six years until communications ended in November 1982.',
      missionPurpose: 'Obtain high-resolution imagery, characterize atmosphere and surface, and test for life.',
      howItWorked:
        'Stationary lander powered by two RTGs, with a surface sampler arm, biology laboratory, and meteorology boom.',
      discoveries: 'Conducted the first in-situ biology experiments and recorded detailed Martian weather cycles.',
      currentStatusNote: 'Resting in Chryse Planitia.',
      latitude: 22.27,
      longitude: -47.95,
      isPublished: true,
    },
  });

  const viking1Source = await prisma.machineSource.upsert({
    where: {
      machineId_url: {
        machineId: viking1.id,
        url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C',
      },
    },
    update: {},
    create: {
      machineId: viking1.id,
      title: 'Viking 1 Lander Details',
      publisher: 'NASA Space Science Data Coordinated Archive',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C',
    },
  });

  await prisma.machineFact.createMany({
    data: [
      {
        machineId: viking1.id,
        label: 'Operational Duration',
        value: '2307',
        unit: 'days',
        sourceId: viking1Source.id,
        sortOrder: 1,
      },
    ],
    skipDuplicates: true,
  });

  // 5. Quizzes & Badges (Games Module)

  // 5.1 Moon Explorer Quiz
  const moonQuiz = await prisma.quiz.upsert({
    where: { slug: 'moon-explorer' },
    update: {},
    create: {
      slug: 'moon-explorer',
      title: 'Moon Explorer Quiz',
      level: 'EXPLORER',
      bodyId: moon.id,
      isPublished: true,
    },
  });

  const mq1 = await prisma.quizQuestion.create({
    data: {
      quizId: moonQuiz.id,
      prompt: 'In which lunar mare did Apollo 11 make humanity’s first crewed landing?',
      explanation: 'Apollo 11 landed in Mare Tranquillitatis (the Sea of Tranquility) on July 20, 1969.',
      sortOrder: 1,
      options: {
        create: [
          { label: 'Mare Tranquillitatis', isCorrect: true, sortOrder: 1 },
          { label: 'Oceanus Procellarum', isCorrect: false, sortOrder: 2 },
          { label: 'Mare Imbrium', isCorrect: false, sortOrder: 3 },
          { label: 'Mare Serenitatis', isCorrect: false, sortOrder: 4 },
        ],
      },
    },
  });

  const mq2 = await prisma.quizQuestion.create({
    data: {
      quizId: moonQuiz.id,
      prompt: 'What robotic probe made the first American soft landing on the Moon in 1966?',
      explanation: 'Surveyor 1 touched down softly on the Moon on June 2, 1966, proving the lunar regolith was solid.',
      sortOrder: 2,
      options: {
        create: [
          { label: 'Surveyor 1', isCorrect: true, sortOrder: 1 },
          { label: 'Ranger 7', isCorrect: false, sortOrder: 2 },
          { label: 'Lunar Orbiter 1', isCorrect: false, sortOrder: 3 },
          { label: 'Pioneer 4', isCorrect: false, sortOrder: 4 },
        ],
      },
    },
  });

  // 5.2 Mars Explorer Quiz
  const marsQuiz = await prisma.quiz.upsert({
    where: { slug: 'mars-explorer' },
    update: {},
    create: {
      slug: 'mars-explorer',
      title: 'Mars Explorer Quiz',
      level: 'EXPLORER',
      bodyId: mars.id,
      isPublished: true,
    },
  });

  const marsQ1 = await prisma.quizQuestion.create({
    data: {
      quizId: marsQuiz.id,
      prompt: 'What was the historic achievement of the Ingenuity helicopter on Mars?',
      explanation: 'Ingenuity completed the first powered, controlled flight on another planet on April 19, 2021.',
      sortOrder: 1,
      options: {
        create: [
          { label: 'First powered controlled flight on another planet', isCorrect: true, sortOrder: 1 },
          { label: 'First spacecraft to land on Mars', isCorrect: false, sortOrder: 2 },
          { label: 'First wheeled rover on Mars', isCorrect: false, sortOrder: 3 },
          { label: 'First drilling sample returned to Earth', isCorrect: false, sortOrder: 4 },
        ],
      },
    },
  });

  const marsQ2 = await prisma.quizQuestion.create({
    data: {
      quizId: marsQuiz.id,
      prompt: 'Where did the Curiosity rover land on Mars in 2012?',
      explanation: 'Curiosity landed inside Gale Crater to investigate the lower layers of Mount Sharp.',
      sortOrder: 2,
      options: {
        create: [
          { label: 'Gale Crater', isCorrect: true, sortOrder: 1 },
          { label: 'Jezero Crater', isCorrect: false, sortOrder: 2 },
          { label: 'Gusev Crater', isCorrect: false, sortOrder: 3 },
          { label: 'Olympus Mons', isCorrect: false, sortOrder: 4 },
        ],
      },
    },
  });

  // 5.2.1 Seed Complete Authentic Quizzes from see_quizzz.sql
  const candidateSqlPaths = [
    path.resolve(process.cwd(), 'see_quizzz.sql'),
    path.resolve(__dirname, 'see_quizzz.sql'),
    path.resolve(process.cwd(), 'prisma', 'see_quizzz.sql'),
    path.resolve(process.cwd(), 'data-seed', 'see_quizzz.sql'),
  ];
  const quizSqlPath = candidateSqlPaths.find((p) => fs.existsSync(p));
  if (quizSqlPath) {
    const quizSql = fs.readFileSync(quizSqlPath, 'utf8');
    await prisma.$executeRawUnsafe(quizSql);
  }

  // 5.3 Badges
  await prisma.badge.upsert({
    where: { slug: 'first-steps' },
    update: {},
    create: {
      slug: 'first-steps',
      name: 'First Steps',
      description: 'Awarded for completing your first Space Legacy quiz.',
      iconKey: 'footprint',
      rule: 'QUIZ_COMPLETED_COUNT',
      threshold: 1,
      sortOrder: 1,
    },
  });

  await prisma.badge.upsert({
    where: { slug: 'lunar-scholar' },
    update: {},
    create: {
      slug: 'lunar-scholar',
      name: 'Lunar Scholar',
      description: 'Awarded for mastering all Moon quizzes.',
      iconKey: 'moon',
      rule: 'BODY_ALL_QUIZZES',
      threshold: 1,
      bodyId: moon.id,
      sortOrder: 2,
    },
  });

  await prisma.badge.upsert({
    where: { slug: 'martian-pioneer' },
    update: {},
    create: {
      slug: 'martian-pioneer',
      name: 'Martian Pioneer',
      description: 'Awarded for mastering all Mars quizzes.',
      iconKey: 'rocket',
      rule: 'BODY_ALL_QUIZZES',
      threshold: 1,
      bodyId: mars.id,
      sortOrder: 3,
    },
  });

  await prisma.badge.upsert({
    where: { slug: 'perfectionist' },
    update: {},
    create: {
      slug: 'perfectionist',
      name: 'Perfectionist',
      description: 'Awarded for achieving a perfect 100% score on 3 quizzes.',
      iconKey: 'star',
      rule: 'PERFECT_SCORE_COUNT',
      threshold: 3,
      sortOrder: 4,
    },
  });

  // eslint-disable-next-line no-console
  console.log('Successfully completed authentic NASA database seed.');
}

if (process.argv[1]?.endsWith('seed.ts')) {
  main()
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Seed execution error:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
