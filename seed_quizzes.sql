--
-- Space Legacy - Official Quiz Dataset Seeder (see_quizzz.sql)
-- Compatible with PostgreSQL and Prisma schema (prisma/schema.prisma)
--

BEGIN;

-- Quiz: Surveyor 3 et Atterrisseurs Lunaires (Explorateur) (atterrisseurs-robotises-explorer)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'atterrisseurs-robotises-explorer', 'Surveyor 3 et Atterrisseurs Lunaires (Explorateur)', 'EXPLORER'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'moon' LIMIT 1), (SELECT "id" FROM "machines" WHERE "slug" = 'surveyor-1' LIMIT 1), true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('44951aee-1126-4f49-b128-151837b148f0', '2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'Sur quel astre l''atterrisseur robotisé Surveyor 3 s''est-il posé ?', 'Surveyor 3 est une sonde robotisée envoyée sur la Lune dans les années 1960 pour tester les atterrissages en douceur.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1c3af55e-cc0f-4604-8967-33d282f44032', '44951aee-1126-4f49-b128-151837b148f0', 'La Lune', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8d6f1483-0198-42cd-b1e2-20169500f16f', '44951aee-1126-4f49-b128-151837b148f0', 'Mars', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dac869c3-e34b-4c05-ae7b-58f8a65ee561', '44951aee-1126-4f49-b128-151837b148f0', 'Vénus', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('49bb81fe-7e1b-40c3-9b2d-88f0d2cd92ae', '44951aee-1126-4f49-b128-151837b148f0', 'Mercure', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('1507ab37-9fbe-4834-a779-5258fe6f59b7', '2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'Vrai ou faux : Surveyor 3 transportait des astronautes à son bord lors de son atterrissage.', 'Faux, Surveyor 3 était une sonde entièrement robotisée sans équipage, envoyée avant les missions habitées Apollo.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c7f9df82-4452-4494-92f9-60e680329f99', '1507ab37-9fbe-4834-a779-5258fe6f59b7', 'Vrai', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('51db6fc4-196b-451e-b29b-57843a8e52aa', '1507ab37-9fbe-4834-a779-5258fe6f59b7', 'Faux', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c443a80a-c81e-43cd-888b-9887a9a1e686', '2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'Quel outil spécial Surveyor 3 possédait-il pour la première fois afin d''étudier le sol lunaire ?', 'Surveyor 3 transportait pour la première fois un instrument d''échantillonnage capable de creuser le sol lunaire.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('94fcecf4-5480-4baa-b510-c49720b857c3', 'c443a80a-c81e-43cd-888b-9887a9a1e686', 'Un laser géant', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d724e4fa-16f7-487a-b92a-1d0d6211c43b', 'c443a80a-c81e-43cd-888b-9887a9a1e686', 'Un bras pour creuser et prélever le sol', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('893c780c-d647-482b-87ff-937b7de55cde', 'c443a80a-c81e-43cd-888b-9887a9a1e686', 'Une foreuse nucléaire', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fb7772c3-a1de-40a1-a5cb-1d18525137f6', 'c443a80a-c81e-43cd-888b-9887a9a1e686', 'Des roues tout-terrain', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e5e3afe3-7fc7-4944-95b0-b3d1f37ecd89', '2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'Quelles affirmations sont vraies à propos de Surveyor 3 ? (Plusieurs bonnes réponses)', 'Lancé en 1967 pour valider les atterrissages lunaires en douceur, Surveyor 3 a reçu la visite des astronautes d''Apollo 12 en 1969.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b2c0d664-18b7-444d-823b-ce23678f0547', 'e5e3afe3-7fc7-4944-95b0-b3d1f37ecd89', 'Il a été envoyé dans les années 1960 ET Il devait prouver qu''on pouvait atterrir en douceur ET Des astronautes d''Apollo 12 lui ont rendu visite', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0f45925f-06e9-49cb-b796-772306e9778d', 'e5e3afe3-7fc7-4944-95b0-b3d1f37ecd89', 'Il est revenu sur Terre par ses propres moyens ET Il a exploré les anneaux de Saturne', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a57b0b0a-3a43-4ed9-a565-50c7bf1faf66', 'e5e3afe3-7fc7-4944-95b0-b3d1f37ecd89', 'Il a été envoyé dans les années 1960', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('7344d0ef-4507-48cb-924c-80ca52d8fea2', '2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'Que s''est-il passé d''étonnant juste avant que Surveyor 3 ne s''immobilise sur la Lune ?', 'Son moteur principal ne s''étant pas coupé à temps, Surveyor 3 a rebondi deux fois sur la surface lunaire avant de se poser.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e7b38a9b-7d9a-4ee6-9544-b5ae47f7ff3e', '7344d0ef-4507-48cb-924c-80ca52d8fea2', 'Il a rebondi deux fois sur le sol', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3b85a3f5-61c3-4777-88ee-03d01b5fc90e', '7344d0ef-4507-48cb-924c-80ca52d8fea2', 'Il s''est envolé vers Mars', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ea27e43c-b17b-4e59-a76b-27734f0c5eb3', '7344d0ef-4507-48cb-924c-80ca52d8fea2', 'Il a roulé sur 10 kilomètres', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('df98dabf-ae56-4533-ad8d-3b2d87764012', '7344d0ef-4507-48cb-924c-80ca52d8fea2', 'Il a plongé dans un lac', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('0e5b7ca8-c2b7-46ff-abfd-1b48eb8fb367', '2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'Combien de fois Surveyor 3 a-t-il rebondi sur la Lune lors de son atterrissage ?', 'Surveyor 3 a rebondi exactement 2 fois sur la surface lunaire (d''abord à 10 mètres, puis à 3 mètres de haut).', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3c0ed11b-01f9-4a4c-a220-c0e7f2ed06fc', '0e5b7ca8-c2b7-46ff-abfd-1b48eb8fb367', '2 rebonds', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('74a3ef22-b458-47da-8104-344a59ff8c9e', '0e5b7ca8-c2b7-46ff-abfd-1b48eb8fb367', '3 rebonds', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('85ab06f6-8aa1-4dbd-a743-702871dbf808', '0e5b7ca8-c2b7-46ff-abfd-1b48eb8fb367', '1 rebonds', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5910e376-2f57-4fbd-97ce-d83706f3c60d', '0e5b7ca8-c2b7-46ff-abfd-1b48eb8fb367', '5 rebonds', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('df0f30d1-2f5d-4e9e-980f-e5c99b03760d', '2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'Lors de son premier rebond, Surveyor 3 est monté à 10 mètres de haut. À quoi cela correspond-il ?', 'Un rebond de 10 mètres correspond environ à la hauteur d''un immeuble de 3 étages.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c3c5ce39-101c-44af-af45-ae988fae1fb5', 'df0f30d1-2f5d-4e9e-980f-e5c99b03760d', 'La hauteur d''un immeuble de 3 étages', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0dfbd48d-0afc-480f-a9df-dbede0c3eb32', 'df0f30d1-2f5d-4e9e-980f-e5c99b03760d', 'La hauteur d''une petite chaise', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('60ce6196-11cf-4597-b91c-2a19eb5e406c', 'df0f30d1-2f5d-4e9e-980f-e5c99b03760d', 'La hauteur de la tour Eiffel', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4bc289d2-e305-4854-b010-3bece9f1038a', 'df0f30d1-2f5d-4e9e-980f-e5c99b03760d', 'La longueur d''un crayon', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('0cdb55d0-7b15-42f3-8a4a-8d689e9cb482', '2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'Vrai ou faux : La Lune est environ 4 fois plus petite en diamètre que la Terre.', 'Vrai, le diamètre de la Lune représente environ un quart (1/4) de celui de la Terre.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4cce917b-a188-45cb-a506-8e934cb0ef0c', '0cdb55d0-7b15-42f3-8a4a-8d689e9cb482', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b6df817b-4af4-4c39-8eb9-ecbedce388f4', '0cdb55d0-7b15-42f3-8a4a-8d689e9cb482', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('67882736-9cb6-4717-b691-3047c3fe45ac', '2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'Quelle mission habitée s''est posée tout près de Surveyor 3 en 1969 ?', 'En novembre 1969, les astronautes d''Apollo 12 ont posé leur module lunaire Intrepid tout près de Surveyor 3.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2e558d3d-ca46-415c-9798-762c11830575', '67882736-9cb6-4717-b691-3047c3fe45ac', 'Apollo 11', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ff897566-a432-4fba-bbbf-893add9a6840', '67882736-9cb6-4717-b691-3047c3fe45ac', 'Apollo 12', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6d7b07ce-382a-4a41-af77-22229bb449c7', '67882736-9cb6-4717-b691-3047c3fe45ac', 'Apollo 15', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c0deec43-a9bb-4cfa-8a53-b17df57945b3', '67882736-9cb6-4717-b691-3047c3fe45ac', 'Apollo 17', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9d51c420-560a-43fa-bfee-328be3642fb6', '2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'Remets ces événements de l''histoire de Surveyor 3 dans l''ordre chronologique.', 'Surveyor 3 a été lancé le 17 avril 1967, a atterri le 20 avril 1967 et a été visité par Apollo 12 en novembre 1969.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6bb028f7-c656-4515-a817-47543cfc760f', '9d51c420-560a-43fa-bfee-328be3642fb6', '1. Lancement de Surveyor 3 depuis la Terre ➔ 2. Atterrissage avec deux rebonds sur la Lune ➔ 3. Visite des astronautes d''Apollo 12', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('805b647b-f53b-4aa9-bf03-a87b244980bd', '9d51c420-560a-43fa-bfee-328be3642fb6', '1. Visite des astronautes d''Apollo 12 ➔ 2. Atterrissage avec deux rebonds sur la Lune ➔ 3. Lancement de Surveyor 3 depuis la Terre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ab86ee47-dd5f-4066-8193-4799723ed2b8', '9d51c420-560a-43fa-bfee-328be3642fb6', '1. Atterrissage avec deux rebonds sur la Lune ➔ 2. Lancement de Surveyor 3 depuis la Terre ➔ 3. Visite des astronautes d''Apollo 12', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('6d0edeff-0ce0-4f86-8cc0-29eb8cb82afe', '2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'Que voit-on sur les photos prises à la surface de la Lune par les missions Apollo et Surveyor ? (Plusieurs bonnes réponses)', 'Sans atmosphère ni eau liquide, la Lune présente un paysage gris fait de poussière, de roches et de cratères sous un ciel noir.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4c5786d0-e200-4f6a-a34e-1b69ab2e6cd5', '6d0edeff-0ce0-4f86-8cc0-29eb8cb82afe', 'Un ciel tout noir ET Des roches et une fine poussière grise ET Des cratères', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('63755dfa-c753-4b30-bcb8-c982edb78f85', '6d0edeff-0ce0-4f86-8cc0-29eb8cb82afe', 'Des forêts et des rivières ET Des nuages de pluie', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2f44c264-4bd0-4942-afc6-72ea38105eb2', '6d0edeff-0ce0-4f86-8cc0-29eb8cb82afe', 'Un ciel tout noir', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e6c9e49b-53db-4f1b-b286-31fb763f94fb', '2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'Jusqu''à quelle distance le bras de Surveyor 3 pouvait-il s''étendre pour toucher le sol ?', 'L''instrument d''échantillonnage de surface pouvait s''étendre jusqu''à 1,5 mètre (5 pieds) de l''atterrisseur.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('08754af0-50f5-4c5a-82b5-10176305a767', 'e6c9e49b-53db-4f1b-b286-31fb763f94fb', '15 centimètres', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c2653398-0452-400b-8a4f-05a14c9e07a0', 'e6c9e49b-53db-4f1b-b286-31fb763f94fb', '1,5 mètre', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('735e57ba-1f36-4b1d-803a-533e479ce9a9', 'e6c9e49b-53db-4f1b-b286-31fb763f94fb', '50 mètres', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a9a23164-0a9f-416e-9646-b8050202c579', 'e6c9e49b-53db-4f1b-b286-31fb763f94fb', '1 kilomètre', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('b2d23ff8-3eb0-4421-81d6-0489192506fb', '2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'Associe chaque élément spatial à son rôle.', 'Surveyor 3 était l''atterrisseur robotisé, Intrepid le module lunaire d''Apollo 12, et la Lune leur destination.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9e535c65-44b2-4857-afd9-8934e13b9e1e', 'b2d23ff8-3eb0-4421-81d6-0489192506fb', 'Surveyor 3 = La sonde robotisée qui a rebondi deux fois | Intrepid = Le module lunaire des astronautes d''Apollo 12 | La Lune = L''astre rocheux où les sondes se posent', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dc313fdd-e677-4be2-a271-e2ec72bc2997', 'b2d23ff8-3eb0-4421-81d6-0489192506fb', 'Surveyor 3 = Le module lunaire des astronautes d''Apollo 12 | Intrepid = L''astre rocheux où les sondes se posent | La Lune = La sonde robotisée qui a rebondi deux fois', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('ea9b6be7-c2e1-436c-8708-681c0b726e20', '2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'Pourquoi le dernier contact avec Surveyor 3 a-t-il eu lieu peu après le début de la nuit lunaire ?', 'Le dernier signal de Surveyor 3 a été reçu le 4 mai 1967, deux jours après le début de la glaciale nuit lunaire.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('01f856ba-d426-4023-989c-c1601c26dd62', 'ea9b6be7-c2e1-436c-8708-681c0b726e20', 'Parce que la sonde manquait d''énergie solaire et subissait le froid', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('19d76275-5144-4b25-b486-06bf99c9f827', 'ea9b6be7-c2e1-436c-8708-681c0b726e20', 'Parce que des extraterrestres l''ont éteinte', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a74d912b-584b-4349-9751-c0c08ce177ea', 'ea9b6be7-c2e1-436c-8708-681c0b726e20', 'Parce qu''elle est rentrée sur Terre', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8136b8c8-f2d1-4f80-8132-84647b5f3a1a', 'ea9b6be7-c2e1-436c-8708-681c0b726e20', 'Parce qu''il s''est mis à pleuvoir', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('563c8cdd-1098-4bf6-9035-fc34359feed5', '2a31d65b-80ee-4fa5-96f5-9eb6acc3ea85', 'Quels pays avaient réussi à poser un engin sur la Lune en janvier 2024 selon les données de la NASA ? (Plusieurs bonnes réponses)', 'En janvier 2024, quatre nations avaient réussi un atterrissage sur la Lune : l''URSS, les États-Unis, l''Inde et la Chine.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('825c2220-7eed-4d55-af7f-4406431d4dbd', '563c8cdd-1098-4bf6-9035-fc34359feed5', 'États-Unis ET URSS ET Chine ET Inde', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e400986c-64b6-4c5c-9540-8ca72f3cf1b9', '563c8cdd-1098-4bf6-9035-fc34359feed5', 'Brésil', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3b0216db-0fbd-4782-b730-226844146dec', '563c8cdd-1098-4bf6-9035-fc34359feed5', 'États-Unis', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Surveyor 3 et Atterrisseurs Lunaires (Expert) (atterrisseurs-robotises-expert)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'atterrisseurs-robotises-expert', 'Surveyor 3 et Atterrisseurs Lunaires (Expert)', 'EXPERT'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'moon' LIMIT 1), (SELECT "id" FROM "machines" WHERE "slug" = 'surveyor-1' LIMIT 1), true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9f704fb9-da97-4947-8955-cc2bef78b7d7', 'ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'Lors de l''approche finale de Surveyor 3, quel phénomène physique a provoqué le maintien intempestif de la poussée du moteur principal sous 4,3 m d''altitude ?', 'Des roches hautement réfléchissantes ont perturbé le radar de descente, empêchant l''envoi de l''ordre d''extinction du moteur principal à 4,3 m (14 pieds).', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2671482c-882f-4f02-8381-ce93c70b27ab', '9f704fb9-da97-4947-8955-cc2bef78b7d7', 'La forte réflectivité des roches lunaires qui a saturé ou trompé le radar de descente', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9c0e4dae-43ad-43cf-8508-5c821956b1cc', '9f704fb9-da97-4947-8955-cc2bef78b7d7', 'L''accumulation de poussière électrostatique sur les tuyères', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e5e2feb7-3c88-4270-91b6-145860f93ddc', '9f704fb9-da97-4947-8955-cc2bef78b7d7', 'La perte de verrouillage gyroscopique due à une éruption solaire', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c78029c3-58ae-49ec-a089-6c9a816aec29', '9f704fb9-da97-4947-8955-cc2bef78b7d7', 'Le gel des conduites d''ergols durant la descente', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('88ab02d5-1997-40e5-8fd9-8dbf2397d5f5', 'ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'Si l''on additionne les altitudes maximales atteintes lors des deux rebonds successifs de Surveyor 3 (en pieds), quelle hauteur cumulée obtient-on ?', 'Le premier rebond a culminé à 33 pieds (10 m) et le second à 10 pieds (3 m), soit une hauteur cumulée de 43 pieds.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('09fedede-a267-4d55-ac0a-372d27a86918', '88ab02d5-1997-40e5-8fd9-8dbf2397d5f5', '43 pieds', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('946321d7-0a20-49f9-bbb3-d032bd315b36', '88ab02d5-1997-40e5-8fd9-8dbf2397d5f5', '65 pieds', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6d2631ed-29ba-427e-a066-fb138d91a2d7', '88ab02d5-1997-40e5-8fd9-8dbf2397d5f5', '22 pieds', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('211bdc70-454b-49e4-b46e-1250b56f760b', '88ab02d5-1997-40e5-8fd9-8dbf2397d5f5', '53 pieds', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f2925a91-24a7-4188-b3e0-7d6f35f6ea2d', 'ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'Quelle proportion du rayon lunaire (du centre vers la surface) le noyau de la Lune occupe-t-il selon les schémas comparatifs de la NASA ?', 'Le noyau lunaire occupe une fraction plus faible de l''intérieur de l''astre que sur Terre, ne s''étendant que sur environ 20 % de la distance entre le centre et la surface.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('828758a9-0522-4959-be61-c871c820b309', 'f2925a91-24a7-4188-b3e0-7d6f35f6ea2d', 'Environ 20 %', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3dd447c1-826e-43c0-84ab-afe496d25f7d', 'f2925a91-24a7-4188-b3e0-7d6f35f6ea2d', 'Environ 55 %', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('81bea6b5-00ad-40a1-bced-964d9053215f', 'f2925a91-24a7-4188-b3e0-7d6f35f6ea2d', 'Environ 5 %', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('76e7dacb-85b8-4d88-9dd9-4d880ce8ab25', 'f2925a91-24a7-4188-b3e0-7d6f35f6ea2d', 'Environ 75 %', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('8b8d1351-0f64-48ad-9f5c-a6ad73f988b5', 'ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'Vrai ou faux : Surveyor 3 a cessé toute communication exactement au moment du coucher du Soleil sur son site d''atterrissage.', 'Faux, le dernier contact avec Surveyor 3 a eu lieu le 4 mai 1967, soit deux jours après le début de la nuit lunaire.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('491ea556-9cd8-4d18-97e8-91f328b12c20', '8b8d1351-0f64-48ad-9f5c-a6ad73f988b5', 'Vrai', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2f1da4b3-815a-49ee-82c3-cae31993b839', '8b8d1351-0f64-48ad-9f5c-a6ad73f988b5', 'Faux', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('de9a659e-0762-4210-b746-cf0c9a00ad81', 'ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'Quel jalon opérationnel le posé d''Apollo 12 à moins de 200 mètres de Surveyor 3 a-t-il démontré ?', 'En posant Intrepid à environ 180 m (197 yards) de Surveyor 3, visible au-delà du rempart du cratère, Apollo 12 a démontré un atterrissage de haute précision à distance de marche.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('73c79e05-c479-4e1f-a8b7-076255e36cd6', 'de9a659e-0762-4210-b746-cf0c9a00ad81', 'La maîtrise de l''atterrissage habité de précision à proximité immédiate d''un repère au sol', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('580f8840-0cfe-4ca4-9e49-97ff5f8dfa1b', 'de9a659e-0762-4210-b746-cf0c9a00ad81', 'Le ravitaillement automatique d''un module lunaire en ergols', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7bf04c7f-bd1a-4afb-b5d1-40dcd67460bd', 'de9a659e-0762-4210-b746-cf0c9a00ad81', 'Le redécollage d''une sonde robotisée après trois ans d''inactivité', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0539f0bc-1a6f-4c02-97ac-adb3da2d6254', 'de9a659e-0762-4210-b746-cf0c9a00ad81', 'L''utilisation d''un rover pressurisé sur plus de 20 km', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('2a93c98e-bf72-487c-af29-57c84ed5f97e', 'ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'Quelles caractéristiques géologiques expliquent la formation des dômes de Gruithuisen sur la Lune ? (Plusieurs bonnes réponses)', 'Les dômes de Gruithuisen sont des collines volcaniques cratérisées formées par des laves siliciques visqueuses qui peinaient à s''étaler.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ba6d5791-8d75-4d2d-836a-b72893eb6bda', '2a93c98e-bf72-487c-af29-57c84ed5f97e', 'Des éruptions de laves siliciques ET Une lave qui ne s''écoulait pas facilement vers l''extérieur ET La formation de collines volcaniques cratérisées en dôme', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6669097f-08df-4e50-8ee3-752c56c7c78c', '2a93c98e-bf72-487c-af29-57c84ed5f97e', 'L''érosion par d''anciens glaciers polaires ET L''impact d''une comète de glace pure', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('788409ec-2936-4c6f-9787-16897785766a', '2a93c98e-bf72-487c-af29-57c84ed5f97e', 'Des éruptions de laves siliciques', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('44b18676-e9d1-4f01-a194-c780c6ade3c9', 'ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'Comment la rotation synchrone de la Lune s''est-elle stabilisée au cours de son histoire ?', 'Une fois le bourrelet de marée aligné et immobile par rapport à la Terre, aucune énergie n''était plus dissipée par ce mécanisme et la vitesse de rotation s''est stabilisée.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('eb847d7c-10ed-4c4b-9ef8-ab430bd6d49f', '44b18676-e9d1-4f01-a194-c780c6ade3c9', 'Lorsque le bourrelet lunaire a cessé de se déplacer par rapport à la Terre, arrêtant la dissipation d''énergie', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5bdc8dca-f8da-4171-8f4a-95d41b82cd9d', '44b18676-e9d1-4f01-a194-c780c6ade3c9', 'Par le freinage atmosphérique des couches hautes de la Terre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2558a9ec-4cc9-40ce-bbe5-ec62e20e6988', '44b18676-e9d1-4f01-a194-c780c6ade3c9', 'Grâce au champ magnétique dipolaire permanent du noyau lunaire', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('879d4acc-c8de-43ab-8e1c-cadfa5c297f7', '44b18676-e9d1-4f01-a194-c780c6ade3c9', 'Par l''impact tardif du bassin Orientale', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('cbc6975b-1503-4d1c-8df7-9b9d747efe67', 'ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'Ordonne chronologiquement les phases critiques de l''arrivée de Surveyor 3 sur la Lune le 20 avril 1967.', 'La réflexion des roches a trompé le radar, empêchant la coupure moteur à 4,3 m et entraînant un rebond à 10 m suivi d''un second à 3 m.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e1915198-dbfb-4807-8ab1-509d1f0d2526', 'cbc6975b-1503-4d1c-8df7-9b9d747efe67', '1. Perturbation du radar de descente par des roches réfléchissantes ➔ 2. Maintien de la poussée du moteur principal sous 4,3 mètres d''altitude ➔ 3. Premier rebond culminant à 10 mètres (33 pieds) ➔ 4. Second rebond culminant à 3 mètres (10 pieds)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b4fa225b-ee09-4514-a6d2-e1cbe34e7b0e', 'cbc6975b-1503-4d1c-8df7-9b9d747efe67', '1. Second rebond culminant à 3 mètres (10 pieds) ➔ 2. Premier rebond culminant à 10 mètres (33 pieds) ➔ 3. Maintien de la poussée du moteur principal sous 4,3 mètres d''altitude ➔ 4. Perturbation du radar de descente par des roches réfléchissantes', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2a13ca8b-ee69-4f8d-a262-832f0efa0d4b', 'cbc6975b-1503-4d1c-8df7-9b9d747efe67', '1. Maintien de la poussée du moteur principal sous 4,3 mètres d''altitude ➔ 2. Perturbation du radar de descente par des roches réfléchissantes ➔ 3. Premier rebond culminant à 10 mètres (33 pieds) ➔ 4. Second rebond culminant à 3 mètres (10 pieds)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('964c0501-e362-445b-9a9c-7128726ec64d', 'ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'Quelle technique de mesure les deux sondes Ebb et Flow de la mission GRAIL (mars-mai 2012) ont-elles utilisée pour cartographier le champ de gravité lunaire ?', 'La mission GRAIL (Ebb et Flow) a utilisé des mesures micro-ondes de haute précision entre les deux sondes pour cartographier les variations gravitationnelles lunaires.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7e4fbd6c-c135-43cd-b6f0-107b56d28c5b', '964c0501-e362-445b-9a9c-7128726ec64d', 'Des mesures micro-ondes très précises entre les deux engins spatiaux', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f021afca-02d4-4904-8c18-db51a153aadf', '964c0501-e362-445b-9a9c-7128726ec64d', 'Des tirs laser depuis l''observatoire de Mauna Kea', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('284d5789-93b9-4eaa-9adc-6a689b47651c', '964c0501-e362-445b-9a9c-7128726ec64d', 'Des magnétomètres à protons en surface', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('78c7914d-e241-41af-958e-6917a58db556', '964c0501-e362-445b-9a9c-7128726ec64d', 'La spectroscopie gamma des roches basaltiques', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('8bf3408c-0de3-4ae3-82e7-08ede4b7ac49', 'ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'Vrai ou faux : Durant une éclipse lunaire, la NASA éteint tous les instruments de l''orbiteur LRO sans exception, y compris le radiomètre Diviner.', 'Faux, la NASA laisse actif l''instrument Diviner pour observer comment la surface lunaire réagit au refroidissement rapide durant l''éclipse.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('893c57df-1888-49e2-9d5a-3181c43e3a3c', '8bf3408c-0de3-4ae3-82e7-08ede4b7ac49', 'Vrai', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3a822359-a812-47a0-b358-8e6177fe349e', '8bf3408c-0de3-4ae3-82e7-08ede4b7ac49', 'Faux', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('551f253d-314d-4dc0-83ff-c1fba1c3c1ff', 'ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'Quelles informations techniques sur le système Terre-Lune figurent dans les fiches de référence NASA associées ? (Plusieurs bonnes réponses)', 'Les tableaux de référence indiquent que la Lune est 3,7 fois plus petite que la Terre, pèse environ 7,348 × 10^22 kg et orbite à 384 400 km en moyenne.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('099dee83-f2a6-41af-b149-1a1536ccc6a5', '551f253d-314d-4dc0-83ff-c1fba1c3c1ff', 'Le diamètre de la Terre est 3,7 fois plus grand que celui de la Lune ET La masse de la Lune est d''environ 7,348 × 10^22 kg ET L''orbite moyenne de la Lune se situe à 384 400 km', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('af4cddb4-ead0-4797-9059-e5360af161c9', '551f253d-314d-4dc0-83ff-c1fba1c3c1ff', 'L''atmosphère lunaire a une pression de 1,5 bar ET Surveyor 3 a rapporté lui-même des échantillons sur Terre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('642defe6-4d00-4f65-9e10-a7436c69257e', '551f253d-314d-4dc0-83ff-c1fba1c3c1ff', 'Le diamètre de la Terre est 3,7 fois plus grand que celui de la Lune', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('518cce28-f25f-4d6c-8575-0502082ddb68', 'ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'Associe chaque instrument ou mission lunaire à sa fonction scientifique décrite dans la documentation NASA.', 'Chaque instrument remplit une mission dédiée : mécanique des sols pour Surveyor 3, thermométrie pour Diviner, gravimétrie pour GRAIL et étude de l''exosphère pour le CCGE.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('eeb096a7-fa73-4035-9658-c5baa4eb9072', '518cce28-f25f-4d6c-8575-0502082ddb68', 'Échantillonneur de surface (Surveyor 3) = Excavation du régolithe jusqu''à 1,5 m de distance de l''atterrisseur | Diviner (LRO) = Mesure de la réponse thermique de la surface lors des éclipses | Ebb et Flow (GRAIL) = Cartographie haute résolution du champ de gravité lunaire | Cold Cathode Gage Experiment (CCGE) = Instrument déployé sur la surface dans le cadre des expériences Apollo', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5cc9242b-bc0c-437b-83a7-79f38ab0aa6f', '518cce28-f25f-4d6c-8575-0502082ddb68', 'Échantillonneur de surface (Surveyor 3) = Mesure de la réponse thermique de la surface lors des éclipses | Diviner (LRO) = Cartographie haute résolution du champ de gravité lunaire | Ebb et Flow (GRAIL) = Instrument déployé sur la surface dans le cadre des expériences Apollo | Cold Cathode Gage Experiment (CCGE) = Excavation du régolithe jusqu''à 1,5 m de distance de l''atterrisseur', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9932b962-cc58-47fb-a2ff-a32d1494ea84', 'ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'Selon l''hypothèse de l''impact géant décrite par la NASA, pourquoi les éléments légers sont-ils moins abondants sur la Lune que sur Terre ?', 'La chaleur dégagée par la collision avec la jeune Terre a vaporisé les matériaux les plus légers qui se sont échappés dans l''espace, tandis que les éléments lourds comme le fer sont restés.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('08b15833-91c7-4912-b9f0-5b831dfb0f38', '9932b962-cc58-47fb-a2ff-a32d1494ea84', 'L''énergie de l''impact a vaporisé les matériaux légers et les a dispersés dans l''espace', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a0347be7-eb02-4787-8687-f187ebb90cdd', '9932b962-cc58-47fb-a2ff-a32d1494ea84', 'Le champ magnétique lunaire a repoussé les atomes légers', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('87c71a54-dfe9-4b4b-9212-2f26cedc76ff', '9932b962-cc58-47fb-a2ff-a32d1494ea84', 'La Lune s''est formée dans la ceinture de Kuiper', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('31b22d99-bad3-4058-b7d7-3508dcc5a361', '9932b962-cc58-47fb-a2ff-a32d1494ea84', 'Les éléments légers ont tous coulé au centre du noyau lunaire', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('afae5da6-72be-4bd7-b980-86964344dd8d', 'ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'Quelle distance approximative séparait le site d''atterrissage du module lunaire Intrepid d''Apollo 12 et l''épave de Surveyor 3 selon les deux mesures citées par la NASA ?', 'Les sources NASA précisent une distance d''environ 180 mètres (197 yards), soit moins de 200 mètres (650 pieds) au-delà du rempart du cratère.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('457ab157-334e-4678-b4b7-269a4756eaf7', 'afae5da6-72be-4bd7-b980-86964344dd8d', 'Environ 180 mètres (197 yards), soit moins de 200 mètres (650 pieds)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('732ad084-d52c-4f69-8b0a-051b3d846ccb', 'afae5da6-72be-4bd7-b980-86964344dd8d', 'Exactement 1 800 mètres', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a8fc3c34-071c-4254-8bac-e178313f1ace', 'afae5da6-72be-4bd7-b980-86964344dd8d', 'Moins de 15 mètres', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('bbd39760-e78b-4e3f-9b1d-44e70980fd78', 'afae5da6-72be-4bd7-b980-86964344dd8d', 'Plus de 5 kilomètres', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('8db7f00a-8cab-4b11-b0a1-0afa1c4864c3', 'ed40df0c-b6f1-4127-9dc3-2dc88d294b89', 'Quelles assertions concernant le calendrier opérationnel de Surveyor 3 sont exactes ? (Plusieurs bonnes réponses)', 'Lancé le 17 avril 1967, Surveyor 3 a atterri le 20 avril et a transmis jusqu''au 4 mai 1967, soit deux jours après le début de la nuit lunaire.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('99746fb6-ba56-4ed3-8e38-0434f0c96b55', '8db7f00a-8cab-4b11-b0a1-0afa1c4864c3', 'Le transit entre le lancement et l''atterrissage a duré 3 jours (17 au 20 avril 1967) ET La sonde a cessé de communiquer le 4 mai 1967 ET Le dernier contact a eu lieu 48 heures après le début de la nuit lunaire', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('682eae9c-7720-4d79-8592-da97ce01acb1', '8db7f00a-8cab-4b11-b0a1-0afa1c4864c3', 'La sonde a fonctionné sans interruption jusqu''en novembre 1969 ET Surveyor 3 a été lancé en juillet 1969 avec Apollo 11', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('39bffc98-1286-4159-aa5c-2830f9478d12', '8db7f00a-8cab-4b11-b0a1-0afa1c4864c3', 'Le transit entre le lancement et l''atterrissage a duré 3 jours (17 au 20 avril 1967)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Modules Lunaires Apollo & Eagle (Apollo 11) (Explorateur) (modules-lunaires-apollo-explorer)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('ebf89b75-d4a3-44c9-ab05-d259961f6002', 'modules-lunaires-apollo-explorer', 'Modules Lunaires Apollo & Eagle (Apollo 11) (Explorateur)', 'EXPLORER'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'moon' LIMIT 1), (SELECT "id" FROM "machines" WHERE "slug" = 'apollo-11-lm' LIMIT 1), true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a3d48771-eaf6-4419-a5cb-121126651c5a', 'ebf89b75-d4a3-44c9-ab05-d259961f6002', 'Comment s''appelait le module lunaire d''Apollo 11 qui s''est posé le premier sur la Lune ?', 'Le module lunaire d''Apollo 11 s''appelait Eagle (« l''Aigle ») et fut le premier véhicule habité à se poser sur la Lune.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b3e6eb22-364a-4634-bc04-3e0c05ff4f40', 'a3d48771-eaf6-4419-a5cb-121126651c5a', 'Eagle', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('828943c5-241a-4541-8bf7-190b57523080', 'a3d48771-eaf6-4419-a5cb-121126651c5a', 'Falcon', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('87ac5db6-231f-4560-a9b1-ba667f1daa93', 'a3d48771-eaf6-4419-a5cb-121126651c5a', 'Intrepid', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0a016699-8ed1-4ac7-b488-9036d0f6ee00', 'a3d48771-eaf6-4419-a5cb-121126651c5a', 'Columbia', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('7208bf7c-7975-405e-8791-cda2825257ca', 'ebf89b75-d4a3-44c9-ab05-d259961f6002', 'Quels deux astronautes sont descendus sur la Lune à bord du module Eagle ? (Plusieurs bonnes réponses)', 'Neil Armstrong et Buzz Aldrin ont été les deux premiers humains à marcher sur la Lune en juillet 1969.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('221d5d9c-e6fa-4edb-b315-b785ae329d54', '7208bf7c-7975-405e-8791-cda2825257ca', 'Neil A. Armstrong ET Edwin E. « Buzz » Aldrin', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('10febe97-60dc-4d03-b391-05682ff336db', '7208bf7c-7975-405e-8791-cda2825257ca', 'Michael Collins ET Charles Conrad ET David Scott', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('678025ff-1ad8-44c9-8e4d-9a56742349c0', '7208bf7c-7975-405e-8791-cda2825257ca', 'Neil A. Armstrong', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('5e1d0591-78e8-486d-84a3-e8ad8c095104', 'ebf89b75-d4a3-44c9-ab05-d259961f6002', 'Vrai ou faux : L''étage inférieur du module lunaire est resté sur la Lune pour servir de rampe de lancement.', 'Vrai ! L''étage de descente servait de plateforme de lancement pour l''étage de remontée et est resté sur la Lune.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4568d98d-7baf-4900-8b91-a9f78057eabe', '5e1d0591-78e8-486d-84a3-e8ad8c095104', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8584ad5e-3bc0-42e6-9b56-aa482c09ef36', '5e1d0591-78e8-486d-84a3-e8ad8c095104', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('fe7ad1cd-edf9-496c-9c09-f60b4da85cfc', 'ebf89b75-d4a3-44c9-ab05-d259961f6002', 'Dans quelle région de la Lune le module Eagle a-t-il atterri ?', 'Eagle s''est posé dans Mare Tranquillitatis, la Mer de la Tranquillité.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7af3c6cf-bf86-4d2f-8641-3197e222609a', 'fe7ad1cd-edf9-496c-9c09-f60b4da85cfc', 'La Mer de la Tranquillité', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2756faec-e9ef-47b4-bc1c-c55a11bde8db', 'fe7ad1cd-edf9-496c-9c09-f60b4da85cfc', 'La Mer des Tempêtes', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0b9cd410-225d-4a3c-9598-4f8be6beafbb', 'fe7ad1cd-edf9-496c-9c09-f60b4da85cfc', 'Le Cratère Tycho', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('46e4416a-a58a-4733-aedc-62c92938d838', 'fe7ad1cd-edf9-496c-9c09-f60b4da85cfc', 'Le Pôle Sud lunaire', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('5fe99d3c-e469-41dc-99ff-c9fe592c915f', 'ebf89b75-d4a3-44c9-ab05-d259961f6002', 'Combien de jambes d''atterrissage équipées de patins ronds soutenaient le module lunaire sur le sol ?', 'Le module lunaire possédait 4 jambes d''atterrissage munies de larges patins ronds, dont une portait l''échelle des astronautes.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dfdba87e-fcf9-46a4-a5d3-1c9e67ab0e66', '5fe99d3c-e469-41dc-99ff-c9fe592c915f', '4 jambes', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8eea5b6f-852a-4abd-a252-194373746b7a', '5fe99d3c-e469-41dc-99ff-c9fe592c915f', '6 jambes', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9d1a6ce5-91ce-4f93-943e-f2df0dd7cba8', '5fe99d3c-e469-41dc-99ff-c9fe592c915f', '2 jambes', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1d67d58b-3810-4c1c-9b49-87b972c86c7e', '5fe99d3c-e469-41dc-99ff-c9fe592c915f', '7 jambes', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('be4de95c-4deb-4e90-9a17-48e2e619f845', 'ebf89b75-d4a3-44c9-ab05-d259961f6002', 'Quelle phrase célèbre Neil Armstrong a-t-il prononcée en posant le pied sur la Lune ?', 'En posant le pied sur la Lune le 21 juillet 1969, Armstrong a déclaré : « That''s one small step for man, one giant leap for mankind ».', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fd44ca2d-f931-4890-8896-380c77f4d98a', 'be4de95c-4deb-4e90-9a17-48e2e619f845', '« C''est un petit pas pour l''homme, un bond de géant pour l''humanité »', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('244d8966-e025-4fcf-9299-e57af57c14bb', 'be4de95c-4deb-4e90-9a17-48e2e619f845', '« Houston, nous avons un problème »', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ddd97d40-4e2c-401f-8ba0-e8163a5ea696', 'be4de95c-4deb-4e90-9a17-48e2e619f845', '« Vers l''infini et au-delà »', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0ec40693-b3df-4865-a7e8-432d0818295d', 'be4de95c-4deb-4e90-9a17-48e2e619f845', '« La Terre est bleue comme une orange »', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('43b1decc-b05a-4b55-a1f0-2f6479c47fd0', 'ebf89b75-d4a3-44c9-ab05-d259961f6002', 'Vrai ou faux : Les empreintes de pas laissées par les astronautes d''Apollo 11 sur la Lune peuvent durer des millions d''années.', 'Vrai ! Sans vent ni eau sur la Lune, sauf chute d''une météorite au même endroit, ces empreintes resteront intactes pendant des millions d''années.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1c92b8fe-a3c3-4b52-aef1-df1fe3679e52', '43b1decc-b05a-4b55-a1f0-2f6479c47fd0', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('effc368b-348f-4814-80f6-b70b072fad00', '43b1decc-b05a-4b55-a1f0-2f6479c47fd0', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('4ecec012-63f4-40e6-8880-0be35f60b00e', 'ebf89b75-d4a3-44c9-ab05-d259961f6002', 'Qu''ont installé ou laissé les astronautes d''Apollo 11 sur la Lune ? (Plusieurs bonnes réponses)', 'Les astronautes d''Apollo 11 ont planté un drapeau américain, dévoilé une plaque commémorative et installé l''ensemble scientifique EASEP.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f00d0cbd-3276-4f02-827c-ea2203fda970', '4ecec012-63f4-40e6-8880-0be35f60b00e', 'Un drapeau américain ET Une plaque portant un message de paix pour toute l''humanité ET Des instruments scientifiques (EASEP)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('85a4d5e5-3b96-4e58-81f3-809b0b46216f', '4ecec012-63f4-40e6-8880-0be35f60b00e', 'Un buggy lunaire électrique ET Une station spatiale habitée', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('da2c4c1d-9c2f-4f29-bdaf-68b6d79d6f43', '4ecec012-63f4-40e6-8880-0be35f60b00e', 'Un drapeau américain', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f08a7426-6ae7-403b-935c-1f8973cdddf7', 'ebf89b75-d4a3-44c9-ab05-d259961f6002', 'Combien de temps environ Buzz Aldrin a-t-il passé dehors sur la surface lunaire lors d''Apollo 11 ?', 'Buzz Aldrin est resté 1 heure et 41 minutes sur le sol lunaire avant de remonter dans l''Eagle, suivi 12 minutes plus tard par Neil Armstrong.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7c4caafd-55f0-456a-9a04-9e3958e167c1', 'f08a7426-6ae7-403b-935c-1f8973cdddf7', '1 heure et 41 minutes', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7c0ce397-3d1e-4957-b25a-a514729ac842', 'f08a7426-6ae7-403b-935c-1f8973cdddf7', '12 heures', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d894c4a7-5944-4b86-8e64-cdf4f9badb77', 'f08a7426-6ae7-403b-935c-1f8973cdddf7', '10 minutes', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('345b98ea-ae1e-45b4-aa9a-7349de305a7c', 'f08a7426-6ae7-403b-935c-1f8973cdddf7', '3 jours', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('50ea151c-c4c5-4fc6-9d2f-04d2b7d78c14', 'ebf89b75-d4a3-44c9-ab05-d259961f6002', 'Remets dans l''ordre les grandes étapes de la mission Apollo 11.', 'Apollo 11 a décollé le 16 juillet 1969, s''est posé le 20 juillet, Armstrong a marché sur la Lune le 21 juillet, puis l''équipage est revenu amerrir sur Terre.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cf3066fa-2871-44e1-bd23-1b5428050382', '50ea151c-c4c5-4fc6-9d2f-04d2b7d78c14', '1. Décollage de la fusée Saturn 5 depuis Cap Canaveral ➔ 2. Alunissage du module Eagle dans la Mer de la Tranquillité ➔ 3. Premiers pas de Neil Armstrong sur la Lune ➔ 4. Retour sur Terre et amerrissage des astronautes', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a8b7a279-2d1b-4bc9-9514-bce1100d4795', '50ea151c-c4c5-4fc6-9d2f-04d2b7d78c14', '1. Retour sur Terre et amerrissage des astronautes ➔ 2. Premiers pas de Neil Armstrong sur la Lune ➔ 3. Alunissage du module Eagle dans la Mer de la Tranquillité ➔ 4. Décollage de la fusée Saturn 5 depuis Cap Canaveral', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('04107e82-8a70-4823-859d-c843456f1033', '50ea151c-c4c5-4fc6-9d2f-04d2b7d78c14', '1. Alunissage du module Eagle dans la Mer de la Tranquillité ➔ 2. Décollage de la fusée Saturn 5 depuis Cap Canaveral ➔ 3. Premiers pas de Neil Armstrong sur la Lune ➔ 4. Retour sur Terre et amerrissage des astronautes', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('43975838-23e1-4023-bfe9-34266026456d', 'ebf89b75-d4a3-44c9-ab05-d259961f6002', 'Comment Buzz Aldrin a-t-il décrit le paysage lunaire en posant le pied sur la Lune ?', 'Buzz Aldrin, qui a suivi Armstrong 19 minutes plus tard, a qualifié la surface lunaire de « Magnificent desolation » (« Magnifique désolation »).', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('511e3870-39b0-46a4-964d-7f6cf363d06f', '43975838-23e1-4023-bfe9-34266026456d', '« Magnifique désolation »', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0c0cddd7-2b3a-4237-b86a-89ddc282bd74', '43975838-23e1-4023-bfe9-34266026456d', '« Jungle luxuriante »', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('207d8a9a-dd66-49a7-b258-eef44eea0b9f', '43975838-23e1-4023-bfe9-34266026456d', '« Océan scintillant »', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8d989586-b09a-480e-97cf-be181c5eeefa', '43975838-23e1-4023-bfe9-34266026456d', '« Ville de cristal »', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('2290370a-3c2b-4d7a-af9b-cf875ea1ab3f', 'ebf89b75-d4a3-44c9-ab05-d259961f6002', 'De combien d''étages principaux le module lunaire Apollo était-il composé ?', 'Le module lunaire était un véhicule à deux étages : l''étage de descente (qui reste sur la Lune) et l''étage de remontée (qui ramène l''équipage en orbite).', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('631080c4-e528-4040-9ef3-1bf8bca539c1', '2290370a-3c2b-4d7a-af9b-cf875ea1ab3f', '2 étages', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d3589b14-a40c-4099-a604-3fa7e90ada09', '2290370a-3c2b-4d7a-af9b-cf875ea1ab3f', '1 seul bloc', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('86b64bb6-ce4d-4846-a4e1-692acde3d463', '2290370a-3c2b-4d7a-af9b-cf875ea1ab3f', '5 étages', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('392d26d2-115a-44aa-a413-bebe71f144e7', '2290370a-3c2b-4d7a-af9b-cf875ea1ab3f', '10 étages', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('33546648-5d0a-41b3-9b8d-b5869d0ccd67', 'ebf89b75-d4a3-44c9-ab05-d259961f6002', 'Associe chaque astronaute d''Apollo 11 à sa fonction.', 'Neil Armstrong commandait la mission, Buzz Aldrin pilotait le module lunaire Eagle, et Michael Collins pilotait le module de commande Columbia.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3cd95dda-8ebd-4abe-ae65-bb2940f6b6c5', '33546648-5d0a-41b3-9b8d-b5869d0ccd67', 'Neil A. Armstrong = Commandant d''Apollo 11 et premier homme sur la Lune | Edwin E. « Buzz » Aldrin = Pilote du module lunaire et deuxième homme sur la Lune | Michael Collins = Pilote du module de commande resté en orbite lunaire', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('49bb9051-5483-4fbd-b42c-443375d18e78', '33546648-5d0a-41b3-9b8d-b5869d0ccd67', 'Neil A. Armstrong = Pilote du module lunaire et deuxième homme sur la Lune | Edwin E. « Buzz » Aldrin = Pilote du module de commande resté en orbite lunaire | Michael Collins = Commandant d''Apollo 11 et premier homme sur la Lune', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('fdfd438f-3f8c-4030-993f-36490b6c67b8', 'ebf89b75-d4a3-44c9-ab05-d259961f6002', 'Quelle quantité de roches et de poussière lunaires les astronautes d''Apollo 11 ont-ils rapportée sur Terre ?', 'Armstrong et Aldrin ont collecté et rapporté 21,55 kg de roches et de sol lunaires dans leurs boîtes à échantillons.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0e70afce-4be4-4c79-beb8-6d5c5114c224', 'fdfd438f-3f8c-4030-993f-36490b6c67b8', '21,55 kg', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e5969ece-9ae7-4344-8ac5-4d9e227c439b', 'fdfd438f-3f8c-4030-993f-36490b6c67b8', '100 grammes', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f70ec6f3-346e-43f0-af06-98711326cc69', 'fdfd438f-3f8c-4030-993f-36490b6c67b8', '500 kg', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ce6f5d8d-11b6-4e00-871b-d3d4b715d9e7', 'fdfd438f-3f8c-4030-993f-36490b6c67b8', '2 tonnes', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('449a63bd-10b6-4afe-9806-e8e5c3b928b1', 'ebf89b75-d4a3-44c9-ab05-d259961f6002', 'Comment les astronautes d''Apollo 11 se sont-ils déplacés sur la Lune ? (Plusieurs bonnes réponses)', 'Lors d''Apollo 11, les astronautes se sont déplacés uniquement à pied, parcourant environ 250 mètres au total sans s''éloigner à plus de 100 mètres du module.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('020d4d56-b4a4-4e92-a4ca-0feaed7c2392', '449a63bd-10b6-4afe-9806-e8e5c3b928b1', 'À pied en marchant et en sautillant ET En restant à moins de 100 mètres du module Eagle ET En parcourant environ 250 mètres au total', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('88b1c3fc-3f6a-4513-9844-1ac971b017bd', '449a63bd-10b6-4afe-9806-e8e5c3b928b1', 'Au volant d''un buggy lunaire ET À bord d''un petit hélicoptère', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8c2fca34-021a-49c6-a71b-192e95345a4e', '449a63bd-10b6-4afe-9806-e8e5c3b928b1', 'À pied en marchant et en sautillant', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Modules Lunaires Apollo & Eagle (Apollo 11) (Expert) (modules-lunaires-apollo-expert)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'modules-lunaires-apollo-expert', 'Modules Lunaires Apollo & Eagle (Apollo 11) (Expert)', 'EXPERT'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'moon' LIMIT 1), (SELECT "id" FROM "machines" WHERE "slug" = 'apollo-11-lm' LIMIT 1), true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('45f540aa-9ac2-415a-9168-672697e4acaa', '74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'Quelle était la répartition exacte entre la masse sèche et la masse d''ergols de l''étage de descente d''Eagle ?', 'L''étage de descente d''Apollo 11 avait une masse sèche de 2 034 kg (équipement stocké inclus) et emportait 8 248 kg d''ergols (contre 2 445 kg à sec et 2 376 kg d''ergols pour l''étage de remontée).', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ac797abb-56a7-47c2-b080-7cbe60348b26', '45f540aa-9ac2-415a-9168-672697e4acaa', '2 034 kg à sec et 8 248 kg d''ergols', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3fde46e5-d028-46ee-a66b-22af32ff95c6', '45f540aa-9ac2-415a-9168-672697e4acaa', '2 445 kg à sec et 2 376 kg d''ergols', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('01bd06a9-abff-4a41-9f17-0da0f4cab349', '45f540aa-9ac2-415a-9168-672697e4acaa', '2 797 kg à sec et 8 873 kg d''ergols', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ac1cad32-aeae-471a-99c6-640eb9544a72', '45f540aa-9ac2-415a-9168-672697e4acaa', '2 118 kg à sec et 8 359 kg d''ergols', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('dcfcddc5-c7d0-43fd-a5f1-3f401eacbffa', '74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'Calcule la masse totale d''ergols (en kg) embarquée au départ à bord des deux étages du module lunaire Eagle (8 248 kg + 2 376 kg).', 'Eagle emportait 8 248 kg + 2 376 kg = 10 624 kg d''ergols, soit plus de 70 % de sa masse totale de 15 103 kg.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('456725ad-c93b-4aea-90fb-3adc10d56331', 'dcfcddc5-c7d0-43fd-a5f1-3f401eacbffa', '10624 kg', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8432443e-77d7-42f5-a50c-a2ff2ef221a8', 'dcfcddc5-c7d0-43fd-a5f1-3f401eacbffa', '15936 kg', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('bc5d3346-a619-4cc9-86af-dd2082541718', 'dcfcddc5-c7d0-43fd-a5f1-3f401eacbffa', '5312 kg', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('df02c9e5-991c-4325-89f0-ae311b86e2f0', 'dcfcddc5-c7d0-43fd-a5f1-3f401eacbffa', '10634 kg', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('eb0fa36b-1e05-4718-a0e2-d7cd37be204e', '74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'Quelle anomalie thermique l''ensemble scientifique EASEP a-t-il subie tout en continuant de fonctionner normalement ?', 'Malgré des températures de fonctionnement supérieures de 30 °C au maximum nominal prévu, l''EASEP a fonctionné normalement.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b1be0d01-fe62-4b78-9cdc-e55b771ad298', 'eb0fa36b-1e05-4718-a0e2-d7cd37be204e', 'Des températures de fonctionnement dépassant de 30 °C le maximum prévu', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('01b947de-b826-49ca-a61b-dba2ad8f889d', 'eb0fa36b-1e05-4718-a0e2-d7cd37be204e', 'Un refroidissement brutal de -150 °C en plein midi lunaire', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e0eedf92-8c29-4d86-b9e8-817602fc8aa6', 'eb0fa36b-1e05-4718-a0e2-d7cd37be204e', 'La fusion des panneaux solaires sous l''effet des gaz d''échappement', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b8c21e33-c45a-4adc-826e-e95ce2aa9e35', 'eb0fa36b-1e05-4718-a0e2-d7cd37be204e', 'Une panne du chauffage isotopique dès la première heure', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('dbdcebb9-97bb-486c-a08d-a0467bccaffe', '74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'Vrai ou faux : D''après les images du Lunar Reconnaissance Orbiter (LRO, référentiel DE 421), le site d''alunissage d''Eagle se trouve à 0,67416° N de latitude et 23,47314° E de longitude.', 'Vrai, les mesures LRO (DE 421) fixent la position précise d''Eagle à 0,67416° N et 23,47314° E.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('880b4ba1-1960-485a-be38-10c43efeac33', 'dbdcebb9-97bb-486c-a08d-a0467bccaffe', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dcb626e9-ad1d-4f63-ac67-02c73bfdc205', 'dbdcebb9-97bb-486c-a08d-a0467bccaffe', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('6a0c51e5-f3c2-4967-9b49-3c076eacf3ac', '74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'Comment les deux panneaux solaires de l''EASEP étaient-ils orientés lors de leur déploiement sur la Lune ?', 'Deux supports fixés sur les côtés opposés de la base carrée maintenaient les panneaux solaires rectangulaires inclinés vers l''est et l''ouest.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('049fc1d7-0ac5-45e4-aacb-dddc338de945', '6a0c51e5-f3c2-4967-9b49-3c076eacf3ac', 'Inclinés sur deux supports opposés et orientés vers l''est et l''ouest', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('95e1dc3b-10c1-4f53-a420-7c48c61ca0f2', '6a0c51e5-f3c2-4967-9b49-3c076eacf3ac', 'Posés à plat sur le sol et orientés vers le nord et le sud', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f5b8532b-0eba-4d62-8fd7-db5675e4a6f5', '6a0c51e5-f3c2-4967-9b49-3c076eacf3ac', 'Montés sur un moteur de poursuite solaire à deux axes', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('42d48ff1-d3fc-4039-b9ea-89779b089a41', '6a0c51e5-f3c2-4967-9b49-3c076eacf3ac', 'Suspendus à l''échelle du module lunaire', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('6ccd67fd-62f6-4d02-beff-8510c19c66ae', '74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'Quels sous-systèmes étaient logés dans l''étage de descente du module lunaire Apollo ? (Plusieurs bonnes réponses)', 'L''étage de descente contenait le moteur de descente (avec sa jupe conique de 1 m), les 4 réservoirs d''ergols, les réservoirs d''eau/oxygène/hélium et les baies d''équipement.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cde4fa3e-6ac6-463d-9d85-1be7e12ff070', '6ccd67fd-62f6-4d02-beff-8510c19c66ae', 'Le moteur-fusée d''alunissage et sa jupe conique de 1 mètre ET Deux réservoirs d''aérozine 50 et deux réservoirs de peroxyde d''azote ET Des réservoirs d''eau, d''oxygène et d''hélium ET Les compartiments de stockage pour l''équipement lunaire', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e9ec792f-290d-4a78-a88b-b95f719fbf6d', '6ccd67fd-62f6-4d02-beff-8510c19c66ae', 'Les deux couchettes principales de l''équipage', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e3253a90-e591-488d-ba43-c9d55261b7ed', '6ccd67fd-62f6-4d02-beff-8510c19c66ae', 'Le moteur-fusée d''alunissage et sa jupe conique de 1 mètre', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f900f09b-caf4-475e-b99f-b7865cdbea5d', '74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'Quelle était la fréquence de liaison descendante (télémétrie vers la Terre) utilisée par l''EASEP d''Apollo 11 ?', 'L''EASEP recevait ses commandes sur 2119 MHz et transmettait sa télémétrie vers la Terre sur 2276,5 MHz.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c29bbdf1-08e7-4ccd-a3de-b4dc2d2c72dd', 'f900f09b-caf4-475e-b99f-b7865cdbea5d', '2276,5 MHz', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('057656ea-d268-40d2-8f65-af860df74344', 'f900f09b-caf4-475e-b99f-b7865cdbea5d', '2119,0 MHz', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f419ebe2-5395-4394-aa49-0f1f6b5dd6b6', 'f900f09b-caf4-475e-b99f-b7865cdbea5d', '2278,5 MHz', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fe127b46-92f7-48a6-bb35-24508ab0a739', 'f900f09b-caf4-475e-b99f-b7865cdbea5d', '1420,4 MHz', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('694f31ee-c240-453d-bb6e-fa0c29671079', '74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'Ordonne chronologiquement les événements liés à l''ensemble scientifique EASEP d''Apollo 11.', 'Activé le 21 juillet à 04:40:39 UT, l''EASEP a été coupé avant le coucher du Soleil le 3 août à 10:58:46 UT, rallumé au jour lunaire suivant et arrêté le 27 août 1969.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2e9085eb-a0ee-4b62-9c67-b93ebf691532', '694f31ee-c240-453d-bb6e-fa0c29671079', '1. Activation par commande depuis la Terre pendant l''EVA (21 juillet 1969 à 04:40:39 UT) ➔ 2. Arrêt de transmission 5 heures avant le coucher du Soleil local (3 août 1969 à 10:58:46 UT) ➔ 3. Réactivation au début du deuxième jour lunaire ➔ 4. Arrêt définitif suite à l''absence de réponse aux commandes (27 août 1969)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4cbeb19b-0f5f-44b6-86f1-70ce88f9c043', '694f31ee-c240-453d-bb6e-fa0c29671079', '1. Arrêt définitif suite à l''absence de réponse aux commandes (27 août 1969) ➔ 2. Réactivation au début du deuxième jour lunaire ➔ 3. Arrêt de transmission 5 heures avant le coucher du Soleil local (3 août 1969 à 10:58:46 UT) ➔ 4. Activation par commande depuis la Terre pendant l''EVA (21 juillet 1969 à 04:40:39 UT)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('33092fac-f32d-4554-96c1-df333f5ed877', '694f31ee-c240-453d-bb6e-fa0c29671079', '1. Arrêt de transmission 5 heures avant le coucher du Soleil local (3 août 1969 à 10:58:46 UT) ➔ 2. Activation par commande depuis la Terre pendant l''EVA (21 juillet 1969 à 04:40:39 UT) ➔ 3. Réactivation au début du deuxième jour lunaire ➔ 4. Arrêt définitif suite à l''absence de réponse aux commandes (27 août 1969)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('cfad80af-7422-4aab-8975-65afd21dfb0e', '74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'Quelles étaient les dimensions extérieures approximatives de l''étage de remontée du module lunaire Apollo ?', 'L''étage de remontée mesurait environ 2,8 m de haut et 4,0 par 4,3 mètres de large, offrant un volume pressurisé de 6,65 m³.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e2531e9a-5257-4343-ab71-a0ee5b76b3c8', 'cfad80af-7422-4aab-8975-65afd21dfb0e', 'Environ 2,8 m de haut sur 4,0 m par 4,3 m de large', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6c9e9554-3f01-410d-97d9-7278004b0173', 'cfad80af-7422-4aab-8975-65afd21dfb0e', 'Exactement 9,4 m de haut sur 4,2 m de large', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f5aec298-fa15-470f-82d4-332b6996ad42', 'cfad80af-7422-4aab-8975-65afd21dfb0e', 'Environ 1,5 m de haut sur 1,7 m de large', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5d74ae38-5f12-4648-83d9-fc6af90d2964', 'cfad80af-7422-4aab-8975-65afd21dfb0e', 'Environ 10 m de haut sur 6,65 m de large', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('2fb4ee71-4b24-4ae8-a9d6-c078c2752cbc', '74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'Vrai ou faux : L''étage de remontée du module lunaire comportait deux écoutilles distinctes : une sur le côté pour les sorties lunaires et une au sommet pour l''amarrage au module de commande.', 'Vrai, il disposait d''une écoutille latérale d''entrée/sortie (ingress-egress) pour la surface et d''une écoutille supérieure d''amarrage (docking) avec le CSM.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a2668725-1b28-4193-8f22-5c3d3660b5aa', '2fb4ee71-4b24-4ae8-a9d6-c078c2752cbc', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d9a087c2-c45e-4f4a-9955-197f637e3504', '2fb4ee71-4b24-4ae8-a9d6-c078c2752cbc', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e15d5dff-e8ba-4036-9867-65bfff8cf3a6', '74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'Quels éléments étaient directement montés sur la base carrée de l''EASEP d''Apollo 11 ? (Plusieurs bonnes réponses)', 'La base carrée portait le sismomètre, le détecteur de poussière, un réchauffeur isotopique et le mât d''antenne ; le LRRR était déployé séparément à 5 m.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f17b3bb3-752c-4ed6-b602-07baa8f8870b', 'e15d5dff-e8ba-4036-9867-65bfff8cf3a6', 'Le sismomètre passif ET Le détecteur de poussière lunaire ET Un dispositif de chauffage isotopique ET Un mât d''antenne cylindrique avec mécanisme de pointage', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('13e41a45-54c5-48bc-857c-e163dcd94d8c', 'e15d5dff-e8ba-4036-9867-65bfff8cf3a6', 'Le rétroréflecteur laser LRRR', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('29b309d0-75c0-47a0-bc9b-489250c77114', 'e15d5dff-e8ba-4036-9867-65bfff8cf3a6', 'Le sismomètre passif', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('3eff969b-e8a7-4795-8da3-2ac318f10072', '74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'Associe chaque horodatage (en UT) de la mission Apollo 11 à l''événement correspondant.', 'Ces quatre jalons marquent respectivement l''alunissage, la sortie EVA, le décollage lunaire et l''abandon de l''étage de remontée.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c72e0e27-10ac-4bc8-a6c1-0f3d8829685c', '3eff969b-e8a7-4795-8da3-2ac318f10072', '20 juillet 1969, 20:17:40 UT = Alunissage d''Eagle dans la Mer de la Tranquillité | 21 juillet 1969, 02:56:15 UT = Premier pas de Neil Armstrong sur la surface lunaire | 21 juillet 1969, 17:54:01 UT = Décollage d''Eagle depuis la surface lunaire | 22 juillet 1969, 00:01:01 UT = Largage de l''étage de remontée d''Eagle en orbite lunaire', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7cc371ab-ed9a-4c9d-9614-e8dfb0bb04da', '3eff969b-e8a7-4795-8da3-2ac318f10072', '20 juillet 1969, 20:17:40 UT = Premier pas de Neil Armstrong sur la surface lunaire | 21 juillet 1969, 02:56:15 UT = Décollage d''Eagle depuis la surface lunaire | 21 juillet 1969, 17:54:01 UT = Largage de l''étage de remontée d''Eagle en orbite lunaire | 22 juillet 1969, 00:01:01 UT = Alunissage d''Eagle dans la Mer de la Tranquillité', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('b63003b8-637f-4056-8fee-2ba0b6ced1ee', '74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'Quel matériau ou procédé caractérisait le moteur de descente du module lunaire Apollo ?', 'La fiche NSSDCA décrit le moteur de descente comme une fusée ablative à forte modulation de poussée (deep-throttling ablative rocket) montée sur cardan.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c6610042-42db-4ac1-9969-11b6a91e003e', 'b63003b8-637f-4056-8fee-2ba0b6ced1ee', 'Une chambre de combustion ablative avec poussée fortement modulable', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1ba5b57b-0a8b-46f9-8973-a12df8ad87dc', 'b63003b8-637f-4056-8fee-2ba0b6ced1ee', 'Un refroidissement régénératif à l''hydrogène liquide', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('65d8eb76-3df9-4570-8190-36bb733e2796', 'b63003b8-637f-4056-8fee-2ba0b6ced1ee', 'Une tuyère en graphite non refroidie à poussée fixe', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2564f334-2077-43fd-9044-90c5da3d130e', 'b63003b8-637f-4056-8fee-2ba0b6ced1ee', 'Un réacteur nucléaire thermique à cœur solide', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('788af74e-4cd4-46ff-ba3d-df55c1128507', '74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'À quelle position relative par rapport au module lunaire Eagle l''ensemble EASEP a-t-il été installé ?', 'L''EASEP a été déployé à environ 17 m au sud du LM (0,6735° N, 23,4730° E) afin de limiter les perturbations liées au redécollage.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fed34c03-3aec-4850-ad26-2cfbabc04ee6', '788af74e-4cd4-46ff-ba3d-df55c1128507', 'Environ 17 mètres au sud du LM (0,6735° N, 23,4730° E)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2d5b1a02-82d4-4cdb-868c-5bf9419010f5', '788af74e-4cd4-46ff-ba3d-df55c1128507', 'Environ 180 mètres à l''ouest du LM', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1e5396ea-0e41-4f61-b738-37015df5cc53', '788af74e-4cd4-46ff-ba3d-df55c1128507', 'Directement sous la tuyère du moteur de descente', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b2ec91c3-26e2-4413-9887-5f0cb4654d47', '788af74e-4cd4-46ff-ba3d-df55c1128507', 'À 1,3 km au nord-est du LM', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e3ece307-b9a4-43ec-8d4a-113dbaa1d2de', '74fd0b45-7ded-4b26-8210-ea23375a6c2f', 'Quelles assertions concernant le retour d''Eagle vers le module de commande Columbia sont exactes ? (Plusieurs bonnes réponses)', 'L''étage de remontée a décollé depuis l''étage de descente resté au sol et s''est amarré au CSM piloté par Michael Collins à 21:34:00 UT le 21 juillet 1969.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4d562418-206d-48e3-9cde-8ee007a82e2c', 'e3ece307-b9a4-43ec-8d4a-113dbaa1d2de', 'Michael Collins pilotait le module de commande et de service (CSM) ET L''amarrage entre l''étage de remontée d''Eagle et le CSM a eu lieu le 21 juillet à 21:34:00 UT ET Seul l''étage de remontée a rejoint l''orbite lunaire ET L''étage de descente est resté sur la Lune comme plateforme de lancement', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('def22291-6a75-47df-8278-3272875de1f0', 'e3ece307-b9a4-43ec-8d4a-113dbaa1d2de', 'Eagle est revenu entier jusqu''à l''amerrissage dans le Pacifique', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1d0a9d74-67d8-4135-ad83-ad77ce942904', 'e3ece307-b9a4-43ec-8d4a-113dbaa1d2de', 'Michael Collins pilotait le module de commande et de service (CSM)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Stations Scientifiques ALSEP & Apollo 12 (Explorateur) (modules-scientifiques-alsep-explorer)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('e54ceb05-884d-4090-b794-1aa03ab897d6', 'modules-scientifiques-alsep-explorer', 'Stations Scientifiques ALSEP & Apollo 12 (Explorateur)', 'EXPLORER'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'moon' LIMIT 1), (SELECT "id" FROM "machines" WHERE "slug" = 'apollo-12-lm' LIMIT 1), true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('d4fbcd1c-1f14-4e8a-8e74-fc5c5793d934', 'e54ceb05-884d-4090-b794-1aa03ab897d6', 'À quoi servaient les modules scientifiques ALSEP laissés par les astronautes sur la Lune ?', 'Les stations ALSEP étaient des laboratoires automatiques laissés sur la Lune pour mesurer les séismes et l''environnement lunaire pendant des années.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d87e33df-8e1e-46e5-aa72-c6aa37163dcc', 'd4fbcd1c-1f14-4e8a-8e74-fc5c5793d934', 'À poursuivre des expériences scientifiques après le départ des astronautes', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1e1abba9-92e7-401e-94d4-e4715448395b', 'd4fbcd1c-1f14-4e8a-8e74-fc5c5793d934', 'À éclairer la Lune la nuit', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1d40cd21-78ec-4d53-b622-c4290f3448d5', 'd4fbcd1c-1f14-4e8a-8e74-fc5c5793d934', 'À abriter les astronautes pendant leur sommeil', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0c9b2034-17ca-40ff-9c89-a6437e0b5c9a', 'd4fbcd1c-1f14-4e8a-8e74-fc5c5793d934', 'À fabriquer de l''oxygène pour la Terre', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('8bb43aed-5a52-48cc-ba8e-1b918d1bbf15', 'e54ceb05-884d-4090-b794-1aa03ab897d6', 'Quels appareils scientifiques pouvaient faire partie d''un module ALSEP ? (Plusieurs bonnes réponses)', 'Les stations ALSEP regroupaient plusieurs instruments comme des sismomètres, des détecteurs de particules solaires ou des rétroréflecteurs.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('41b59fd2-da95-4a39-9f74-a6a1012eac93', '8bb43aed-5a52-48cc-ba8e-1b918d1bbf15', 'Des sismomètres pour détecter les tremblements de Lune ET Des rétroréflecteurs laser ET Des appareils mesurant le vent solaire', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6b0d7d13-77e5-4330-ba0d-d3900a44e8ce', '8bb43aed-5a52-48cc-ba8e-1b918d1bbf15', 'Des télescopes sous-marins ET Des stations météo pour la pluie', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('147be218-c63f-4189-962a-8949ef423cf4', '8bb43aed-5a52-48cc-ba8e-1b918d1bbf15', 'Des sismomètres pour détecter les tremblements de Lune', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('2b457ba6-396d-42b0-9b65-491bb9634611', 'e54ceb05-884d-4090-b794-1aa03ab897d6', 'Vrai ou faux : Les instruments de l''ALSEP étaient reliés par des câbles à une station centrale.', 'Vrai ! Les astronautes installaient les instruments autour d''une station centrale à laquelle ils étaient reliés par des câbles.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6b1b91d7-2fb9-4fac-b53b-5ab7c398042a', '2b457ba6-396d-42b0-9b65-491bb9634611', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('80605a29-55bc-43df-82ab-8609cb4c19fc', '2b457ba6-396d-42b0-9b65-491bb9634611', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('36e006de-eace-4c8c-a8d9-0f2a0b87f14e', 'e54ceb05-884d-4090-b794-1aa03ab897d6', 'Quelle mission Apollo a déployé la toute première station complète ALSEP en novembre 1969 ?', 'Apollo 12 (novembre 1969) a déployé la première station ALSEP complète dans l''Océan des Tempêtes.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('02db5526-2a94-49ad-b272-74e33bb18cb8', '36e006de-eace-4c8c-a8d9-0f2a0b87f14e', 'Apollo 12', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('350741d3-7f27-4e56-80f8-29e80a707d22', '36e006de-eace-4c8c-a8d9-0f2a0b87f14e', 'Apollo 11', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f4543843-42ba-44a3-8c6c-d0cd4a7b18bb', '36e006de-eace-4c8c-a8d9-0f2a0b87f14e', 'Apollo 8', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b8149fed-63b0-4525-acc7-bb2abf31facf', '36e006de-eace-4c8c-a8d9-0f2a0b87f14e', 'Apollo 17', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('68daefe5-aa43-4b08-8442-0d59bf1eba20', 'e54ceb05-884d-4090-b794-1aa03ab897d6', 'Pourquoi la caméra de télévision d''Apollo 12 est-elle tombée en panne pendant son installation ?', 'Lors de son installation, la caméra TV a été involontairement dirigée vers le Soleil, ce qui a grillé son tube capteur.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d77ef767-c113-47ad-9d8b-ec7b9afc2a78', '68daefe5-aa43-4b08-8442-0d59bf1eba20', 'Parce qu''elle a été pointée par erreur vers le Soleil', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7aa503cd-755f-498d-9690-590a7bf93ff9', '68daefe5-aa43-4b08-8442-0d59bf1eba20', 'Parce qu''elle est tombée dans un cratère profond', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d8ce44fd-1ab3-4358-b792-3a8e015601e9', '68daefe5-aa43-4b08-8442-0d59bf1eba20', 'Parce que sa batterie a gelé', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f05e46f7-9773-44e5-b990-02079c759064', '68daefe5-aa43-4b08-8442-0d59bf1eba20', 'Parce qu''un astronaute a marché sur le fil', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('22ba1096-d59f-427e-97b5-284ae5220aa7', 'e54ceb05-884d-4090-b794-1aa03ab897d6', 'Combien de kilogrammes de pièces les astronautes d''Apollo 12 ont-ils démontés sur Surveyor 3 pour les rapporter sur Terre ?', 'Lors de leur deuxième sortie, Conrad et Bean ont rendu visite à Surveyor 3 et ont prélevé environ 10 kg de pièces pour les étudier sur Terre.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a5d53c93-92f2-40df-b3a4-fee5177d073f', '22ba1096-d59f-427e-97b5-284ae5220aa7', '10 kg', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('73c60893-b539-45e6-841f-d5e5f65fb680', '22ba1096-d59f-427e-97b5-284ae5220aa7', '15 kg', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a8ef7f66-337e-48a7-bf01-fd1c78352875', '22ba1096-d59f-427e-97b5-284ae5220aa7', '5 kg', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('143dcc91-04e4-48d5-91e1-7f82165009be', '22ba1096-d59f-427e-97b5-284ae5220aa7', '13 kg', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('4595f8ad-7a0e-4265-a56e-daa601fe6918', 'e54ceb05-884d-4090-b794-1aa03ab897d6', 'Comment les astronautes d''Apollo 12 ont-ils provoqué le tout premier tremblement de Lune artificiel enregistré ?', 'Après le retour de l''équipage en orbite, le module lunaire Intrepid a été largué et s''est écrasé à 60 km du sismomètre, créant le premier séisme lunaire artificiel.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('450724e5-c66b-4186-bd98-1d820f142d11', '4595f8ad-7a0e-4265-a56e-daa601fe6918', 'En faisant s''écraser volontairement leur module lunaire vide sur la Lune', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d490fcfd-db83-4d98-8978-29ccaa1ce0e5', '4595f8ad-7a0e-4265-a56e-daa601fe6918', 'En sautant très fort tous les deux en même temps', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e7b64369-55aa-4a7b-b4a7-967a37958d4f', '4595f8ad-7a0e-4265-a56e-daa601fe6918', 'En tirant un missile depuis la Terre', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b302cf45-d40b-4ba6-a7b9-6a3bb31ecb4d', '4595f8ad-7a0e-4265-a56e-daa601fe6918', 'En roulant à toute vitesse avec un rover', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a22df0f5-abcf-449f-b9e6-da99002e4406', 'e54ceb05-884d-4090-b794-1aa03ab897d6', 'Vrai ou faux : Les stations scientifiques ALSEP ont fonctionné sur la Lune pendant presque huit ans, jusqu''en septembre 1977.', 'Vrai ! Allumée le 19 novembre 1969, la station ALSEP d''Apollo 12 (ainsi que les autres stations) a fonctionné jusqu''au 30 septembre 1977.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('27e55b54-4e26-4c1d-890a-86f676164ded', 'a22df0f5-abcf-449f-b9e6-da99002e4406', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('828a5455-a00d-4071-b209-2cd94bbfb522', 'a22df0f5-abcf-449f-b9e6-da99002e4406', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9117eb5b-21a0-4a7f-97b5-8666fcba6024', 'e54ceb05-884d-4090-b794-1aa03ab897d6', 'Quel poids total de roches et de sol lunaires l''équipage d''Apollo 12 a-t-il collecté ?', 'Pete Conrad et Alan Bean ont récolté 34,35 kg d''échantillons de roches et de sol lunaires, en plus des pièces de Surveyor 3.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('38a17d57-c3ab-445c-b607-fd3015965eac', '9117eb5b-21a0-4a7f-97b5-8666fcba6024', '34,35 kg', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('274ed297-5277-4f4c-a35a-4e73a6d66463', '9117eb5b-21a0-4a7f-97b5-8666fcba6024', '5 kg', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('df7e10fc-24b1-4a86-b3e5-8415d093b2c8', '9117eb5b-21a0-4a7f-97b5-8666fcba6024', '120 kg', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c1e75024-362e-4890-b5e0-7471e0609897', '9117eb5b-21a0-4a7f-97b5-8666fcba6024', '500 g', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f73e098c-4c17-4044-89e6-c7064767ede9', 'e54ceb05-884d-4090-b794-1aa03ab897d6', 'Remets dans l''ordre les étapes de la mission Apollo 12 sur la Lune.', 'Apollo 12 s''est posé le 19 novembre 1969, a déployé l''ALSEP lors de la 1re sortie, a visité Surveyor 3 lors de la 2e sortie et a décollé le 20 novembre.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2822354b-3f92-47d3-b78d-b5fad1642a9c', 'f73e098c-4c17-4044-89e6-c7064767ede9', '1. Alunissage d''Intrepid dans l''Océan des Tempêtes ➔ 2. Installation de la station scientifique ALSEP lors de la 1re sortie ➔ 3. Visite de Surveyor 3 et récupération de 10 kg de pièces ➔ 4. Décollage du module lunaire vers le vaisseau en orbite', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('38eec1ce-b6d6-4c76-bfc4-0e4fe9c1f31c', 'f73e098c-4c17-4044-89e6-c7064767ede9', '1. Décollage du module lunaire vers le vaisseau en orbite ➔ 2. Visite de Surveyor 3 et récupération de 10 kg de pièces ➔ 3. Installation de la station scientifique ALSEP lors de la 1re sortie ➔ 4. Alunissage d''Intrepid dans l''Océan des Tempêtes', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('66d17be1-cd74-4018-8824-ad03f6bf0a91', 'f73e098c-4c17-4044-89e6-c7064767ede9', '1. Installation de la station scientifique ALSEP lors de la 1re sortie ➔ 2. Alunissage d''Intrepid dans l''Océan des Tempêtes ➔ 3. Visite de Surveyor 3 et récupération de 10 kg de pièces ➔ 4. Décollage du module lunaire vers le vaisseau en orbite', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('8552fd91-64a9-47fa-bdb8-db9a991c3d72', 'e54ceb05-884d-4090-b794-1aa03ab897d6', 'Quels astronautes ont participé à la mission Apollo 12 ? (Plusieurs bonnes réponses)', 'Pete Conrad et Alan Bean ont marché sur la Lune tandis que Richard Gordon pilotait le module de commande en orbite.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('43349604-7840-49cc-bf85-c77291914b79', '8552fd91-64a9-47fa-bdb8-db9a991c3d72', 'Charles « Pete » Conrad ET Alan L. Bean ET Richard F. Gordon Jr.', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('42c052f6-71e2-4108-989f-87b337203f42', '8552fd91-64a9-47fa-bdb8-db9a991c3d72', 'Neil Armstrong ET Buzz Aldrin', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('402e81c2-18e1-43e9-b882-9a6cc610b4eb', '8552fd91-64a9-47fa-bdb8-db9a991c3d72', 'Charles « Pete » Conrad', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('20db1761-c256-45dc-88ce-fd4b305226a8', 'e54ceb05-884d-4090-b794-1aa03ab897d6', 'Dans quelle grande plaine lunaire Apollo 12 s''est-il posé ?', 'Apollo 12 s''est posé dans Oceanus Procellarum (l''Océan des Tempêtes), à environ 180 mètres de Surveyor 3.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c26573d0-3519-4a46-a745-d489477143d8', '20db1761-c256-45dc-88ce-fd4b305226a8', 'Oceanus Procellarum', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1d911603-946b-484a-8a98-4ad4037285e1', '20db1761-c256-45dc-88ce-fd4b305226a8', 'Mare Tranquillitatis', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('29d23a3b-f415-42db-b33a-2cc39b8c6340', '20db1761-c256-45dc-88ce-fd4b305226a8', 'Mare Imbrium', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9a3ec09a-848c-48c7-b0e6-5d82137d5b2c', '20db1761-c256-45dc-88ce-fd4b305226a8', 'Mare Frigoris', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('0ac54dba-83bd-4996-9373-623a69733196', 'e54ceb05-884d-4090-b794-1aa03ab897d6', 'Associe chaque nom de la mission Apollo 12 à ce qu''il désigne.', 'Intrepid était le module lunaire, ALSEP la station scientifique déployée au sol, et Surveyor 3 l''atterrisseur robotisé de 1967.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f3b1243a-2dae-4196-9810-2987f39e666d', '0ac54dba-83bd-4996-9373-623a69733196', 'ALSEP = L''ensemble d''instruments scientifiques laissé sur la Lune | Intrepid = Le module lunaire d''Apollo 12 | Surveyor 3 = La sonde robotisée visitée par les astronautes', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('be092a9a-f5eb-498f-bf8c-6d0aa4df0185', '0ac54dba-83bd-4996-9373-623a69733196', 'ALSEP = Le module lunaire d''Apollo 12 | Intrepid = La sonde robotisée visitée par les astronautes | Surveyor 3 = L''ensemble d''instruments scientifiques laissé sur la Lune', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('7b7372d9-35d6-46b5-90ed-d55387368725', 'e54ceb05-884d-4090-b794-1aa03ab897d6', 'Comment l''ALSEP produisait-il son électricité même pendant la longue nuit glaciale de la Lune ?', 'Le générateur SNAP-27 utilisait la chaleur dégagée par du plutonium-238 pour produire de l''électricité jour et nuit.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6639a533-5a7b-4c05-b131-0345a67e6cbf', '7b7372d9-35d6-46b5-90ed-d55387368725', 'Avec un générateur nucléaire à chaleur (RTG)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('962a5d39-a4cd-46b4-ac41-afa211cf6dbd', '7b7372d9-35d6-46b5-90ed-d55387368725', 'Avec une éolienne géante', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0b4e10c4-90d8-446f-98c4-decbd414e227', '7b7372d9-35d6-46b5-90ed-d55387368725', 'Avec une rallonge électrique venue de la Terre', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('745a7a32-c8a6-42e8-b731-81677459361b', '7b7372d9-35d6-46b5-90ed-d55387368725', 'Avec un barrage hydraulique', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('93fac690-6b3d-48cf-a291-fc78a040e27e', 'e54ceb05-884d-4090-b794-1aa03ab897d6', 'Que peut-on dire des deux sorties à pied d''Apollo 12 sur la Lune ? (Plusieurs bonnes réponses)', 'Conrad et Bean ont effectué deux sorties totalisant 7 h 45 min et 1,35 km (dont 1,3 km lors de la seconde sortie géologique jusqu''à Surveyor 3).', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b84fb4ee-6459-4fe9-82bf-40926ec10f48', '93fac690-6b3d-48cf-a291-fc78a040e27e', 'Les astronautes ont fait deux sorties sur la Lune ET Ils ont marché 1,35 km au total ET La deuxième sortie était une marche géologique de 1,3 km vers Surveyor 3', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6a798796-333d-4828-8672-46c92b52c12f', '93fac690-6b3d-48cf-a291-fc78a040e27e', 'Ils ont utilisé un véhicule LRV à quatre roues ET Ils sont restés 3 semaines sur la Lune', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('bb402527-a25e-47aa-aa0d-2d1e4be8701f', '93fac690-6b3d-48cf-a291-fc78a040e27e', 'Les astronautes ont fait deux sorties sur la Lune', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Stations Scientifiques ALSEP & Apollo 12 (Expert) (modules-scientifiques-alsep-expert)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('d72b3c76-101b-406c-8e53-ba4446db0768', 'modules-scientifiques-alsep-expert', 'Stations Scientifiques ALSEP & Apollo 12 (Expert)', 'EXPERT'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'moon' LIMIT 1), (SELECT "id" FROM "machines" WHERE "slug" = 'apollo-12-lm' LIMIT 1), true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('b068a238-b40f-47fc-a78e-561cb59a10cf', 'd72b3c76-101b-406c-8e53-ba4446db0768', 'Quelle était la répartition des masses sèches et des ergols entre les deux étages du module lunaire Intrepid d''Apollo 12 ?', 'Sur Intrepid (15 235 kg), l''étage de remontée pesait 2 383 kg à sec (2 375 kg d''ergols) et l''étage de descente 2 118 kg à sec (8 359 kg d''ergols).', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('53999eaa-0529-4748-bd5f-6fd9fc54ccbc', 'b068a238-b40f-47fc-a78e-561cb59a10cf', 'Remontée : 2 383 kg à sec + 2 375 kg d''ergols ; Descente : 2 118 kg à sec + 8 359 kg d''ergols', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('aabbed76-7651-4b63-a652-690b87397c29', 'b068a238-b40f-47fc-a78e-561cb59a10cf', 'Remontée : 2 445 kg à sec + 2 376 kg d''ergols ; Descente : 2 034 kg à sec + 8 248 kg d''ergols', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2e5aabb7-70a5-4b55-b6d7-67777d96bd28', 'b068a238-b40f-47fc-a78e-561cb59a10cf', 'Remontée : 2 385 kg à sec + 2 375 kg d''ergols ; Descente : 2 797 kg à sec + 8 873 kg d''ergols', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('483c8899-30b1-47ec-a06f-ebade85867ac', 'b068a238-b40f-47fc-a78e-561cb59a10cf', 'Remontée : 3 000 kg à sec + 3 000 kg d''ergols ; Descente : 3 000 kg à sec + 6 235 kg d''ergols', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('de14b119-5f10-4dc0-a2dd-6bc307f9091d', 'd72b3c76-101b-406c-8e53-ba4446db0768', 'Si la puissance du générateur SNAP-27 passe de 70 W à l''installation à 63,5 W après un an, quelle est la baisse absolue de puissance électrique (en watts) sur cette première année ?', 'La puissance électrique du SNAP-27 diminue de 6,5 W au cours de la première année (passant d''environ 70 W à 63,5 W sous 16 V CC).', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('62d8bdd7-ffd1-455e-9276-a1618957237a', 'de14b119-5f10-4dc0-a2dd-6bc307f9091d', '6.5 W', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('09cd19d4-2815-42bc-b4ff-5a0c8bf07a16', 'de14b119-5f10-4dc0-a2dd-6bc307f9091d', '10 W', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('03b4fbf3-fc7f-4e00-a38b-40ae3fd2bbca', 'de14b119-5f10-4dc0-a2dd-6bc307f9091d', '3 W', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7a0498fc-d62f-44c6-ab0e-5633bd0fe87e', 'de14b119-5f10-4dc0-a2dd-6bc307f9091d', '9.5 W', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('ed8b22fa-15b5-4785-9fb9-009058be2b9d', 'd72b3c76-101b-406c-8e53-ba4446db0768', 'Comment la chaleur de la capsule de plutonium-238 était-elle convertie en électricité dans le générateur SNAP-27 ?', 'La capsule de combustible (~4 kg) insérée dans le cylindre interne transférait sa chaleur vers le cylindre externe via 442 couples thermoélectriques radiaux en tellurure de plomb, l''excès de chaleur étant dissipé par 8 ailettes.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('34e6c711-1119-4bf2-a427-bcaa90d3ec12', 'ed8b22fa-15b5-4785-9fb9-009058be2b9d', 'Par conduction radiale entre deux cylindres concentriques reliés par 442 thermocouples en tellurure de plomb', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b05b35ba-8b05-46f2-b7df-278e8ddcf9f0', 'ed8b22fa-15b5-4785-9fb9-009058be2b9d', 'Par rayonnement infrarouge vers des panneaux photovoltaïques en arséniure de gallium', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('430efbe7-4c46-4717-8612-7bf02cba1eb0', 'ed8b22fa-15b5-4785-9fb9-009058be2b9d', 'Par un cycle thermodynamique de Stirling à hélium sous pression', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('bba03966-628f-4f3e-b4a3-54b60f71e053', 'ed8b22fa-15b5-4785-9fb9-009058be2b9d', 'Par effet photoélectrique direct des particules alpha sur une grille de cuivre', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('2c524b6a-7060-4afa-aaaf-69942738fc76', 'd72b3c76-101b-406c-8e53-ba4446db0768', 'Vrai ou faux : Le site d''alunissage d''Intrepid (3,0128° S, 23,4219° W) et la station centrale ALSEP d''Apollo 12 (3,0094° S, 23,4246° W) se trouvent tous deux dans l''hémisphère sud et ouest de la Lune.', 'Vrai, les coordonnées confirmées par les images LRO (DE 421) placent Intrepid à 3,0128° S, 23,4219° W et la station centrale ALSEP à 3,0094° S, 23,4246° W.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b51894f1-f9ab-4902-8de0-2377f66d138b', '2c524b6a-7060-4afa-aaaf-69942738fc76', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('530f0c1a-187f-460b-94b0-d3865def0354', '2c524b6a-7060-4afa-aaaf-69942738fc76', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('71eb87d2-4a6c-4a17-9a7a-b5118b0e5e1a', 'd72b3c76-101b-406c-8e53-ba4446db0768', 'Quelle fréquence descendante spécifique l''ALSEP d''Apollo 12 utilisait-il pour transmettre sa télémétrie vers la Terre ?', 'Alors que toutes les stations ALSEP recevaient sur 2119 MHz, l''ALSEP d''Apollo 12 émettait sa télémétrie sur 2278,5 MHz via son antenne hélicoïdale axiale de 58 cm.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6d74ed9f-d9b7-48c1-adf3-0f8e01e7edeb', '71eb87d2-4a6c-4a17-9a7a-b5118b0e5e1a', '2278,5 MHz', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7a092b49-a15c-4428-ad81-cb49794ab249', '71eb87d2-4a6c-4a17-9a7a-b5118b0e5e1a', '2278,0 MHz', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e57b0e27-5ef5-479f-a6ad-29084cb4dd24', '71eb87d2-4a6c-4a17-9a7a-b5118b0e5e1a', '2276,5 MHz', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a29078dd-3a19-462f-a93f-48885196c7b4', '71eb87d2-4a6c-4a17-9a7a-b5118b0e5e1a', '2119,0 MHz', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f7d299c3-800c-48d6-9299-fe61ba906462', 'd72b3c76-101b-406c-8e53-ba4446db0768', 'Quels éléments techniques composaient la station centrale de l''ALSEP d''Apollo 12 ? (Plusieurs bonnes réponses)', 'La station centrale (25 kg, 34 800 cm³) intégrait régulation thermique passive/active, électronique de télémétrie, conditionnement électrique et antenne hélicoïdale pointée vers la Terre.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('25247cb5-b579-4156-90bf-6d00bbc4c4e4', 'f7d299c3-800c-48d6-9299-fe61ba906462', 'Des éléments passifs (isolation, réflecteurs, revêtements thermiques) et des résistances chauffantes ET Des émetteurs, récepteurs, processeurs de données et multiplexeurs ET Une unité de conditionnement et de distribution de puissance reliée au RTG par câble ET Une antenne hélicoïdale axiale modifiée de 58 cm de long et 3,8 cm de diamètre', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a17016ba-f089-4013-9ea1-43f4a0040158', 'f7d299c3-800c-48d6-9299-fe61ba906462', 'Un ordinateur quantique refroidi à l''azote liquide', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4766f3c4-d4e7-4f40-9e26-655b2ef8a21d', 'f7d299c3-800c-48d6-9299-fe61ba906462', 'Des éléments passifs (isolation, réflecteurs, revêtements thermiques) et des résistances chauffantes', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('8a5f7f53-efd0-4bde-a0ce-123d3978b46a', 'd72b3c76-101b-406c-8e53-ba4446db0768', 'À quelles coordonnées sélénographiques l''étage de remontée d''Intrepid a-t-il percuté la Lune pour créer le premier séisme artificiel enregistré ?', 'Largué le 20 novembre 1969 à 20:21:30 UT après amarrage au CSM de Richard Gordon, l''étage de remontée a frappé la Lune à 3,94° S, 338,80° E.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('49e18733-3acb-4c13-bda7-113df3ce4f7b', '8a5f7f53-efd0-4bde-a0ce-123d3978b46a', '3,94° S, 338,80° E', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('259e5ead-a122-4411-acd1-f54eb04893c9', '8a5f7f53-efd0-4bde-a0ce-123d3978b46a', '26,36° N, 0,25° E', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fed0b2b3-9a61-4446-aecb-ce23e04f507f', '8a5f7f53-efd0-4bde-a0ce-123d3978b46a', '0,67416° N, 23,47314° E', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('122e2b1b-1076-4387-899c-b1533c13ee8b', '8a5f7f53-efd0-4bde-a0ce-123d3978b46a', '3,0128° S, 23,4219° W', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('5949f622-7210-440a-9d6d-66005c08ba5f', 'd72b3c76-101b-406c-8e53-ba4446db0768', 'Ordonne chronologiquement les opérations orbitales d''Apollo 12 le 20 novembre 1969 (en heures UT).', 'Intrepid a décollé le 20 novembre à 14:25:47 UT, s''est amarré au CSM à 17:58:22 UT, puis a été largué à 20:21:30 UT pour impacter la Lune.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('017f5f39-9fe3-462a-92f9-4742cb4ecd97', '5949f622-7210-440a-9d6d-66005c08ba5f', '1. Décollage d''Intrepid de la surface lunaire (14:25:47 UT) ➔ 2. Amarrage d''Intrepid au module de commande piloté par Richard F. Gordon Jr. (17:58:22 UT) ➔ 3. Largage de l''étage de remontée d''Intrepid pour impact lunaire (20:21:30 UT)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d6ad8b37-5207-423e-8e0b-43fee032c2ee', '5949f622-7210-440a-9d6d-66005c08ba5f', '1. Largage de l''étage de remontée d''Intrepid pour impact lunaire (20:21:30 UT) ➔ 2. Amarrage d''Intrepid au module de commande piloté par Richard F. Gordon Jr. (17:58:22 UT) ➔ 3. Décollage d''Intrepid de la surface lunaire (14:25:47 UT)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('76f85646-9402-4e8e-8cda-5b8b60da45bc', '5949f622-7210-440a-9d6d-66005c08ba5f', '1. Amarrage d''Intrepid au module de commande piloté par Richard F. Gordon Jr. (17:58:22 UT) ➔ 2. Décollage d''Intrepid de la surface lunaire (14:25:47 UT) ➔ 3. Largage de l''étage de remontée d''Intrepid pour impact lunaire (20:21:30 UT)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('7754b09b-92cc-4ae2-81aa-33f35b901247', 'd72b3c76-101b-406c-8e53-ba4446db0768', 'Quelles sont les dimensions exactes de l''ensemble générateur SNAP-27 (cylindre central et ailettes rayonnantes) ?', 'L''assemblage SNAP-27 (17 kg) consistait en un cylindre central de 46 cm de haut entouré de 8 ailettes rayonnantes rectangulaires atteignant 40 cm de diamètre hors tout.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('df9f83f9-fd37-4f2b-84bd-ac56654c3e88', '7754b09b-92cc-4ae2-81aa-33f35b901247', 'Cylindre central de 46 cm de haut avec 8 ailettes rectangulaires d''une envergure totale de 40 cm', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7a13d439-a31c-49f9-b7e9-01260fb8eff1', '7754b09b-92cc-4ae2-81aa-33f35b901247', 'Cylindre central de 58 cm de haut avec 4 ailettes de 3,8 cm de diamètre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9bdcad0d-ce32-415e-8962-af6e262a6bc2', '7754b09b-92cc-4ae2-81aa-33f35b901247', 'Cube de 1,7 m de côté pesant 25 kg', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('198a1a83-4bd4-4a9a-af20-20a5e76b6a10', '7754b09b-92cc-4ae2-81aa-33f35b901247', 'Prisme octogonal de 4,2 m de large', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('7bf3ee7e-c097-4752-9b6e-1167ba682430', 'd72b3c76-101b-406c-8e53-ba4446db0768', 'Vrai ou faux : La capsule de plutonium-238 (environ 4 kg) était déjà insérée dans le générateur SNAP-27 avant le lancement depuis Cap Canaveral.', 'Faux, la fiche technique précise que la capsule de combustible (~4 kg en forme de longue tige) était placée dans le cylindre interne du RTG par les astronautes lors du déploiement sur la Lune.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('99039c26-c78c-4a18-966f-f88a75f2d0d1', '7bf3ee7e-c097-4752-9b6e-1167ba682430', 'Vrai', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c991d9ba-19e9-490c-b4ba-f23db91668a5', '7bf3ee7e-c097-4752-9b6e-1167ba682430', 'Faux', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('cd891ce3-f87a-4b20-80c1-9b6e4b1df3d3', 'd72b3c76-101b-406c-8e53-ba4446db0768', 'Quels phénomènes physiques les trois instruments décrits de l''ALSEP d''Apollo 12 étaient-ils conçus pour mesurer ? (Plusieurs bonnes réponses)', 'Le sismomètre passif étudiait la croûte et l''intérieur, le détecteur d''ions suprathermiques mesurait les ions positifs de basse énergie, et la jauge à cathode froide surveillait l''exosphère.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('03de777d-9a6a-4b3f-b60e-791f804df2d8', 'cd891ce3-f87a-4b20-80c1-9b6e4b1df3d3', 'L''activité sismique et les propriétés physiques de la croûte et de l''intérieur lunaires ET Le flux, la composition, l''énergie et la vitesse des ions positifs de basse énergie ET La pression et les variations temporelles ou solaires de l''atmosphère lunaire', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8de6987c-709d-4b3e-9fa2-3e0faa26f40c', 'cd891ce3-f87a-4b20-80c1-9b6e4b1df3d3', 'La concentration en dioxyde de carbone des océans lunaires ET La vitesse des vents stratosphériques de la Lune', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4fda0b69-9059-4c6b-9a31-142039b54f58', 'cd891ce3-f87a-4b20-80c1-9b6e4b1df3d3', 'L''activité sismique et les propriétés physiques de la croûte et de l''intérieur lunaires', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c886c6d5-f420-4411-96fb-79b3170eae14', 'd72b3c76-101b-406c-8e53-ba4446db0768', 'Associe chaque grandeur physique de l''ALSEP d''Apollo 12 à sa valeur exacte.', 'Ces quatre valeurs caractérisent le carburant isotopique (89,6 ans), la sortie électrique du SNAP-27 (16 V CC), la liaison montante (2119 MHz) et l''encombrement de la station centrale (34 800 cm³).', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c8cc2284-dadb-4b0c-bf56-e9482721f8f2', 'c886c6d5-f420-4411-96fb-79b3170eae14', 'Demi-vie du plutonium-238 = 89,6 ans | Tension nominale de sortie du RTG = 16 V CC | Fréquence de télécommande montante ALSEP = 2119 MHz | Volume rangé de la station centrale = 34 800 cm³', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('002d9a28-73fe-48ed-ab73-fcbb2871d95c', 'c886c6d5-f420-4411-96fb-79b3170eae14', 'Demi-vie du plutonium-238 = 16 V CC | Tension nominale de sortie du RTG = 2119 MHz | Fréquence de télécommande montante ALSEP = 34 800 cm³ | Volume rangé de la station centrale = 89,6 ans', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('005786ac-b9dd-4768-94b5-e29a9b921ec0', 'd72b3c76-101b-406c-8e53-ba4446db0768', 'Quelle évolution majeure distingue l''ALSEP (déployé dès Apollo 12) de l''EASEP d''Apollo 11 ?', 'Alors que l''EASEP d''Apollo 11 dépendait de panneaux solaires et ne fonctionnait que le jour lunaire, l''ALSEP utilisait un RTG SNAP-27 au plutonium-238 assurant des mesures continues jusqu''en 1977.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('eec63c19-b5ae-4272-aa6a-191a87a30512', '005786ac-b9dd-4768-94b5-e29a9b921ec0', 'Le remplacement des panneaux solaires par un générateur RTG SNAP-27 permettant un fonctionnement continu jour et nuit', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8b6575e0-48a0-4b98-bb14-55c791065f64', '005786ac-b9dd-4768-94b5-e29a9b921ec0', 'L''abandon de toute liaison radio directe avec la Terre au profit d''un relais martien', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8c384f1b-0b7c-4fc1-8bcb-a9b7f757f667', '005786ac-b9dd-4768-94b5-e29a9b921ec0', 'La réduction de la masse totale de 48 kg à 5 kg', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('49b8baa9-121c-4821-b7a3-34b3953c95be', '005786ac-b9dd-4768-94b5-e29a9b921ec0', 'L''utilisation exclusive de piles alcalines jetables', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('fa7975a0-f0f4-41dc-a2e0-59448769b0ce', 'd72b3c76-101b-406c-8e53-ba4446db0768', 'Quel responsable occupait le poste de Project Manager au NASA Johnson Space Center pour le programme documenté dans la fiche ?', 'Mr. Wilbert F. Eichelman était Project Manager au NASA Johnson Space Center, tandis que Mr. Floyd I. Roberson était Program Manager et Dr. John B. Hanley Program Scientist au siège de la NASA.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9285f626-b31d-4008-a621-4b726074256c', 'fa7975a0-f0f4-41dc-a2e0-59448769b0ce', 'Mr. Wilbert F. Eichelman', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4269851e-d1ce-4428-8d25-a5740af74cd9', 'fa7975a0-f0f4-41dc-a2e0-59448769b0ce', 'Mr. Floyd I. Roberson', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e0e6bdc9-af05-4d76-8ab3-62c7c59fd522', 'fa7975a0-f0f4-41dc-a2e0-59448769b0ce', 'Dr. John B. Hanley', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('797c18b3-5467-45ec-ab95-ec8960f95dfb', 'fa7975a0-f0f4-41dc-a2e0-59448769b0ce', 'Mr. Richard F. Gordon Jr.', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('d814b208-7208-436d-b3ad-a096af022bbc', 'd72b3c76-101b-406c-8e53-ba4446db0768', 'Quelles affirmations comparant les modules lunaires d''Apollo 11, Apollo 12 et Apollo 15 sont exactes ? (Plusieurs bonnes réponses)', 'Les trois LM reposaient sur la même architecture bi-étage lancée par Saturn 5, avec une masse croissante (15 103 kg, 15 235 kg, 16 430 kg) selon la charge scientifique embarquée.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3caf98bf-223f-4f76-ad29-bb1eda8829b6', 'd814b208-7208-436d-b3ad-a096af022bbc', 'Tous trois partageaient la même architecture à deux étages avec moteur de descente (~45 000 N) et de remontée (~15 000 N) ET La masse totale a augmenté progressivement : 15 103 kg (Apollo 11), 15 235 kg (Apollo 12) et 16 430 kg (Apollo 15) ET Tous trois utilisaient de l''aérozine 50 et du peroxyde d''azote comme ergols ET Tous trois étaient propulsés vers la Lune par un lanceur Saturn 5 depuis Cap Canaveral', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6c008bb8-fe98-46aa-9860-66ef65aa3a58', 'd814b208-7208-436d-b3ad-a096af022bbc', 'Aucun des trois n''a laissé son étage de descente sur la Lune', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9fadde64-e6a0-42d5-aeee-66350d595029', 'd814b208-7208-436d-b3ad-a096af022bbc', 'Tous trois partageaient la même architecture à deux étages avec moteur de descente (~45 000 N) et de remontée (~15 000 N)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Véhicules Lunaires Mobiles LRV & Apollo 15 (Explorateur) (vehicules-lunaires-mobiles-lrv-explorer)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('79156376-2450-4373-b3b2-e934518edc93', 'vehicules-lunaires-mobiles-lrv-explorer', 'Véhicules Lunaires Mobiles LRV & Apollo 15 (Explorateur)', 'EXPLORER'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'moon' LIMIT 1), (SELECT "id" FROM "machines" WHERE "slug" = 'apollo-15-lrv' LIMIT 1), true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('ecc79a99-992e-485e-8c4a-41f376c2d683', '79156376-2450-4373-b3b2-e934518edc93', 'Quel surnom amusant donne-t-on aux véhicules lunaires mobiles (LRV) pilotés par les astronautes ?', 'Les trois véhicules lunaires mobiles électriques sont surnommés des « buggies lunaires » et sont restés stationnés sur la Lune.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('abd986ac-456f-4945-8a80-05626b545c7b', 'ecc79a99-992e-485e-8c4a-41f376c2d683', 'Les buggies lunaires', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('db00215b-e79f-44c9-926d-1510d3b4f06c', 'ecc79a99-992e-485e-8c4a-41f376c2d683', 'Les sous-marins lunaires', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e374bee2-57d5-4d39-850a-aba3b4b7c384', 'ecc79a99-992e-485e-8c4a-41f376c2d683', 'Les fusées à roulettes', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('01448797-c4db-42ea-9b8d-be4b2c77f89f', 'ecc79a99-992e-485e-8c4a-41f376c2d683', 'Les traîneaux de l''espace', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c53a894d-f4e5-4e94-97bd-81b575649fcc', '79156376-2450-4373-b3b2-e934518edc93', 'Combien de véhicules lunaires mobiles (LRV) ont été envoyés et laissés sur la Lune ?', 'Trois buggies lunaires électriques ont été utilisés sur la Lune (missions Apollo 15, 16 et 17) et y sont restés.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b74eafba-fd79-4c48-8b2f-f6da342086e0', 'c53a894d-f4e5-4e94-97bd-81b575649fcc', '3 véhicules', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ec2faa4b-8ed1-42d4-abd0-24c22d20ad5f', 'c53a894d-f4e5-4e94-97bd-81b575649fcc', '5 véhicules', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('94c07455-1330-48df-826c-fd3a07b15bfa', 'c53a894d-f4e5-4e94-97bd-81b575649fcc', '2 véhicules', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e6fcafa0-91b8-4808-8d70-52fc7ca73e21', 'c53a894d-f4e5-4e94-97bd-81b575649fcc', '6 véhicules', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('ab13b920-5121-4094-8888-c46d9a015a2e', '79156376-2450-4373-b3b2-e934518edc93', 'Avec quelle énergie fonctionnaient les véhicules lunaires mobiles ?', 'Les LRV étaient des véhicules électriques pilotés directement par les astronautes sur la Lune.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('48d69b2b-8bfa-490b-b060-ed5f9e809861', 'ab13b920-5121-4094-8888-c46d9a015a2e', 'À l''électricité', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8e61f640-c4f2-4bf9-bb60-aaa3db0c4a8f', 'ab13b920-5121-4094-8888-c46d9a015a2e', 'À l''essence', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3be38f79-520c-42c1-9833-1336ef8273e5', 'ab13b920-5121-4094-8888-c46d9a015a2e', 'Au charbon', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b1b69f51-884e-4b20-b631-9f607085f2cc', 'ab13b920-5121-4094-8888-c46d9a015a2e', 'À la vapeur d''eau', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('3f3178c8-1a66-43d5-a491-d02c0b13db57', '79156376-2450-4373-b3b2-e934518edc93', 'Vrai ou faux : Les astronautes ont ramené les buggies lunaires sur Terre après leur mission.', 'Faux, les trois véhicules lunaires mobiles sont restés stationnés en permanence sur la surface de la Lune.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ca1a4ffd-501c-4fec-941b-48cfb2ff7fe4', '3f3178c8-1a66-43d5-a491-d02c0b13db57', 'Vrai', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5dff5c7e-8ba1-40f6-921a-0392efd457b4', '3f3178c8-1a66-43d5-a491-d02c0b13db57', 'Faux', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('3469c52d-6bb4-4c54-8c30-99cb09a5f282', '79156376-2450-4373-b3b2-e934518edc93', 'Quelle mission Apollo a utilisé pour la toute première fois un véhicule lunaire mobile ?', 'Apollo 15 (juillet 1971) a été la première mission à utiliser un véhicule lunaire mobile sur la Lune.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('087e4c21-9757-4506-b5b8-1397c624686f', '3469c52d-6bb4-4c54-8c30-99cb09a5f282', 'Apollo 15', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('02e4e1ef-f976-4881-8ce4-ed5106899619', '3469c52d-6bb4-4c54-8c30-99cb09a5f282', 'Apollo 11', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c5da83ab-6ee3-4437-b4bc-c052cab12722', '3469c52d-6bb4-4c54-8c30-99cb09a5f282', 'Apollo 8', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('15a48195-9e2e-4099-9c5a-05859190ebaf', '3469c52d-6bb4-4c54-8c30-99cb09a5f282', 'Apollo 13', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('7ded0053-5410-4bac-9259-0670e805c712', '79156376-2450-4373-b3b2-e934518edc93', 'À quoi servait le véhicule lunaire mobile pendant la mission Apollo 15 ? (Plusieurs bonnes réponses)', 'Grâce au LRV, les astronautes ont parcouru 27,9 km et collecté 77,31 kg d''échantillons de roches et de sol.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d7c7d529-be29-4e3c-b4ca-688f6c717c5a', '7ded0053-5410-4bac-9259-0670e805c712', 'À transporter les astronautes plus loin de leur vaisseau ET À explorer des montagnes et des cratères ET À rapporter des roches et du sol lunaires', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9e463e85-7b74-4326-9617-404fe23bca8b', '7ded0053-5410-4bac-9259-0670e805c712', 'À voler jusqu''à la Terre ET À nager dans les mers lunaires', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ca05ff5f-1833-4382-ba14-a308824436e4', '7ded0053-5410-4bac-9259-0670e805c712', 'À transporter les astronautes plus loin de leur vaisseau', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c58df1aa-9276-4119-beb9-a6156e7d7410', '79156376-2450-4373-b3b2-e934518edc93', 'À la fin d''Apollo 15, quels deux objets l''astronaute David Scott a-t-il lâchés en même temps devant la caméra ?', 'Sur la Lune où il n''y a pas d''air, le marteau et la plume sont tombés exactement à la même vitesse !', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('18fbe430-0ecd-4018-b0f3-4fff8fdf4597', 'c58df1aa-9276-4119-beb9-a6156e7d7410', 'Un marteau et une plume', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d5ed982c-5a1c-4134-91c4-816bf497a47f', 'c58df1aa-9276-4119-beb9-a6156e7d7410', 'Une pomme et une pierre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e7961bc1-9090-4eb9-a41b-8233aa4a3db2', 'c58df1aa-9276-4119-beb9-a6156e7d7410', 'Un ballon et une clé', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d7d3baae-5f37-4e4b-b0f7-8d5ab434ba1a', 'c58df1aa-9276-4119-beb9-a6156e7d7410', 'Un livre et une pièce', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c6c9e3c7-e07a-40b4-aaaf-1ea595035836', '79156376-2450-4373-b3b2-e934518edc93', 'Vrai ou faux : Sur la Lune, le marteau et la plume ont touché le sol en même temps.', 'Vrai ! En l''absence d''atmosphère sur la Lune, la résistance de l''air n''existe pas : le marteau et la plume tombent à la même vitesse.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('31d4ed8c-7fe5-402f-9661-396d74b254dc', 'c6c9e3c7-e07a-40b4-aaaf-1ea595035836', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5f29b212-25ac-4850-ace8-de7d147b2877', 'c6c9e3c7-e07a-40b4-aaaf-1ea595035836', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('549d6606-88f6-42df-85da-3f47a7feb3c9', '79156376-2450-4373-b3b2-e934518edc93', 'Quelle géante fusée a lancé la mission Apollo 15 vers la Lune ?', 'Comme les autres missions lunaires Apollo, Apollo 15 a décollé grâce à la puissante fusée Saturn 5.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3074d7f8-6717-4aa8-9ade-548adb33b2ec', '549d6606-88f6-42df-85da-3f47a7feb3c9', 'Saturn 5', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a6725c96-90b5-4078-948c-423df6fd3f8c', '549d6606-88f6-42df-85da-3f47a7feb3c9', 'Ariane 5', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('62fa063c-9128-4928-b953-1254be02ff0c', '549d6606-88f6-42df-85da-3f47a7feb3c9', 'Falcon 9', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f110c52f-e5c0-4a9d-9ab6-e4cb652a00d6', '549d6606-88f6-42df-85da-3f47a7feb3c9', 'Soyouz', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e4f875ad-2452-439c-9fb1-9dd4421ec053', '79156376-2450-4373-b3b2-e934518edc93', 'Remets dans l''ordre les distances parcourues par les astronautes lors des trois sorties (EVA) d''Apollo 15.', 'Les astronautes ont parcouru 10,3 km lors de la 1re sortie, 12,5 km lors de la 2e et 5,1 km lors de la 3e, soit 27,9 km au total.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('215c0bc1-f856-49f4-b2c5-49d523d2b598', 'e4f875ad-2452-439c-9fb1-9dd4421ec053', '1. Sortie 1 : 10,3 km ➔ 2. Sortie 2 : 12,5 km ➔ 3. Sortie 3 : 5,1 km', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4dc901c7-3115-4d1f-820d-3fed5d2215fc', 'e4f875ad-2452-439c-9fb1-9dd4421ec053', '1. Sortie 3 : 5,1 km ➔ 2. Sortie 2 : 12,5 km ➔ 3. Sortie 1 : 10,3 km', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8acafc18-b1a3-43f3-9ce3-3db8ad7289a2', 'e4f875ad-2452-439c-9fb1-9dd4421ec053', '1. Sortie 2 : 12,5 km ➔ 2. Sortie 1 : 10,3 km ➔ 3. Sortie 3 : 5,1 km', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('7be5d897-f51c-44ba-b0a5-775282160427', '79156376-2450-4373-b3b2-e934518edc93', 'Où était rangé le véhicule lunaire pendant le voyage entre la Terre et la Lune ?', 'L''étage de descente du module lunaire disposait d''un espace de rangement spécial pour transporter le rover sur Apollo 15, 16 et 17.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('113c1930-a758-4ead-a2d3-689b52b5b290', '7be5d897-f51c-44ba-b0a5-775282160427', 'Dans l''étage de descente du module lunaire', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e53cb71d-2811-439b-b214-84af7102845c', '7be5d897-f51c-44ba-b0a5-775282160427', 'Accroché au nez de la fusée à l''air libre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5845e23a-0e92-4561-a843-7abb25c63116', '7be5d897-f51c-44ba-b0a5-775282160427', 'Dans une remorque tirée derrière le vaisseau', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cd065382-6c22-4ac9-b73d-1779eb74d6b0', '7be5d897-f51c-44ba-b0a5-775282160427', 'Sur le toit de la cabine des astronautes', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a7b4f469-b7d6-4a5c-996e-d2dd956275ac', '79156376-2450-4373-b3b2-e934518edc93', 'Quelles missions Apollo ont emporté un véhicule lunaire mobile ? (Plusieurs bonnes réponses)', 'Les trois dernières missions lunaires — Apollo 15, Apollo 16 et Apollo 17 — ont chacune emporté un LRV.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('792ad13c-0c0c-4905-9219-79fed090e985', 'a7b4f469-b7d6-4a5c-996e-d2dd956275ac', 'Apollo 15 ET Apollo 16 ET Apollo 17', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4e416e9a-5db5-4f09-b8e3-ead3793ba7fd', 'a7b4f469-b7d6-4a5c-996e-d2dd956275ac', 'Apollo 11 ET Apollo 12', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1b67a5b1-b7af-44a0-817c-7a6f90967c3f', 'a7b4f469-b7d6-4a5c-996e-d2dd956275ac', 'Apollo 15', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('2396f1d1-d53c-4a2e-857a-8ff1549d5273', '79156376-2450-4373-b3b2-e934518edc93', 'Associe chaque astronaute d''Apollo 15 à son rôle dans la mission.', 'David Scott (commandant) et James Irwin (pilote du LM) ont exploré la Lune tandis qu''Alfred Worden pilotait le module de commande en orbite.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7e5a9637-64db-4810-bf6e-c5266e4107e0', '2396f1d1-d53c-4a2e-857a-8ff1549d5273', 'David R. Scott = Commandant de la mission et pilote du LRV | James B. Irwin = Pilote du module lunaire | Alfred M. Worden = Pilote du module de commande resté en orbite', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('12f159da-3ac6-4e15-b590-618eaf77387d', '2396f1d1-d53c-4a2e-857a-8ff1549d5273', 'David R. Scott = Pilote du module lunaire | James B. Irwin = Pilote du module de commande resté en orbite | Alfred M. Worden = Commandant de la mission et pilote du LRV', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('b890f284-3c1e-4888-ba61-468349127d58', '79156376-2450-4373-b3b2-e934518edc93', 'Quel poids total de roches et de sol lunaires les astronautes d''Apollo 15 ont-ils rapporté ?', 'Grâce à leurs déplacements en LRV, Scott et Irwin ont collecté 77,31 kg d''échantillons lunaires.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('55a48c8f-249b-44fe-a682-6b54dc69d1b2', 'b890f284-3c1e-4888-ba61-468349127d58', '77,31 kg', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1f442087-978d-4765-bfa5-5b70cd3d4dcd', 'b890f284-3c1e-4888-ba61-468349127d58', '5 kg', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('00874dea-1ce0-4cc8-9142-8323789cccdd', 'b890f284-3c1e-4888-ba61-468349127d58', '500 kg', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fdd05d5e-ae5c-4a66-9479-ea5044033c96', 'b890f284-3c1e-4888-ba61-468349127d58', '1 000 kg', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a2d351a0-d8f4-41b7-b212-2e4aa847e88b', '79156376-2450-4373-b3b2-e934518edc93', 'Qu''ont laissé les astronautes d''Apollo 15 sur la Lune en hommage aux explorateurs de l''espace décédés ? (Plusieurs bonnes réponses)', 'Les astronautes ont déposé une plaque et une petite figurine en mémoire des quatorze explorateurs spatiaux américains et soviétiques décédés.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e174bd19-811b-4e42-b8c4-bbc62a16207c', 'a2d351a0-d8f4-41b7-b212-2e4aa847e88b', 'Une plaque commémorative ET Une petite figurine', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('811235bd-aa29-48ef-b78e-520ac680088c', 'a2d351a0-d8f4-41b7-b212-2e4aa847e88b', 'Un véhicule LRV fonctionnel pour le retour ET Un drapeau géant en pierre ET Un téléviseur couleur', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d992cff3-30a7-45cd-87d2-ff8344f11f5c', 'a2d351a0-d8f4-41b7-b212-2e4aa847e88b', 'Une plaque commémorative', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Véhicules Lunaires Mobiles LRV & Apollo 15 (Expert) (vehicules-lunaires-mobiles-lrv-expert)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'vehicules-lunaires-mobiles-lrv-expert', 'Véhicules Lunaires Mobiles LRV & Apollo 15 (Expert)', 'EXPERT'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'moon' LIMIT 1), (SELECT "id" FROM "machines" WHERE "slug" = 'apollo-15-lrv' LIMIT 1), true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('828e493c-2516-41e5-b6f8-de4cb657356e', '29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'Quel a été l''impact de l''emport du LRV et d''équipements accrus sur la masse totale du module lunaire d''Apollo 15 par rapport à Apollo 11 ?', 'Pour emporter le LRV et l''équipement étendu, l''étage de descente d''Apollo 15 atteignait 2 797 kg à sec et 8 873 kg d''ergols, portant le LM à 16 430 kg.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('06edbcb5-9dae-4d59-90b3-523f3c74eb10', '828e493c-2516-41e5-b6f8-de4cb657356e', 'La masse totale est passée de 15 103 kg à 16 430 kg (+1 327 kg), principalement via l''étage de descente et ses ergols', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('706dc8f3-b29a-4b6f-84ec-3bef0268d8a3', '828e493c-2516-41e5-b6f8-de4cb657356e', 'La masse totale a diminué de 2 000 kg grâce à l''aluminium', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('21ad4d69-a5dc-4fa5-bd5b-fcc77b3c1192', '828e493c-2516-41e5-b6f8-de4cb657356e', 'La masse de l''étage de remontée a doublé', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2b3aa05d-4e0c-45b5-ac1d-d26146c7933c', '828e493c-2516-41e5-b6f8-de4cb657356e', 'Aucun changement de masse n''a été nécessaire', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('6d4ae684-2030-43d2-a62a-b2c740abf153', '29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'Calcule la masse totale à sec (en kg) du module lunaire Apollo 15 en additionnant la masse sèche de l''étage de remontée (2 385 kg) et celle de l''étage de descente (2 797 kg).', '2 385 kg (remontée à sec) + 2 797 kg (descente à sec avec équipement stocké) = 5 182 kg (le reste des 16 430 kg étant constitué de 11 248 kg d''ergols).', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('acf7b78a-1170-47ed-bf35-0dc6041d871e', '6d4ae684-2030-43d2-a62a-b2c740abf153', '5182 kg', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a795fa14-fad6-4eec-8dc1-061506c6da7e', '6d4ae684-2030-43d2-a62a-b2c740abf153', '7773 kg', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7618e826-940e-405b-80b9-0886633630a7', '6d4ae684-2030-43d2-a62a-b2c740abf153', '2591 kg', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b795cb31-94d0-4717-b95c-b579cad7690f', '6d4ae684-2030-43d2-a62a-b2c740abf153', '5192 kg', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('cca7d752-ebea-42ec-957a-9fed59db394a', '29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'Quelle est la principale différence fonctionnelle entre le moteur de descente et le moteur de remontée du module lunaire transportant le LRV ?', 'Le moteur de descente ablatif est modulable (deep-throttling) sur cardan jusqu''à ~45 000 N, alors que le moteur de remontée délivre une poussée constante de ~15 000 N.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6c31e8f2-7110-4e6a-b1fe-a2cc2f40cc1d', 'cca7d752-ebea-42ec-957a-9fed59db394a', 'Le moteur de descente est à poussée modulable (jusqu''à ~45 000 N) sur cardan, tandis que le moteur de remontée est à poussée fixe (~15 000 N)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('08ee85ff-382c-4f83-9a00-364bfdd2f555', 'cca7d752-ebea-42ec-957a-9fed59db394a', 'Le moteur de descente fonctionne à poudre et celui de remontée à l''hydrogène liquide', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3b9b805e-51f6-4fa0-ae9b-0638473c9c4c', 'cca7d752-ebea-42ec-957a-9fed59db394a', 'Les deux moteurs ont une poussée identique de 45 000 N', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1c52bd30-e73e-4131-bcb7-5e8be1f1b739', 'cca7d752-ebea-42ec-957a-9fed59db394a', 'Le moteur de remontée sert également au freinage lors de l''atterrissage', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9e9577a9-8229-45ee-9ae9-28ca82bf11a8', '29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'Vrai ou faux : Le site d''atterrissage d''Apollo 15 dans Mare Imbrium se situe dans l''hémisphère sud de la Lune.', 'Faux, le site se trouve dans l''hémisphère nord lunaire, aux coordonnées 26,13239° N de latitude et 3,63330° E de longitude.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b62e57d5-d718-4ac2-b874-1d2b35660598', '9e9577a9-8229-45ee-9ae9-28ca82bf11a8', 'Vrai', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fc8646f7-d30c-4a56-82ff-ac3a7c923004', '9e9577a9-8229-45ee-9ae9-28ca82bf11a8', 'Faux', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f46f6143-9304-4b8a-bb56-8973a7680e07', '29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'Par quel principe physique le générateur RTG SNAP-27 alimentait-il la station ALSEP déployée lors d''Apollo 15 ?', 'Une capsule de plutonium-238 (demi-vie de 89,6 ans) chauffe 442 couples thermoélectriques en tellurure de plomb, produisant environ 70 W en courant continu sous 16 V.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0fa07259-3d3f-48ef-8941-b07d92e86f94', 'f46f6143-9304-4b8a-bb56-8973a7680e07', 'La décroissance du plutonium-238 chauffe 442 thermocouples en tellurure de plomb qui génèrent ~70 W CC à 16 V', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b495d5a1-c737-460c-8c2a-65e5fe564f6f', 'f46f6143-9304-4b8a-bb56-8973a7680e07', 'Des cellules photovoltaïques au silicium alimentent des batteries au lithium', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e98537ab-a52e-42fe-acf2-582969cb3709', 'f46f6143-9304-4b8a-bb56-8973a7680e07', 'Une micro-turbine à vapeur de mercure entraîne un alternateur', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dc6c45e8-40c7-4912-87b8-78c935b6329c', 'f46f6143-9304-4b8a-bb56-8973a7680e07', 'Des piles à combustible hydrogène-oxygène récupérées sur le LM', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('ecc98d99-90c6-4628-8d17-4524892b7627', '29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'Quelles caractéristiques géométriques exactes définissent le module lunaire ayant acheminé le LRV ? (Plusieurs bonnes réponses)', 'L''étage de descente octogonal (4,2 m × 1,7 m) reposait sur 4 jambes écartées de 9,4 m offrant une garde au sol de 1,5 m, tandis que la cabine pressurisée mesurait 6,65 m³.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e2d04b4a-2e45-495c-abf1-4b6b1c12bd14', 'ecc98d99-90c6-4628-8d17-4524892b7627', 'Distance de 9,4 m entre les patins d''atterrissage opposés ET Garde au sol de 1,5 m sous l''étage de descente ET Volume pressurisé de 6,65 m³ pour le compartiment équipage ET Étage de descente octogonal de 4,2 m de large sur 1,7 m d''épaisseur', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d576c432-db64-4e1a-88ff-36ce3831fd31', 'ecc98d99-90c6-4628-8d17-4524892b7627', 'Hauteur totale de 35 mètres', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e7b6bec7-5ce5-4b78-8e38-c5b0224a8046', 'ecc98d99-90c6-4628-8d17-4524892b7627', 'Distance de 9,4 m entre les patins d''atterrissage opposés', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('b9f8fdf2-6e42-4d96-ba18-2dd5aeb373a8', '29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'Quelles fréquences radio étaient utilisées pour la liaison montante (commande) et descendante (télémétrie) de l''ALSEP d''Apollo 15 ?', 'La fréquence montante de tous les ALSEP était de 2119 MHz, et la fréquence descendante spécifique à l''ALSEP d''Apollo 15 était de 2278,0 MHz.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8be156a9-90ba-4746-b829-32ddc41a60a3', 'b9f8fdf2-6e42-4d96-ba18-2dd5aeb373a8', '2119 MHz en liaison montante et 2278,0 MHz en liaison descendante', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('60918686-9786-4f78-9d54-5ec3d61baa70', 'b9f8fdf2-6e42-4d96-ba18-2dd5aeb373a8', '1420 MHz en liaison montante et 1600 MHz en liaison descendante', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7dd53d5c-eda9-4db3-829f-02226d1effcf', 'b9f8fdf2-6e42-4d96-ba18-2dd5aeb373a8', '2400 MHz en liaison montante et 5000 MHz en liaison descendante', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('378a15f9-42fe-40df-ae8f-5c1654d9144a', 'b9f8fdf2-6e42-4d96-ba18-2dd5aeb373a8', '108 MHz en liaison montante et 433 MHz en liaison descendante', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('bb9ae001-4d67-4fd7-a271-c877f27b75ae', '29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'Ordonne chronologiquement la fin de la mission lunaire d''Apollo 15 en temps universel (UT).', 'Falcon a décollé le 2 août à 17:11:22 UT, s''est amarré à 19:09:47 UT, a été largué le 3 août à 01:04:14 UT et a percuté la Lune deux heures plus tard à 03:03:37 UT.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a0cb1b53-7989-4614-ad19-b3d323f0982c', 'bb9ae001-4d67-4fd7-a271-c877f27b75ae', '1. Décollage du module lunaire Falcon depuis la surface lunaire (2 août, 17:11:22 UT) ➔ 2. Amarrage au module de commande piloté par Alfred Worden (2 août, 19:09:47 UT) ➔ 3. Largage de l''étage de remontée du LM (3 août, 01:04:14 UT) ➔ 4. Impact volontaire de l''étage de remontée sur la Lune à 26,36° N, 0,25° E (3 août, 03:03:37 UT)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('216b380e-1f86-4c99-882d-4501bfb2c5a6', 'bb9ae001-4d67-4fd7-a271-c877f27b75ae', '1. Impact volontaire de l''étage de remontée sur la Lune à 26,36° N, 0,25° E (3 août, 03:03:37 UT) ➔ 2. Largage de l''étage de remontée du LM (3 août, 01:04:14 UT) ➔ 3. Amarrage au module de commande piloté par Alfred Worden (2 août, 19:09:47 UT) ➔ 4. Décollage du module lunaire Falcon depuis la surface lunaire (2 août, 17:11:22 UT)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4c85e19e-4dca-4129-8a6b-31094f345339', 'bb9ae001-4d67-4fd7-a271-c877f27b75ae', '1. Amarrage au module de commande piloté par Alfred Worden (2 août, 19:09:47 UT) ➔ 2. Décollage du module lunaire Falcon depuis la surface lunaire (2 août, 17:11:22 UT) ➔ 3. Largage de l''étage de remontée du LM (3 août, 01:04:14 UT) ➔ 4. Impact volontaire de l''étage de remontée sur la Lune à 26,36° N, 0,25° E (3 août, 03:03:37 UT)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('0c546d37-4709-4951-894f-3bb39a595ba4', '29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'Quel couple d''ergols hypergoliques alimentait les réservoirs de l''étage de descente du module lunaire ?', 'L''étage de descente contenait deux réservoirs d''aérozine 50 (carburant) et deux réservoirs de peroxyde d''azote (nitrogen tetroxide, comburant).', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1ef9411b-dae2-4b2d-8060-0ee9b189b00b', '0c546d37-4709-4951-894f-3bb39a595ba4', 'Aérozine 50 (carburant) et peroxyde d''azote (comburant)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e93f0dbd-2fc3-473d-9cd5-a5266588ca8f', '0c546d37-4709-4951-894f-3bb39a595ba4', 'Kérosène RP-1 et oxygène liquide', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4e362d7b-15e5-4131-83e5-97ab5dccbfdf', '0c546d37-4709-4951-894f-3bb39a595ba4', 'Hydrogène liquide et fluor liquide', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9780182f-7ce7-4a99-ba11-b7b06c07c149', '0c546d37-4709-4951-894f-3bb39a595ba4', 'Méthane liquide et peroxyde d''hydrogène', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e67b8158-b6cb-4294-8798-3a894a9ca12b', '29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'Vrai ou faux : Le rayon maximal d''éloignement du LRV (5 km autour du LM) était limité par la capacité des astronautes à revenir à pied en cas de panne du véhicule.', 'Vrai, bien que les trois traversées aient totalisé 27,9 km, le LRV n''a exploré que des régions situées à moins de 5 km du site d''atterrissage du LM.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('14dafd58-7dc4-4d9c-a8dc-56be940f9d79', 'e67b8158-b6cb-4294-8798-3a894a9ca12b', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5002d9cf-1799-4f8c-bfd5-1c05f586ad0d', 'e67b8158-b6cb-4294-8798-3a894a9ca12b', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9d4bf0c4-cae9-42fc-a683-7d4b512edfbb', '29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'Quels instruments faisaient partie de la suite scientifique ALSEP déployée lors d''Apollo 15 ? (Plusieurs bonnes réponses)', 'L''ALSEP d''Apollo 15 comprenait notamment un sismomètre passif, un magnétomètre de surface (LSM), un spectromètre de vent solaire et un détecteur de poussière.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('142cac31-9955-4af8-bc67-cb72b96fe38f', '9d4bf0c4-cae9-42fc-a683-7d4b512edfbb', 'Un sismomètre passif ET Un magnétomètre de surface lunaire (LSM) ET Un spectromètre de vent solaire ET Un détecteur de poussière (Dust Detector)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d8d27121-f5fe-4c6d-b713-758c8950a3cf', '9d4bf0c4-cae9-42fc-a683-7d4b512edfbb', 'Un interféromètre optique géant', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('44d63c86-93bc-463c-ac77-0b8b2157c5ce', '9d4bf0c4-cae9-42fc-a683-7d4b512edfbb', 'Un sismomètre passif', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('58878fdf-bb24-4a89-a999-e3ad60a3813b', '29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'Associe chaque sous-système d''Apollo 15 à sa spécification technique précise.', 'Ces données proviennent directement de la fiche technique NSSDCA 1971-063C du module lunaire et de l''ALSEP d''Apollo 15.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5f82bee6-c4ae-433d-9ce5-cbb9727f1a13', '58878fdf-bb24-4a89-a999-e3ad60a3813b', 'Antenne hélicoïdale ALSEP = Longueur de 58 cm et diamètre de 3,8 cm | Générateur RTG SNAP-27 = Masse de 17 kg avec 8 ailettes rayonnantes (40 cm d''envergure) | Propulseurs de contrôle d''attitude (RCS) = Quatre modules délivrant environ 450 N de poussée | Station centrale ALSEP = Masse de 25 kg et volume rangé de 34 800 cm³', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d66b70a1-89ae-48b3-bb9b-fbbf059d7382', '58878fdf-bb24-4a89-a999-e3ad60a3813b', 'Antenne hélicoïdale ALSEP = Masse de 17 kg avec 8 ailettes rayonnantes (40 cm d''envergure) | Générateur RTG SNAP-27 = Quatre modules délivrant environ 450 N de poussée | Propulseurs de contrôle d''attitude (RCS) = Masse de 25 kg et volume rangé de 34 800 cm³ | Station centrale ALSEP = Longueur de 58 cm et diamètre de 3,8 cm', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('56bdf740-a9f6-4b73-bba8-8031e124e803', '29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'Quelle puissance électrique le générateur SNAP-27 produisait-il au bout d''un an de fonctionnement sur la Lune ?', 'Le RTG produisait initialement environ 70 W CC sous 16 V, puis 63,5 W après un an en raison de la décroissance radioactive du plutonium-238.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7f2b42ed-ab35-4bc9-981b-9a70abeabe97', '56bdf740-a9f6-4b73-bba8-8031e124e803', '63,5 W', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4452fec1-c58d-4c86-b02b-ed5d44a15d8f', '56bdf740-a9f6-4b73-bba8-8031e124e803', '16 W', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('df395622-f22e-4caf-a492-45e1cf4fe0e0', '56bdf740-a9f6-4b73-bba8-8031e124e803', '442 W', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('78e1bb87-40d3-4768-8161-156de74265b0', '56bdf740-a9f6-4b73-bba8-8031e124e803', '10 W', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('16140da6-0288-4054-addb-75bf64927603', '29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'Quel était l''objectif scientifique de l''impact volontaire de l''étage de remontée du LM sur la Lune le 3 août 1971 ?', 'Largué après le transfert de l''équipage, l''étage de remontée a percuté la Lune à 26,36° N, 0,25° E afin de générer des ondes sismiques enregistrées par les stations ALSEP.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('24eeff70-91c8-4be1-bd3a-849a4f64f1b1', '16140da6-0288-4054-addb-75bf64927603', 'Générer un signal sismique calibré pour sonder la structure interne de la Lune', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d44ed7e5-238b-41a2-9101-4e011482dae5', '16140da6-0288-4054-addb-75bf64927603', 'Creuser un cratère pour exposer de la glace d''eau', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b571cb1c-a813-41f3-a4df-9fac6068da76', '16140da6-0288-4054-addb-75bf64927603', 'Détruire les déchets biologiques restés à bord', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1a0e56d6-e9e3-424a-aff6-7972b9b422cd', '16140da6-0288-4054-addb-75bf64927603', 'Tester la résistance mécanique des patins d''atterrissage', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c4618f77-888b-4747-8fee-2e8ca4c93879', '29a6740c-71c7-44db-989e-9d0f9e4c39fd', 'Quelles affirmations sur les trois sorties extravéhiculaires (EVA) d''Apollo 15 sont exactes ? (Plusieurs bonnes réponses)', 'EVA 1 (13:13:10 à 19:45:59 UT, 10,3 km), EVA 2 (11:48:48 à 19:01:02 UT, 12,5 km) et EVA 3 (08:52:14 à 13:42:04 UT, 5,1 km) ont toutes utilisé le LRV.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d752b041-c89b-4729-8329-a30beac9266b', 'c4618f77-888b-4747-8fee-2e8ca4c93879', 'L''EVA 1 (31 juillet) a duré plus de 6 h 32 min et a permis de parcourir 10,3 km ET L''EVA 2 (1er août) a duré plus de 7 h 12 min et a couvert la plus grande distance (12,5 km) ET L''EVA 3 (2 août) a duré environ 4 h 50 min sur une distance de 5,1 km', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dc825772-4fcb-4f75-b53a-0a8b9d3ec572', 'c4618f77-888b-4747-8fee-2e8ca4c93879', 'Le LRV n''a été utilisé que lors de la première sortie ET Toutes les sorties ont eu lieu de nuit sans éclairage solaire', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('86fd0a69-907c-4e75-b824-c03acb4dead0', 'c4618f77-888b-4747-8fee-2e8ca4c93879', 'L''EVA 1 (31 juillet) a duré plus de 6 h 32 min et a permis de parcourir 10,3 km', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Hélicoptère Ingenuity sur Mars (Explorateur) (helicoptere-ingenuity-explorer)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('07b272cd-85ba-456c-9a4a-f843f0d80be7', 'helicoptere-ingenuity-explorer', 'Hélicoptère Ingenuity sur Mars (Explorateur)', 'EXPLORER'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'mars' LIMIT 1), (SELECT "id" FROM "machines" WHERE "slug" = 'ingenuity' LIMIT 1), true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a7f5ab3e-14f8-4e34-a2c4-6db5304d5ee4', '07b272cd-85ba-456c-9a4a-f843f0d80be7', 'Sur quelle planète l''hélicoptère Ingenuity a-t-il volé ?', 'Ingenuity a exploré le ciel de Mars, la quatrième planète du Système solaire.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('14aa58a1-9356-4c77-9f77-6c4fe931499f', 'a7f5ab3e-14f8-4e34-a2c4-6db5304d5ee4', 'Vénus', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('96c429a6-f8d7-4638-8feb-1d8818419de6', 'a7f5ab3e-14f8-4e34-a2c4-6db5304d5ee4', 'Mars', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fd8f78a7-db9a-4891-8979-c637e95515da', 'a7f5ab3e-14f8-4e34-a2c4-6db5304d5ee4', 'Jupiter', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('93a52dc6-fe86-47f2-8e00-c98f345225b3', 'a7f5ab3e-14f8-4e34-a2c4-6db5304d5ee4', 'Mercure', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('cf397df6-696b-496b-8816-92606f2eb46d', '07b272cd-85ba-456c-9a4a-f843f0d80be7', 'Vrai ou faux : Ingenuity est le tout premier engin à avoir volé avec un moteur sur une autre planète.', 'Le 19 avril 2021, Ingenuity a réussi le premier vol motorisé et contrôlé sur une autre planète.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4d2b2f1b-d47f-412f-a3c7-697c57ed5d4b', 'cf397df6-696b-496b-8816-92606f2eb46d', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3d5a660c-470b-4cef-b5ff-ab0d85a08d08', 'cf397df6-696b-496b-8816-92606f2eb46d', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e28b16d4-4720-4dd3-b071-4ee51e083649', '07b272cd-85ba-456c-9a4a-f843f0d80be7', 'Quel grand rover a transporté Ingenuity jusqu''à Mars sous son ventre ?', 'Ingenuity a voyagé fixé sous le châssis du rover Perseverance jusqu''à son atterrissage en février 2021.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a5b967fb-0d40-47a8-9b19-254abbfbff10', 'e28b16d4-4720-4dd3-b071-4ee51e083649', 'Sojourner', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('364d6d02-93fe-4a3c-b755-54496e0b5df2', 'e28b16d4-4720-4dd3-b071-4ee51e083649', 'Curiosity', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('38340b9a-8420-40ce-8f69-16b7bad622c1', 'e28b16d4-4720-4dd3-b071-4ee51e083649', 'Perseverance', true, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f428b5e5-e923-470b-9779-72b93f297dd3', 'e28b16d4-4720-4dd3-b071-4ee51e083649', 'Spirit', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('3711ae68-19f4-4d23-9b31-d7e9485455d6', '07b272cd-85ba-456c-9a4a-f843f0d80be7', 'Sur Terre, combien pèse Ingenuity (un peu moins qu''un gros dictionnaire ou deux bouteilles d''eau) ?', 'Ingenuity a une masse de 1,8 kg sur Terre, ce qui le rend très léger pour pouvoir décoller dans l''air fin de Mars.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9a7cd8f6-3988-4391-aa98-2bba2c0ed5b2', '3711ae68-19f4-4d23-9b31-d7e9485455d6', '1.8 kg', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b5c35856-9da9-4788-9d97-ca140e197113', '3711ae68-19f4-4d23-9b31-d7e9485455d6', '3 kg', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5cb943c6-8958-4b86-beff-db9b257b826d', '3711ae68-19f4-4d23-9b31-d7e9485455d6', '1 kg', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('23bdc56c-0b0d-4de8-9403-3e56495952ce', '3711ae68-19f4-4d23-9b31-d7e9485455d6', '4.8 kg', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9ea93a6b-18bc-40fe-8598-7e4092fd4c7f', '07b272cd-85ba-456c-9a4a-f843f0d80be7', 'Comment Ingenuity recharge-t-il ses batteries sur Mars ?', 'Un panneau solaire fixé au-dessus de ses pales capte la lumière du Soleil pour recharger ses batteries.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d18d67c0-cbda-402b-99f6-0bad68a562f9', '9ea93a6b-18bc-40fe-8598-7e4092fd4c7f', 'Avec un panneau solaire placé tout en haut', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('07795f48-a50f-439b-acda-ab1b34b51940', '9ea93a6b-18bc-40fe-8598-7e4092fd4c7f', 'Avec une petite éolienne', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('eeee5f6c-a7a1-468e-af0a-8e4850ac5734', '9ea93a6b-18bc-40fe-8598-7e4092fd4c7f', 'En se branchant sur une prise du rover', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a50b2904-1ddb-4f0d-823c-d4a55ee1014c', '9ea93a6b-18bc-40fe-8598-7e4092fd4c7f', 'Avec des piles jetables', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('b80bf63c-5829-45f8-9d32-4a6470f8a7a5', '07b272cd-85ba-456c-9a4a-f843f0d80be7', 'De quelles parties principales l''hélicoptère Ingenuity est-il composé ? (Plusieurs bonnes réponses)', 'Ingenuity possède un panneau solaire, deux rotors superposés, un petit corps cubique et quatre pieds d''atterrissage.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8fe278f7-3e4f-4f2b-86df-64c03ac3e8ad', 'b80bf63c-5829-45f8-9d32-4a6470f8a7a5', 'Deux grands rotors qui tournent en sens inverse ET Quatre pattes d''atterrissage fines ET Un panneau solaire au sommet', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cb1331dc-5067-487c-bf21-0993200f059b', 'b80bf63c-5829-45f8-9d32-4a6470f8a7a5', 'Une grande voile en tissu ET Des roues pour rouler sur les cailloux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2eaa8044-2b6d-4064-a355-a9b52c28001d', 'b80bf63c-5829-45f8-9d32-4a6470f8a7a5', 'Deux grands rotors qui tournent en sens inverse', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e27502dc-4c82-4461-a4eb-2c4ce361c0fe', '07b272cd-85ba-456c-9a4a-f843f0d80be7', 'Combien de rotors (hélices) Ingenuity possède-t-il l''un au-dessus de l''autre ?', 'Ingenuity est équipé de deux rotors superposés qui tournent en sens opposé pour rester bien stable.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('130eb239-88c1-4405-bf4a-69e1988cb6c9', 'e27502dc-4c82-4461-a4eb-2c4ce361c0fe', '1 rotor', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('690222e8-947b-48ca-ae08-e6eaa2281467', 'e27502dc-4c82-4461-a4eb-2c4ce361c0fe', '2 rotors', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b592c666-1755-48d4-bfed-1cd329bad006', 'e27502dc-4c82-4461-a4eb-2c4ce361c0fe', '4 rotors', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b9e96cab-0fca-479a-8f9f-e84fbdf21220', 'e27502dc-4c82-4461-a4eb-2c4ce361c0fe', '6 rotors', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9e726ee0-a82d-46b2-8840-66c8831119b6', '07b272cd-85ba-456c-9a4a-f843f0d80be7', 'Remets dans l''ordre les étapes d''un vol d''Ingenuity.', 'Chaque vol commence par la recharge des batteries, suivie de la mise en rotation des pales, du décollage, puis de l''atterrissage.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a1bd808f-06b7-4dc3-9c04-97cb8c3a1c30', '9e726ee0-a82d-46b2-8840-66c8831119b6', '1. Le panneau solaire recharge les batteries ➔ 2. Les pales se mettent à tourner très vite ➔ 3. Ingenuity grimpe dans le ciel martien ➔ 4. Ingenuity se pose doucement sur ses quatre pieds', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1949cd09-b662-4aa9-916c-71ec5dc91d98', '9e726ee0-a82d-46b2-8840-66c8831119b6', '1. Ingenuity se pose doucement sur ses quatre pieds ➔ 2. Ingenuity grimpe dans le ciel martien ➔ 3. Les pales se mettent à tourner très vite ➔ 4. Le panneau solaire recharge les batteries', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d17b1c75-3e19-472a-a0cb-7155779d3a92', '9e726ee0-a82d-46b2-8840-66c8831119b6', '1. Les pales se mettent à tourner très vite ➔ 2. Le panneau solaire recharge les batteries ➔ 3. Ingenuity grimpe dans le ciel martien ➔ 4. Ingenuity se pose doucement sur ses quatre pieds', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f720c94c-3bb7-492b-8171-8ddc81a5be38', '07b272cd-85ba-456c-9a4a-f843f0d80be7', 'À quel objet du quotidien ressemble la taille du boîtier central d''Ingenuity ?', 'Le fuselage central d''Ingenuity mesure environ 14 cm sur 19,5 cm, soit la taille d''une boîte de mouchoirs.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dfcb6fa0-96f1-4dc3-b434-c2d829e8a8d3', 'f720c94c-3bb7-492b-8171-8ddc81a5be38', 'Une boîte de mouchoirs', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1fc83e44-8076-463f-8c19-8140206a165b', 'f720c94c-3bb7-492b-8171-8ddc81a5be38', 'Une voiture', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('14232374-8800-4238-921c-8d792684d64f', 'f720c94c-3bb7-492b-8171-8ddc81a5be38', 'Un réfrigérateur', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7cff71ef-0f2d-4d33-bcca-7f73a0b36f3d', 'f720c94c-3bb7-492b-8171-8ddc81a5be38', 'Un autobus', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('4b78d9b5-8f94-4e0c-a1c4-b2ff679caef2', '07b272cd-85ba-456c-9a4a-f843f0d80be7', 'Vrai ou faux : Un pilote sur Terre dirige Ingenuity en direct avec une manette pendant qu''il vole.', 'Les signaux mettent plusieurs minutes à voyager entre la Terre et Mars ; Ingenuity vole donc tout seul grâce à son ordinateur.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('eff31985-4208-4deb-b0b0-d40ababc0199', '4b78d9b5-8f94-4e0c-a1c4-b2ff679caef2', 'Vrai', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('88473be3-7f91-40c8-8d55-bd3ac76aeb1f', '4b78d9b5-8f94-4e0c-a1c4-b2ff679caef2', 'Faux', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e2cb7106-80ea-482e-877a-2b2346339ee7', '07b272cd-85ba-456c-9a4a-f843f0d80be7', 'À quoi a servi Ingenuity pendant sa mission sur Mars ? (Plusieurs bonnes réponses)', 'Ingenuity a démontré le vol sur Mars et a ensuite servi d''éclaireur aérien en photographiant le terrain pour Perseverance.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ebf95100-be86-4c6f-bf74-621c252fa7ec', 'e2cb7106-80ea-482e-877a-2b2346339ee7', 'Prouver qu''il est possible de voler dans l''air de Mars ET Prendre des photos du sol depuis le ciel ET Repérer le chemin devant le rover Perseverance', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('555e29d4-3547-4e68-b58a-db9a0e2760d0', 'e2cb7106-80ea-482e-877a-2b2346339ee7', 'Transporter des astronautes sur Mars ET Creuser des tunnels profonds sous terre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('512d24a6-5d8f-4491-b4cd-aaf5106a48a0', 'e2cb7106-80ea-482e-877a-2b2346339ee7', 'Prouver qu''il est possible de voler dans l''air de Mars', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('ad2ade76-bb6a-4a3c-8c39-05b72499ef93', '07b272cd-85ba-456c-9a4a-f843f0d80be7', 'Associe chaque élément de la mission à son rôle.', 'Ingenuity et Perseverance ont tous deux atterri dans le cratère Jezero sur Mars.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('50ac3bd7-f635-4171-89fd-d9355b08ce0d', 'ad2ade76-bb6a-4a3c-8c39-05b72499ef93', 'Ingenuity = Le petit hélicoptère éclaireur | Perseverance = Le grand rover à six roues | Cratère Jezero = Le lieu sur Mars où ils ont atterri', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e6b26246-33de-428a-af7f-ef6fcd2b3c87', 'ad2ade76-bb6a-4a3c-8c39-05b72499ef93', 'Ingenuity = Le grand rover à six roues | Perseverance = Le lieu sur Mars où ils ont atterri | Cratère Jezero = Le petit hélicoptère éclaireur', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('178d18de-a9b4-418c-99a4-4a2d79c20495', '07b272cd-85ba-456c-9a4a-f843f0d80be7', 'Quel petit souvenir historique était caché sous le panneau solaire d''Ingenuity ?', 'Un minuscule fragment de tissu provenant de l''aile du Wright Flyer de 1903 a voyagé sur Mars avec Ingenuity.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('061873a0-4303-463f-8709-d48fda90dbe1', '178d18de-a9b4-418c-99a4-4a2d79c20495', 'Un morceau de tissu du premier avion des frères Wright', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('63fd48ca-ef67-45c7-9a24-b6a34c0f6134', '178d18de-a9b4-418c-99a4-4a2d79c20495', 'Une pièce de monnaie en or', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('883b8947-a392-4e5f-ba14-42faa11dd08b', '178d18de-a9b4-418c-99a4-4a2d79c20495', 'Une plume d''aigle', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b9b211ac-c126-4ae7-b71e-239268e57b39', '178d18de-a9b4-418c-99a4-4a2d79c20495', 'Un grain de sable de la Lune', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('eb1991b6-43f0-41d3-bd77-574a22ec022c', '07b272cd-85ba-456c-9a4a-f843f0d80be7', 'Quels défis Ingenuity devait-il affronter sur Mars ? (Plusieurs bonnes réponses)', 'Sur Mars, Ingenuity devait survivre au froid intense de la nuit, à la poussière et à une atmosphère très ténue.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5e4aa908-53eb-4de1-806e-977cb1104d82', 'eb1991b6-43f0-41d3-bd77-574a22ec022c', 'Des nuits glaciales où il faut se réchauffer ET Un air très fin et léger ET De la poussière qui peut se poser sur son panneau solaire', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a8a054cc-e5b8-4500-97d6-35895fbda062', 'eb1991b6-43f0-41d3-bd77-574a22ec022c', 'De fortes pluies d''orage ET Des vagues géantes dans l''océan', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('49dfb2f2-8b70-49ee-a8b8-040689db44e9', 'eb1991b6-43f0-41d3-bd77-574a22ec022c', 'Des nuits glaciales où il faut se réchauffer', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('d06b3d5b-8151-48f5-84ce-992889864e21', '07b272cd-85ba-456c-9a4a-f843f0d80be7', 'Combien de vols étaient prévus au départ pour Ingenuity avant qu''il ne dépasse tous les records ?', 'Prévu pour seulement 5 vols d''essai sur 30 jours, Ingenuity en a finalement accompli 72 !', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('36a5e8a0-7a1d-487d-85b2-5480d378279e', 'd06b3d5b-8151-48f5-84ce-992889864e21', '1 vol', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8c04b89f-4e38-42f3-95e7-df021c999d9c', 'd06b3d5b-8151-48f5-84ce-992889864e21', '5 vols', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('63c85e12-8abb-458e-9182-a370d16deb6e', 'd06b3d5b-8151-48f5-84ce-992889864e21', '50 vols', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('578f281e-f2f4-45c1-903b-df86a7daf7b3', 'd06b3d5b-8151-48f5-84ce-992889864e21', '100 vols', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Hélicoptère Ingenuity sur Mars (Expert) (helicoptere-ingenuity-expert)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('ac83c973-d433-4445-8887-eda0fb8e4b49', 'helicoptere-ingenuity-expert', 'Hélicoptère Ingenuity sur Mars (Expert)', 'EXPERT'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'mars' LIMIT 1), (SELECT "id" FROM "machines" WHERE "slug" = 'ingenuity' LIMIT 1), true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('1cc200b3-c2ba-4ed6-a624-a0e5f7600b47', 'ac83c973-d433-4445-8887-eda0fb8e4b49', 'Quelle contrainte aérodynamique majeure limite la vitesse maximale en bout de pale d''Ingenuity sur Mars ?', 'La faible température et la composition riche en CO2 abaissent la vitesse du son à ~240 m/s ; les pales doivent rester sous Mach ~0,7-0,8 pour éviter les ondes de choc transsoniques.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c0b0f197-8a26-488d-90d6-6314f7c21ebb', '1cc200b3-c2ba-4ed6-a624-a0e5f7600b47', 'L''approche du nombre de Mach local en raison d''une vitesse du son plus faible dans le CO2 froid', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2f1d14ee-40a7-4de6-854f-221122c868d3', '1cc200b3-c2ba-4ed6-a624-a0e5f7600b47', 'La fusion thermique des pales par frottement atmosphérique', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('43e787af-3662-4ca7-9f91-75862b2013d2', '1cc200b3-c2ba-4ed6-a624-a0e5f7600b47', 'La cavitation magnétique induite par le noyau martien', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('470db16c-f36c-4d4c-b56b-3505a2b20e3c', '1cc200b3-c2ba-4ed6-a624-a0e5f7600b47', 'Le décrochage supersonique dû à la pression élevée au sol', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a7258703-9777-42a4-88f9-55d9b1030b5d', 'ac83c973-d433-4445-8887-eda0fb8e4b49', 'Sachant que la pesanteur martienne vaut environ 3,72 m/s² et que la masse d''Ingenuity est de 1,8 kg, quel est le poids (force gravitationnelle) d''Ingenuity sur Mars, arrondi au dixième ?', 'P = 1,8 kg × 3,72 m/s² = 6,696 N, soit environ 6,7 N (contre environ 17,7 N sur Terre).', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('02fb7bb1-8006-4cb9-84e7-ef859d99a12b', 'a7258703-9777-42a4-88f9-55d9b1030b5d', '6.7 N', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f301d773-099f-4125-ad12-82576bc457f5', 'a7258703-9777-42a4-88f9-55d9b1030b5d', '10 N', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('08c5fa36-5b2b-4cac-95e9-b57b66905a4e', 'a7258703-9777-42a4-88f9-55d9b1030b5d', '3 N', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e9f49d11-2191-445a-834a-f4777dcbf206', 'a7258703-9777-42a4-88f9-55d9b1030b5d', '9.7 N', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a85a777a-1c83-4bc4-aeda-01d0e4708953', 'ac83c973-d433-4445-8887-eda0fb8e4b49', 'Quel processeur principal, issu de l''électronique grand public (smartphones) mais qualifié par le JPL, pilotait la navigation autonome d''Ingenuity ?', 'Ingenuity embarquait un processeur Qualcomm Snapdragon 801 sous Linux pour exécuter les algorithmes de vision par ordinateur à 30 Hz, supervisé par des microcontrôleurs redondants.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('96a1b401-cbab-4bea-b646-aa1d9f9cd888', 'a85a777a-1c83-4bc4-aeda-01d0e4708953', 'Qualcomm Snapdragon 801', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8a1c6606-6d73-4f49-a3ff-e393a492a83b', 'a85a777a-1c83-4bc4-aeda-01d0e4708953', 'BAE RAD750', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9df56239-1758-4a9b-a10f-a07de95db454', 'a85a777a-1c83-4bc4-aeda-01d0e4708953', 'Intel Pentium III', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('98714de0-c12a-46d5-9b7a-88e046b52422', 'a85a777a-1c83-4bc4-aeda-01d0e4708953', 'ARM Cortex-M0', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9ba502a7-94a6-4c43-8d1d-16db98a7885c', 'ac83c973-d433-4445-8887-eda0fb8e4b49', 'Quelles ont été les causes et manifestations de l''anomalie survenue lors du 6e vol d''Ingenuity le 22 mai 2021 ? (Plusieurs bonnes réponses)', 'Une image perdue a décalé l''horodatage des clichés suivants, perturbant l''estimation d''attitude ; Ingenuity a néanmoins réussi à atterrir à ~5 m de sa cible grâce à ses marges de stabilité.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e6a61661-065d-43ab-811b-6a99f43f1948', '9ba502a7-94a6-4c43-8d1d-16db98a7885c', 'La perte d''une image dans le pipeline de traitement de la caméra de navigation ET Un décalage d''horodatage (timestamp) entre les images et les données de la centrale inertielle (IMU) ET Des oscillations importantes en roulis et tangage allant jusqu''à environ 20 degrés', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7dca41ae-e6f0-4848-98bd-99fa77233222', '9ba502a7-94a6-4c43-8d1d-16db98a7885c', 'La rupture d''un moteur électrique en plein vol ET Une interférence radio provenant d''un satellite chinois', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cfb03ce9-70f2-4140-8a71-fecd7e6311a1', '9ba502a7-94a6-4c43-8d1d-16db98a7885c', 'La perte d''une image dans le pipeline de traitement de la caméra de navigation', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('0f86fd43-f16f-45c3-afbe-760447b15234', 'ac83c973-d433-4445-8887-eda0fb8e4b49', 'Vrai ou faux : L''algorithme de navigation visuelle d''Ingenuity supposait par défaut que le terrain survolé était plat pour estimer sa vitesse horizontale à partir du flux optique.', 'Le filtre de navigation supposait un sol plat ; le survol de pentes raides ou de cratères introduisait des erreurs d''estimation de vitesse que les ingénieurs ont dû corriger par mise à jour logicielle.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('47b09e00-0687-426f-a670-e2ce8a9249eb', '0f86fd43-f16f-45c3-afbe-760447b15234', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d666b45e-f4d5-4ad4-ba4d-3d8e44c8e7a2', '0f86fd43-f16f-45c3-afbe-760447b15234', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('10a852cd-7d32-49b7-ac08-f32f2e1f45ef', 'ac83c973-d433-4445-8887-eda0fb8e4b49', 'Comment Ingenuity contrôlait-il son tangage, son roulis et sa poussée verticale ?', 'Chacun des deux rotors coaxiaux dispose d''un plateau cyclique actionné par trois servomoteurs pour ajuster le pas collectif et cyclique des pales.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('057b2ddc-1af3-4473-b806-19b65b2a64ab', '10a852cd-7d32-49b7-ac08-f32f2e1f45ef', 'Par des plateaux cycliques (swashplates) permettant le pas collectif et cyclique sur les deux rotors', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('998b05a8-7709-4d4d-882e-a4ec24e04b6d', '10a852cd-7d32-49b7-ac08-f32f2e1f45ef', 'En faisant varier indépendamment la vitesse de rotation de quatre moteurs', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9280f2a3-da01-4820-b56f-f3fed047cc1b', '10a852cd-7d32-49b7-ac08-f32f2e1f45ef', 'En déplaçant une masselotte interne sur des rails', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3a3cded5-35e9-47da-86d2-8f4b4451a282', '10a852cd-7d32-49b7-ac08-f32f2e1f45ef', 'Par des gouvernes aérodynamiques situées sur les pieds d''atterrissage', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('bf26e3a4-a263-40dd-9d47-565d5fb7b39d', 'ac83c973-d433-4445-8887-eda0fb8e4b49', 'Remets dans l''ordre la séquence de déploiement d''Ingenuity depuis le ventre de Perseverance en mars-avril 2021.', 'Le déploiement a duré plusieurs sols : retrait du bouclier, basculement vertical, verrouillage des pieds, puis largage final de ~13 cm sur le sol.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f861885f-f995-4ce5-aa7c-7e59469f3211', 'bf26e3a4-a263-40dd-9d47-565d5fb7b39d', '1. Éjection du bouclier de protection contre les débris d''atterrissage ➔ 2. Rotation de l''hélicoptère de la position horizontale à la position verticale ➔ 3. Déploiement des quatre jambes d''atterrissage ➔ 4. Largage d''Ingenuity sur le sol martien depuis une hauteur d''environ 13 cm', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('73b53019-0fbf-46fc-81ac-2dabf56e9f6f', 'bf26e3a4-a263-40dd-9d47-565d5fb7b39d', '1. Largage d''Ingenuity sur le sol martien depuis une hauteur d''environ 13 cm ➔ 2. Déploiement des quatre jambes d''atterrissage ➔ 3. Rotation de l''hélicoptère de la position horizontale à la position verticale ➔ 4. Éjection du bouclier de protection contre les débris d''atterrissage', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4b9dcb6a-de1e-4080-b55f-c429acbdc06d', 'bf26e3a4-a263-40dd-9d47-565d5fb7b39d', '1. Rotation de l''hélicoptère de la position horizontale à la position verticale ➔ 2. Éjection du bouclier de protection contre les débris d''atterrissage ➔ 3. Déploiement des quatre jambes d''atterrissage ➔ 4. Largage d''Ingenuity sur le sol martien depuis une hauteur d''environ 13 cm', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e39efc8d-1c17-44a8-be23-0350a6be92f5', 'ac83c973-d433-4445-8887-eda0fb8e4b49', 'Selon l''enquête du JPL sur le vol 72, quelle est la cause première de l''accident final d''Ingenuity ?', 'Sur une zone de dunes sableuses lisses et sans repères, le système de navigation n''a pas pu mesurer la vitesse horizontale, provoquant un contact latéral dur au sol.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('45e944f9-59fc-47af-93e2-8338e80933c2', 'e39efc8d-1c17-44a8-be23-0350a6be92f5', 'Le manque de textures visuelles sur des ondulations de sable uniforme empêchant le suivi des repères au sol', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0a07c640-838b-4f86-b8d9-51fa07d04d1f', 'e39efc8d-1c17-44a8-be23-0350a6be92f5', 'L''explosion d''une cellule lithium-ion due à une surcharge solaire', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9f22699d-8eec-4beb-acb5-7e63c45ff851', 'e39efc8d-1c17-44a8-be23-0350a6be92f5', 'Une rafale de vent dépassant 150 km/h', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7d21ea9e-26ed-4b69-aa70-97628fc0fd2f', 'e39efc8d-1c17-44a8-be23-0350a6be92f5', 'Le blocage mécanique du plateau cyclique supérieur', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('6f87e9e0-cca8-4cff-8b47-df13f9d27cc1', 'ac83c973-d433-4445-8887-eda0fb8e4b49', 'Quelles adaptations majeures l''équipe du JPL a-t-elle dû mettre en œuvre durant l''hiver martien et la mission prolongée ? (Plusieurs bonnes réponses)', 'En hiver, la poussière et la baisse d''ensoleillement ont obligé Ingenuity à subir des cycles quotidiens de gel nocturne et de redémarrage matinal, tout en adaptant son régime rotor aux variations saisonnières de pression.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b13e4a73-4143-4a26-b5ba-6fe4667cee02', '6f87e9e0-cca8-4cff-8b47-df13f9d27cc1', 'Laisser Ingenuity s''éteindre et geler chaque nuit faute d''énergie solaire suffisante pour le chauffage continu ET Réinitialiser l''horloge interne et la séquence de démarrage chaque matin au lever du Soleil ET Augmenter le régime rotor jusqu''à environ 2 700-2 800 tr/min lors des saisons où la densité atmosphérique était la plus basse', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8fcf1fd5-f7ef-4edd-9431-471b3f990721', '6f87e9e0-cca8-4cff-8b47-df13f9d27cc1', 'Remplacer les batteries usées à l''aide du bras robotique de Perseverance ET Faire hiberner l''hélicoptère sous le rover Perseverance pendant tout l''hiver', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a77d340f-8c44-4db8-bde3-c6b98260cdc7', '6f87e9e0-cca8-4cff-8b47-df13f9d27cc1', 'Laisser Ingenuity s''éteindre et geler chaque nuit faute d''énergie solaire suffisante pour le chauffage continu', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('329dbdc7-3bf2-42a3-9b61-ab31023ca3cf', 'ac83c973-d433-4445-8887-eda0fb8e4b49', 'Associe chaque sous-système d''Ingenuity à sa caractéristique technique.', 'L''architecture d''Ingenuity repose sur des composants légers et éprouvés : radio 900 MHz, 6 cellules Li-ion, caméra VGA au nadir et pales carbone.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0d746206-4296-4893-8fbe-da535259a385', '329dbdc7-3bf2-42a3-9b61-ab31023ca3cf', 'Liaison radio = Protocole Zigbee à 900 MHz sur une portée maximale d''environ 1 000 m | Chauffage nocturne = Résistances chauffantes alimentées par 6 cellules lithium-ion Sony | Caméra de navigation = Capteur VGA monochrome (640 × 480 pixels) pointé au nadir | Structure des pales = Composites en fibre de carbone à noyau en mousse pour une rigidité maximale', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c5357a9d-912c-46b9-a69c-24de92c69c1d', '329dbdc7-3bf2-42a3-9b61-ab31023ca3cf', 'Liaison radio = Résistances chauffantes alimentées par 6 cellules lithium-ion Sony | Chauffage nocturne = Capteur VGA monochrome (640 × 480 pixels) pointé au nadir | Caméra de navigation = Composites en fibre de carbone à noyau en mousse pour une rigidité maximale | Structure des pales = Protocole Zigbee à 900 MHz sur une portée maximale d''environ 1 000 m', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('0fadfaa3-0fb8-42ea-b664-e132a8fe967b', 'ac83c973-d433-4445-8887-eda0fb8e4b49', 'Quel capteur d''Ingenuity est tombé en panne en mai 2022, obligeant les ingénieurs à modifier le logiciel de vol avant le décollage ?', 'Après la panne de l''inclinomètre en mai 2022, les ingénieurs ont patché le logiciel pour estimer l''assiette initiale au sol à l''aide des accéléromètres de la centrale inertielle.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e4d91d79-7b6d-42d3-9fa4-bed7d589d6c3', '0fadfaa3-0fb8-42ea-b664-e132a8fe967b', 'L''inclinomètre', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('989ba7d5-95de-48a2-a7a1-8e6c4cb6bea5', '0fadfaa3-0fb8-42ea-b664-e132a8fe967b', 'L''altimètre laser', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b2455562-8f1e-4de6-adee-7a5ed48d5028', '0fadfaa3-0fb8-42ea-b664-e132a8fe967b', 'Le panneau solaire', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('744d1318-4698-45fc-90b0-a94605499501', '0fadfaa3-0fb8-42ea-b664-e132a8fe967b', 'La caméra couleur', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f6d63f40-707a-465f-822b-9dc24272fb8f', 'ac83c973-d433-4445-8887-eda0fb8e4b49', 'Vrai ou faux : Lors des essais dans la chambre à vide de 7,6 mètres du JPL sur Terre, il a fallu alléger l''hélicoptère ou le suspendre partiellement par un câble pour simuler la gravité martienne.', 'La pesanteur terrestre étant 2,6 fois plus forte que sur Mars, les essais au JPL utilisaient un système de délestage par câble pour compenser le surplus de poids.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b9f89cf6-e887-4c3a-90af-1dfb535eb382', 'f6d63f40-707a-465f-822b-9dc24272fb8f', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a6021def-e902-411a-aa40-cefcdbfa81d2', 'f6d63f40-707a-465f-822b-9dc24272fb8f', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('bda3eb66-3c8c-4719-9288-bc56d2eb1466', 'ac83c973-d433-4445-8887-eda0fb8e4b49', 'Quelle fut la première mission future directement influencée par le succès d''Ingenuity pour intégrer des hélicoptères de récupération d''échantillons ?', 'La NASA a intégré deux hélicoptères inspirés d''Ingenuity dans l''architecture Mars Sample Return pour récupérer les tubes d''échantillons en cas d''indisponibilité de Perseverance.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b72eda9d-340c-4a42-a504-c2dbc103ebdb', 'bda3eb66-3c8c-4719-9288-bc56d2eb1466', 'Mars Sample Return (Sample Recovery Helicopters)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3f6accd6-e10b-4197-bdf3-d1a43f960e0a', 'bda3eb66-3c8c-4719-9288-bc56d2eb1466', 'Dragonfly vers Titan', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ce0d7c80-052f-4c9a-96bb-7ddec975d985', 'bda3eb66-3c8c-4719-9288-bc56d2eb1466', 'Europa Clipper', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2468a0d1-2243-4cc1-9810-03eca744c8de', 'bda3eb66-3c8c-4719-9288-bc56d2eb1466', 'Artemis III', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('71bb4ae9-1526-490e-ae9d-19db75a3849e', 'ac83c973-d433-4445-8887-eda0fb8e4b49', 'Pourquoi les pales d''Ingenuity ont-elles une corde (largeur) proportionnellement beaucoup plus grande que celle des hélicoptères terrestres ? (Plusieurs bonnes réponses)', 'Des pales larges et très rigides permettent de générer assez de portance à bas nombre de Reynolds sans atteindre des vitesses transsoniques en bout de pale.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8b4bcfea-27b6-4789-b5d5-b929dddd4faa', '71bb4ae9-1526-490e-ae9d-19db75a3849e', 'Pour compenser la très faible densité de l''air martien (faible nombre de Reynolds) ET Pour augmenter la surface portante sans dépasser la vitesse limite en bout de pale ET Pour offrir une rigidité structurelle suffisante face aux efforts centrifuges', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d12f830f-7edb-4611-a606-c7a8b67adce3', '71bb4ae9-1526-490e-ae9d-19db75a3849e', 'Pour servir de panneaux solaires secondaires ET Pour stocker du carburant liquide à l''intérieur des pales', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8d8a2c3b-636c-48ec-b0de-0de0a7915cd2', '71bb4ae9-1526-490e-ae9d-19db75a3849e', 'Pour compenser la très faible densité de l''air martien (faible nombre de Reynolds)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('4a532254-6ce1-4aa8-93e3-5d2b1aad8074', 'ac83c973-d433-4445-8887-eda0fb8e4b49', 'Quel rôle Ingenuity continue-t-il de jouer sur Mars après l''arrêt définitif de ses vols en janvier 2024 ?', 'Bien qu''incapable de voler, Ingenuity reste opérationnel au sol comme station fixe enregistrant des mesures thermiques et environnementales.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e21ef0d8-4d95-4c06-bd1b-5dd401e8ae57', '4a532254-6ce1-4aa8-93e3-5d2b1aad8074', 'Station fixe collectant quotidiennement des données météorologiques et environnementales', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('20b9a72e-df2c-4ed5-b005-bd9325dd89c8', '4a532254-6ce1-4aa8-93e3-5d2b1aad8074', 'Relais de communication principal entre la Terre et tous les rovers martiens', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b4ac8295-9e67-4ac9-9c26-2906256c2fe1', '4a532254-6ce1-4aa8-93e3-5d2b1aad8074', 'Balise lumineuse laser visible à l''œil nu depuis la Terre', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3f0e565a-597c-4578-b121-566912853f98', '4a532254-6ce1-4aa8-93e3-5d2b1aad8074', 'Aucun, sa batterie a explosé lors du dernier atterrissage', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Atterrisseurs Viking 1 & 2 sur Mars (Explorateur) (atterrisseurs-viking-explorer)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('5ec27472-7899-4238-a8eb-1746383abb13', 'atterrisseurs-viking-explorer', 'Atterrisseurs Viking 1 & 2 sur Mars (Explorateur)', 'EXPLORER'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'mars' LIMIT 1), (SELECT "id" FROM "machines" WHERE "slug" = 'viking-1' LIMIT 1), true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f403ecc2-4d65-4710-9763-88455a41431c', '5ec27472-7899-4238-a8eb-1746383abb13', 'Quel exploit les atterrisseurs américains Viking 1 et 2 ont-ils réalisé sur Mars en 1976 ?', 'En 1976, Viking 1 et 2 sont devenus les premiers atterrisseurs américains à fonctionner avec succès sur Mars.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ef46d2e9-f72a-4b03-bf11-fa49613f4345', 'f403ecc2-4d65-4710-9763-88455a41431c', 'Ils ont été les premiers à se poser et fonctionner avec succès sur Mars', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d4df8f42-9ee5-4ef6-9e0b-a9085c2b5b4a', 'f403ecc2-4d65-4710-9763-88455a41431c', 'Ils ont roulé sur toute la planète Mars', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4e62646f-16b5-4cd0-984a-b9f94c959043', 'f403ecc2-4d65-4710-9763-88455a41431c', 'Ils ont ramené des roches martiennes sur Terre', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e0502ff2-7611-44ae-a643-f90b9259dd7d', 'f403ecc2-4d65-4710-9763-88455a41431c', 'Ils ont fait voler un petit hélicoptère', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('cd9f66f8-f5e1-4c7e-bfce-2f7a8637f00c', '5ec27472-7899-4238-a8eb-1746383abb13', 'Vrai ou faux : Les atterrisseurs Viking 1 et 2 avaient des roues pour se promener sur Mars.', 'Viking 1 et 2 n''avaient pas de roues : ils sont restés exactement à l''endroit où ils ont atterri.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('27295412-7b6c-4a01-8927-913eaecef696', 'cd9f66f8-f5e1-4c7e-bfce-2f7a8637f00c', 'Vrai', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6a715e54-83f1-4e8b-a3bd-1b7371bd871b', 'cd9f66f8-f5e1-4c7e-bfce-2f7a8637f00c', 'Faux', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('13a0586f-c507-4d7c-84ec-8e28454d7f56', '5ec27472-7899-4238-a8eb-1746383abb13', 'Quel symbole patriotique est peint sur l''écran pare-vent de l''atterrisseur Viking 1 ?', 'Le drapeau des États-Unis ainsi que le logo du bicentenaire américain figurent sur l''écran pare-vent de Viking Lander 1.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('547d2563-4356-4d87-9b0e-c54c4001c76d', '13a0586f-c507-4d7c-84ec-8e28454d7f56', 'Le drapeau des États-Unis', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('706e89c6-7b2d-4c5f-bb2c-db33890a799e', '13a0586f-c507-4d7c-84ec-8e28454d7f56', 'Un dessin de la planète Terre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1d9f651f-4f57-4cfc-ba8b-88c372a03103', '13a0586f-c507-4d7c-84ec-8e28454d7f56', 'Une carte de la Lune', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dfed55f3-85fc-4a29-835d-3c60d68ebcf0', '13a0586f-c507-4d7c-84ec-8e28454d7f56', 'Le portrait d''un astronaute', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('afa3fa04-f70a-4c50-aff7-2feb3dd10e4c', '5ec27472-7899-4238-a8eb-1746383abb13', 'Que voit-on sur les premières photos prises par Viking 1 sur Mars ? (Plusieurs bonnes réponses)', 'Les clichés de Viking 1 montrent une plaine parsemée de roches, une crête de colline à 200 m et des éléments de l''atterrisseur.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e26499a7-7a78-4890-afcc-aa099c58717b', 'afa3fa04-f70a-4c50-aff7-2feb3dd10e4c', 'Un désert rocheux rouge-brun ET Une colline à environ 200 mètres ET Le drapeau américain sur l''atterrisseur', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6b7bfa4e-1660-45f1-9847-e4a751a3dc58', 'afa3fa04-f70a-4c50-aff7-2feb3dd10e4c', 'Des forêts d''arbres verts ET Des rivières d''eau liquide', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('664880c4-3e47-4ceb-bd6d-809660dc9d71', 'afa3fa04-f70a-4c50-aff7-2feb3dd10e4c', 'Un désert rocheux rouge-brun', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a5dbe5ed-e0f6-4080-9231-4b00459d736d', '5ec27472-7899-4238-a8eb-1746383abb13', 'Quel dessin représente le symbole officiel de la mission Viking ?', 'Le symbole de la mission montre un ancien navire viking, dessiné par le lycéen Peter Purol.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('651326ef-185c-4a4c-bb77-5da20e5436c0', 'a5dbe5ed-e0f6-4080-9231-4b00459d736d', 'Un ancien navire viking', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('813688d8-21f5-4c64-bcb5-e30efe42bf5e', 'a5dbe5ed-e0f6-4080-9231-4b00459d736d', 'Une fusée décollant vers les étoiles', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('463b90a8-4cbf-4d90-a4e2-01aae263858e', 'a5dbe5ed-e0f6-4080-9231-4b00459d736d', 'Un casque d''astronaute', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('944b141f-5dc0-4a9d-83e9-8dff69d282ec', 'a5dbe5ed-e0f6-4080-9231-4b00459d736d', 'Un aigle aux ailes déployées', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('cea28192-837e-476b-9d40-dbd8902b85f6', '5ec27472-7899-4238-a8eb-1746383abb13', 'Relie chaque élément visible derrière Viking 1 à sa distance par rapport à l''atterrisseur.', 'Sur la photo prise vers l''ouest, la colline se situe à 200 m et l''horizon lumineux à environ 3 km.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b630442e-c227-41ef-801f-347eb205816a', 'cea28192-837e-476b-9d40-dbd8902b85f6', 'La crête de la colline sombre = À environ 200 mètres | L''horizon lointain éclairé = À environ 3 kilomètres | Le drapeau des États-Unis = Sur l''atterrisseur lui-même', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('790a8d9f-c167-48ab-bb5d-cab4397e0315', 'cea28192-837e-476b-9d40-dbd8902b85f6', 'La crête de la colline sombre = À environ 3 kilomètres | L''horizon lointain éclairé = Sur l''atterrisseur lui-même | Le drapeau des États-Unis = À environ 200 mètres', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('609ef187-00d0-4376-97b2-e5b684ea1da8', '5ec27472-7899-4238-a8eb-1746383abb13', 'Quel jour précis l''atterrisseur Viking 1 s''est-il posé en toute sécurité sur Mars ?', 'Viking 1 a atterri sans encombre sur Mars le 20 juillet 1976 et a aussitôt transmis les premières images depuis la surface.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c16d38aa-1068-45a2-b733-20e04161c01f', '609ef187-00d0-4376-97b2-e5b684ea1da8', 'Le 20 juillet 1976', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7f483c8f-e945-4cc7-b4d8-c18b21a075fc', '609ef187-00d0-4376-97b2-e5b684ea1da8', 'Le 14 juillet 1789', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6302b379-fb85-4186-b1c3-99b2b58a8953', '609ef187-00d0-4376-97b2-e5b684ea1da8', 'Le 25 décembre 2000', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f49de066-6737-4e50-a124-3cda6b4ee589', '609ef187-00d0-4376-97b2-e5b684ea1da8', 'Le 1er janvier 1980', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('fda6fb30-2eb9-40bf-a4e0-dc72f080f809', '5ec27472-7899-4238-a8eb-1746383abb13', 'Combien d''années d''exploration de la surface de Mars fête-t-on en juillet 2026 depuis l''atterrissage de Viking 1 en 1976 ?', 'Entre juillet 1976 et juillet 2026, il s''est écoulé 50 ans d''exploration de la surface martienne.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('240808d5-75ae-44cf-b5c7-6d5a716d5f9f', 'fda6fb30-2eb9-40bf-a4e0-dc72f080f809', '50 ans', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7c1cd8b6-a461-422b-b107-76a344f13833', 'fda6fb30-2eb9-40bf-a4e0-dc72f080f809', '75 ans', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('56f5f521-56bc-406c-b623-fd4437718008', 'fda6fb30-2eb9-40bf-a4e0-dc72f080f809', '25 ans', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b99af45d-aac9-4c25-9f2e-4321a6060327', 'fda6fb30-2eb9-40bf-a4e0-dc72f080f809', '60 ans', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('216780e1-25cf-4ac6-9f29-cee7fcd8b8b7', '5ec27472-7899-4238-a8eb-1746383abb13', 'De quelles deux parties chaque mission Viking était-elle composée ? (Plusieurs bonnes réponses)', 'Chaque mission Viking comprenait un orbiteur pour cartographier Mars d''en haut et un atterrisseur pour étudier le sol.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dbb154b7-354b-4ace-8490-3ffceb300bf2', '216780e1-25cf-4ac6-9f29-cee7fcd8b8b7', 'Un orbiteur qui tourne autour de Mars ET Un atterrisseur qui se pose sur le sol', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fe3d9256-cdbe-4f04-9b60-fbd8281973d8', '216780e1-25cf-4ac6-9f29-cee7fcd8b8b7', 'Un sous-marin pour les océans ET Un ballon dirigeable ET Une station spatiale habitée', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('854a1696-a38d-497d-a39b-90bbe9cae1af', '216780e1-25cf-4ac6-9f29-cee7fcd8b8b7', 'Un orbiteur qui tourne autour de Mars', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('23a094f5-c460-4c59-9612-5e583737ba91', '5ec27472-7899-4238-a8eb-1746383abb13', 'Comment s''appelle la grande plaine martienne où s''est posé Viking 1 ?', 'Viking 1 a atterri dans la plaine de Chryse Planitia et en a pris le premier panorama trois jours plus tard.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ab1e03ff-c3ee-41fa-af1d-7d3b0f32f059', '23a094f5-c460-4c59-9612-5e583737ba91', 'Chryse Planitia', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6cdef315-5db4-4531-a43b-78d16f57fc1d', '23a094f5-c460-4c59-9612-5e583737ba91', 'La mer de la Tranquillité', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('afc8639a-d195-4326-9a7f-a5b057d81ffe', '23a094f5-c460-4c59-9612-5e583737ba91', 'Le mont Blanc', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4333c90e-1c16-40c5-8860-01821010b2cf', '23a094f5-c460-4c59-9612-5e583737ba91', 'Le cratère Gale', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('6001c06c-8e86-46e7-869a-e212682b88b2', '5ec27472-7899-4238-a8eb-1746383abb13', 'Remets dans l''ordre chronologique ces événements de Viking 1 en juillet 1976.', 'Viking 1 a atterri le 20 juillet 1976, pris son premier panorama le 23 juillet, puis photographié le drapeau américain le 26 juillet.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f911ec76-a460-4775-81cb-ee318b468c84', '6001c06c-8e86-46e7-869a-e212682b88b2', '1. Atterrissage de Viking 1 sur Mars (20 juillet) ➔ 2. Prise de la première image panoramique de Chryse Planitia (23 juillet) ➔ 3. Prise de la photo couleur avec le drapeau américain (26 juillet)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f6021da4-1396-4589-b0b8-7d72468d4e55', '6001c06c-8e86-46e7-869a-e212682b88b2', '1. Prise de la photo couleur avec le drapeau américain (26 juillet) ➔ 2. Prise de la première image panoramique de Chryse Planitia (23 juillet) ➔ 3. Atterrissage de Viking 1 sur Mars (20 juillet)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('eefadb39-ea05-4bd6-a8df-6769dbd4fcfb', '6001c06c-8e86-46e7-869a-e212682b88b2', '1. Prise de la première image panoramique de Chryse Planitia (23 juillet) ➔ 2. Atterrissage de Viking 1 sur Mars (20 juillet) ➔ 3. Prise de la photo couleur avec le drapeau américain (26 juillet)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('6d29dabf-5598-45f2-9bd9-e9106da09983', '5ec27472-7899-4238-a8eb-1746383abb13', 'Vrai ou faux : Les photos prises par Viking 2 montrent un terrain rempli de nombreux rochers sur Mars.', 'Les clichés de Viking 2 montrent effectivement une étendue martienne jonchée de gros rochers.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('91915d20-58bd-4ca3-ad89-ddb3de20a7d8', '6d29dabf-5598-45f2-9bd9-e9106da09983', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7cf58f75-2c0f-47eb-97ef-e7c59ef3d263', '6d29dabf-5598-45f2-9bd9-e9106da09983', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('6af54ceb-0df3-4d46-8feb-b7c526a94f8c', '5ec27472-7899-4238-a8eb-1746383abb13', 'Qui a dessiné le logo du navire viking placé sur l''atterrisseur Viking 1 ?', 'Peter Purol, de Baltimore, a remporté le concours de création du logo Viking destiné aux lycéens.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5415ef46-9163-4fe9-81d9-033074096a81', '6af54ceb-0df3-4d46-8feb-b7c526a94f8c', 'Un lycéen nommé Peter Purol', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('35b45a0b-406d-4ba1-aa35-cf6bff0020ff', '6af54ceb-0df3-4d46-8feb-b7c526a94f8c', 'Le président des États-Unis', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('84c45e69-0576-40ed-8255-8137793f7a6a', '6af54ceb-0df3-4d46-8feb-b7c526a94f8c', 'Un robot dessinateur', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('613c2fb3-b623-4f7d-8e28-9a3ed0f737bd', '6af54ceb-0df3-4d46-8feb-b7c526a94f8c', 'Le pilote de la fusée', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('3d448720-39a7-436b-8d72-e775225f36ba', '5ec27472-7899-4238-a8eb-1746383abb13', 'Quels instruments faisaient partie du système d''imagerie de l''orbiteur Viking ? (Plusieurs bonnes réponses)', 'Le système d''imagerie de l''orbiteur Viking associait les caméras TV A et TV B, un cartographe thermique infrarouge et un détecteur d''eau atmosphérique.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('05e6ea32-963f-402e-851b-2fa6d1d4385d', '3d448720-39a7-436b-8d72-e775225f36ba', 'Deux caméras de télévision (TV A et TV B) ET Un détecteur d''eau atmosphérique ET Un cartographe thermique infrarouge', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ff564e37-7ed5-4699-b099-c383be724f56', '3d448720-39a7-436b-8d72-e775225f36ba', 'Un radar de sous-marin ET Un télescope à rayons gamma', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('abb36d0f-f029-416f-81eb-ce0c8b54b0bb', '3d448720-39a7-436b-8d72-e775225f36ba', 'Deux caméras de télévision (TV A et TV B)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('7be0e3bd-20d6-4885-b03b-e591230549cc', '5ec27472-7899-4238-a8eb-1746383abb13', 'Quel immense canyon martien appartenant au système de Valles Marineris a été photographié par les orbiteurs Viking 1 et 2 ?', 'Une mosaïque couleur des orbiteurs Viking 1 et 2 révèle Candor Chasma, large de 800 km dans Valles Marineris.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ad357c7d-f35d-42d5-8493-2195d65eb79d', '7be0e3bd-20d6-4885-b03b-e591230549cc', 'Candor Chasma', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('45270699-ee66-4ab1-9002-98d01dc4003a', '7be0e3bd-20d6-4885-b03b-e591230549cc', 'Le Grand Canyon du Colorado', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7b93ff60-0de2-4ac7-9ec0-0797218012ad', '7be0e3bd-20d6-4885-b03b-e591230549cc', 'La fosse des Mariannes', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2ab1c669-32af-4bef-8230-225be76b911d', '7be0e3bd-20d6-4885-b03b-e591230549cc', 'Le cratère Tycho', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Atterrisseurs Viking 1 & 2 sur Mars (Expert) (atterrisseurs-viking-expert)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'atterrisseurs-viking-expert', 'Atterrisseurs Viking 1 & 2 sur Mars (Expert)', 'EXPERT'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'mars' LIMIT 1), (SELECT "id" FROM "machines" WHERE "slug" = 'viking-1' LIMIT 1), true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a8a17782-3e00-45a6-82af-afa7bd89e8d8', 'f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'Comment l''image couleur prise le 26 juillet 1976 par Viking Lander 1 a-t-elle permis de confirmer visuellement le bon déploiement du GCMS ?', 'La visibilité des écrans pare-vent déployés sur le GCMS Processor Distribution Assembly confirmait que le couvercle de protection avait été correctement largué.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5427d040-29ad-4b39-af1e-908872321fec', 'a8a17782-3e00-45a6-82af-afa7bd89e8d8', 'Elle montrait le GCMS Processor Distribution Assembly avec ses écrans pare-vent déployés, prouvant l''éjection correcte du couvercle', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('44c6eedf-cf2e-4b2a-a5ad-d538e1ed2ae6', 'a8a17782-3e00-45a6-82af-afa7bd89e8d8', 'Elle montrait un voyant vert allumé sur le mât météorologique', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7f0d2fd0-8357-4a90-8893-9a3036079032', 'a8a17782-3e00-45a6-82af-afa7bd89e8d8', 'Elle montrait l''ombre du bras robotique tenant le couvercle', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a1ad9929-155c-453c-81a2-1060339da6b7', 'a8a17782-3e00-45a6-82af-afa7bd89e8d8', 'Elle montrait la trace du laser tiré sur le sol martien', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('19cd163f-059d-429d-b188-e388c2b540a2', 'f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'Sur le cliché couleur du 26 juillet 1976, l''horizon lointain éclairé se situe à environ 3 km et la crête de colline sombre à 200 m. Quel est le rapport de distance entre l''horizon et cette crête ?', '3 km équivalent à 3 000 mètres ; divisés par 200 mètres, l''horizon se situe 15 fois plus loin que la crête de la colline.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('297dd882-7ee5-4f29-ac30-d68bc6baae99', '19cd163f-059d-429d-b188-e388c2b540a2', '15 fois plus loin', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8e818a31-d2e7-4093-84a2-374af3c2727c', '19cd163f-059d-429d-b188-e388c2b540a2', '23 fois plus loin', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7506f0cd-c889-4d01-b842-64768d5ecdec', '19cd163f-059d-429d-b188-e388c2b540a2', '8 fois plus loin', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0aeb451b-8c45-4307-87f1-ecd8090d1fa7', '19cd163f-059d-429d-b188-e388c2b540a2', '25 fois plus loin', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9404c386-6953-4c3e-a746-c0c862a62863', 'f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'Quels sous-ensembles composent le « Viking Orbiter Imaging System » sur le schéma technique de la NASA ? (Plusieurs bonnes réponses)', 'Le schéma technique du système d''imagerie de l''orbiteur Viking identifie précisément les caméras TV A et TV B, l''Infrared Thermal Mapper et le Mars Atmospheric Water Detector.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('df0f19d0-a4c8-43d9-ab55-46da47906e28', '9404c386-6953-4c3e-a746-c0c862a62863', 'TV A et TV B ET Infrared Thermal Mapper (IRTM) ET Mars Atmospheric Water Detector (MAWD)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f9d1253e-7df8-4e78-9e19-900595c0384b', '9404c386-6953-4c3e-a746-c0c862a62863', 'Alpha Proton X-Ray Spectrometer (APXS) ET Surface Stereo Imager (SSI)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0af43a32-8ff5-4f7d-b953-57fda3677d1f', '9404c386-6953-4c3e-a746-c0c862a62863', 'TV A et TV B', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('b04354b7-0036-40b9-8829-7e71b26719cd', 'f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'Pourquoi le ciel apparaît-il relativement sombre alors que l''horizon lointain est vivement éclairé sur la photographie prise à 7 h 18 heure locale martienne par Viking 1 ?', 'À 7 h 18 heure locale, le Soleil bas derrière l''atterrisseur (à l''est) projette ses rayons rasants vers l''ouest, illuminant l''horizon à 3 km alors que le ciel reste encore sombre.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6c5aa979-5651-4a4e-bd2d-52eeab8b18fd', 'b04354b7-0036-40b9-8829-7e71b26719cd', 'La caméra regarde presque plein ouest tandis que le Soleil levant, situé bas derrière l''atterrisseur à l''est, éclaire les reliefs lointains à 3 km sous un angle rasant', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1fbe14e0-361a-4e9b-bba1-bbb76a56fc59', 'b04354b7-0036-40b9-8829-7e71b26719cd', 'Une éclipse totale de Soleil par Phobos se produisait au moment exact de la prise de vue', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('df6630dd-1f5a-4f01-9559-de992e4eab18', 'b04354b7-0036-40b9-8829-7e71b26719cd', 'Le capteur de la caméra était saturé par les radiations du RTG', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7e2e4506-0577-424a-a7e0-93507b35d15b', 'b04354b7-0036-40b9-8829-7e71b26719cd', 'Une tempête de poussière bloquait la lumière uniquement au-dessus de l''atterrisseur', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e73c15cd-7ddc-4880-a6f5-76b80fbe5cb7', 'f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'Vrai ou faux : Le premier panorama de Chryse Planitia acquis le 23 juillet 1976 par la caméra 1 de Viking 1 est une image rectiligne à champ étroit ne couvrant qu''un seul rocher.', 'L''image du 23 juillet 1976 est un large panorama de la plaine de Chryse Planitia et d''une partie de la structure de l''atterrisseur.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f8801c4d-fc4d-4ec8-bd1f-a8dcf28179a4', 'e73c15cd-7ddc-4880-a6f5-76b80fbe5cb7', 'Vrai', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dfae420c-42b4-42e0-b6fc-04c3d1411806', 'e73c15cd-7ddc-4880-a6f5-76b80fbe5cb7', 'Faux', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('1f9270b7-04d5-43b8-91a2-160ded90ffdd', 'f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'Relie chaque document ou cliché Viking à sa caractéristique technique exacte.', 'Ces quatre références correspondent chacune à une archive photographique majeure des atterrisseurs et orbiteurs Viking.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1272fb1f-d71c-43f7-879a-510660d4bf36', '1f9270b7-04d5-43b8-91a2-160ded90ffdd', 'PIA00381 = Première photographie prise depuis la surface de Mars | Mosaïque de Candor Chasma = Vue oblique depuis l''ouest d''un gouffre de 800 km de large | Cliché du 26 juillet 1976 (Sol 6) = Vue vers l''ouest montrant le pare-vent du RTG et la mire couleur | PIA01522 = Vue d''une partie de Viking 2 devant un champ de blocs rocheux', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fe02700a-0132-454a-bf39-a86a1700af13', '1f9270b7-04d5-43b8-91a2-160ded90ffdd', 'PIA00381 = Vue oblique depuis l''ouest d''un gouffre de 800 km de large | Mosaïque de Candor Chasma = Vue vers l''ouest montrant le pare-vent du RTG et la mire couleur | Cliché du 26 juillet 1976 (Sol 6) = Vue d''une partie de Viking 2 devant un champ de blocs rocheux | PIA01522 = Première photographie prise depuis la surface de Mars', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('d2ac0c85-94eb-4743-8000-6d1119dd6f2d', 'f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'Quel système fournissait l''énergie électrique aux atterrisseurs Viking 1 et 2, permettant d''y apposer le drapeau américain sur son écran pare-vent ?', 'Les atterrisseurs Viking étaient alimentés par des RTG (Radioisotope Thermoelectric Generators) protégés par des écrans pare-vent.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e32ccd7b-11fe-425a-bcdd-1744d56bd2bc', 'd2ac0c85-94eb-4743-8000-6d1119dd6f2d', 'Des générateurs thermoélectriques à radio-isotopes (RTG)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('efd93cad-14c8-4c5a-8985-dded8f795d17', 'd2ac0c85-94eb-4743-8000-6d1119dd6f2d', 'Des panneaux photovoltaïques orientables de 20 mètres d''envergure', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ef2fab69-4479-4890-8c6c-e1fb602fef25', 'd2ac0c85-94eb-4743-8000-6d1119dd6f2d', 'Des piles à combustible hydrogène-oxygène de type Apollo', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4ff137cb-fd00-4292-85bd-083a0bdb9da3', 'd2ac0c85-94eb-4743-8000-6d1119dd6f2d', 'Des batteries lithium-ion rechargées par une éolienne martienne', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a0c1f215-c0f9-4a86-b6fc-92e87fc28f29', 'f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'Pourquoi la présence de la « Reference Test Chart » dans le champ de vision des caméras de Viking Lander 1 était-elle indispensable à l''interprétation géologique ?', 'La Reference Test Chart fournissait des étalons de réflectance et de couleur permettant de calibrer fidèlement les images couleur de la surface et du ciel.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7e486aad-e7bf-41a1-8929-16229527cf7c', 'a0c1f215-c0f9-4a86-b6fc-92e87fc28f29', 'Elle permettait de corriger les biais spectraux liés à l''éclairage solaire filtré par les poussières atmosphériques martiennes', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('788b970e-e7e3-4cf1-8512-e46809894a8a', 'a0c1f215-c0f9-4a86-b6fc-92e87fc28f29', 'Elle servait de réflecteur laser pour mesurer la distance Terre-Mars', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7e6a1737-ca48-4140-aac2-6a7d7537d16c', 'a0c1f215-c0f9-4a86-b6fc-92e87fc28f29', 'Elle indiquait l''inclinaison magnétique du pôle Nord martien', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7a7e81aa-f99a-4c3a-afc6-fcf06639e478', 'a0c1f215-c0f9-4a86-b6fc-92e87fc28f29', 'Elle mesurait l''abrasion causée par les micrométéorites', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f44c3536-f4e2-4f46-8824-3486f2e05273', 'f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'Quelles caractéristiques géologiques sont mises en évidence par la mosaïque oblique de Candor Chasma issue des orbiteurs Viking 1 et 2 ? (Plusieurs bonnes réponses)', 'La mosaïque Viking de Candor Chasma montre ce gouffre de 800 km de large en vue oblique depuis l''ouest, révélant érosion, glissements de terrain et géomorphologie complexe.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('626dcdfc-c8d3-4a9c-9db2-6ce2db70cfa7', 'f44c3536-f4e2-4f46-8824-3486f2e05273', 'Une largeur d''environ 800 km ET Une observation oblique orientée depuis l''ouest ET Des indices d''érosion et de mouvements de masse (mass wasting) sur les parois et le plancher', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9c56d616-3002-4693-93e6-edcca658076d', 'f44c3536-f4e2-4f46-8824-3486f2e05273', 'La présence de calottes glaciaires polaires permanentes ET Un cratère d''impact récent formé en 1976', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('80eae471-e236-48f5-aa93-a097916a39a6', 'f44c3536-f4e2-4f46-8824-3486f2e05273', 'Une largeur d''environ 800 km', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('429601f4-298d-4555-b293-355cc059fe40', 'f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'Quelle contrainte opérationnelle fondamentale distinguait les atterrisseurs Viking 1 et 2 des missions rovers ultérieures comme Sojourner ou Perseverance ?', 'Dépourvus de système de locomotion, Viking 1 et 2 ont mené l''ensemble de leurs observations scientifiques depuis leur site d''atterrissage fixe.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5b8fb526-f9b6-406c-b25d-bd5ae8c5e456', '429601f4-298d-4555-b293-355cc059fe40', 'Ils étaient totalement stationnaires et ne pouvaient étudier que l''environnement immédiat de leur point d''atterrissage', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('84d9a1d6-c939-4ade-b811-0ff2e3d71115', '429601f4-298d-4555-b293-355cc059fe40', 'Ils devaient redécoller toutes les nuits pour éviter le gel', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7bb8a3e9-9a45-4bb4-8e84-422d0856a03c', '429601f4-298d-4555-b293-355cc059fe40', 'Ils ne pouvaient communiquer avec la Terre que durant 10 minutes par an', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e7e3c0d2-afa1-4e19-9c23-4479439968ac', '429601f4-298d-4555-b293-355cc059fe40', 'Ils fonctionnaient uniquement en orbite basse sans jamais toucher le sol', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('cb07cc2b-fa73-4006-8309-5d9e0a973bd7', 'f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'Classe les plans visuels de la photographie couleur de Viking Lander 1 (26 juillet 1976) du plus proche au plus éloigné de la caméra.', 'La perspective s''étage depuis les composants de l''atterrisseur (pare-vent RTG, mire couleur), puis le champ de roches proche, la crête à 200 m et enfin l''horizon à 3 km.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1dab8983-8f69-4a78-9d63-ae4ab9d1cc8a', 'cb07cc2b-fa73-4006-8309-5d9e0a973bd7', '1. Le pare-vent du RTG portant le drapeau américain et la mire d''étalonnage couleur ➔ 2. Le sol rocheux immédiat devant l''atterrisseur ➔ 3. La crête de colline sombre barrant le paysage (environ 200 m) ➔ 4. L''horizon lointain éclairé par le Soleil levant (environ 3 km)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c3cea694-9ee2-4c8b-b49d-081ccea8fa26', 'cb07cc2b-fa73-4006-8309-5d9e0a973bd7', '1. L''horizon lointain éclairé par le Soleil levant (environ 3 km) ➔ 2. La crête de colline sombre barrant le paysage (environ 200 m) ➔ 3. Le sol rocheux immédiat devant l''atterrisseur ➔ 4. Le pare-vent du RTG portant le drapeau américain et la mire d''étalonnage couleur', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f83ec3c0-353c-45d4-9538-63b7eecde170', 'cb07cc2b-fa73-4006-8309-5d9e0a973bd7', '1. Le sol rocheux immédiat devant l''atterrisseur ➔ 2. Le pare-vent du RTG portant le drapeau américain et la mire d''étalonnage couleur ➔ 3. La crête de colline sombre barrant le paysage (environ 200 m) ➔ 4. L''horizon lointain éclairé par le Soleil levant (environ 3 km)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('4c8d06ef-7804-4715-9492-613fef6b9907', 'f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'Vrai ou faux : Sur Viking Lander 1, le GCMS (Gas Chromatograph Mass Spectrometer) disposait d''un couvercle de protection et d''écrans pare-vent déployables.', 'Le GCMS Processor Distribution Assembly était protégé pendant le voyage et l''atterrissage par un couvercle dont l''éjection permettait le déploiement de ses écrans pare-vent.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('38122989-e2f7-45c5-ac67-5e6315be37b3', '4c8d06ef-7804-4715-9492-613fef6b9907', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b6fabba0-98c0-4e5b-8d55-99f73566d66c', '4c8d06ef-7804-4715-9492-613fef6b9907', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('1d4a7282-3404-4f36-a671-18736e189b87', 'f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'Pourquoi les concepteurs de la mission Viking avaient-ils choisi des atterrisseurs fixes plutôt que des rovers en 1976 ?', 'En 1976, réussir un atterrissage contrôlé et exploiter des laboratoires fixes sur Mars constituait déjà une première historique ; le premier rover, Sojourner, n''arrivera que 21 ans plus tard.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('eca7b1b2-71c1-4bbb-815e-bf66adb2e7e8', '1d4a7282-3404-4f36-a671-18736e189b87', 'Il fallait d''abord démontrer la capacité à atterrir en toute sécurité et à opérer des instruments complexes sur Mars avant de développer la mobilité de surface (réalisée en 1997 avec Sojourner)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('82d34f68-5051-4227-8ed6-0297efcec92d', '1d4a7282-3404-4f36-a671-18736e189b87', 'La gravité de Mars était jugée trop forte pour que des roues puissent tourner', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d2366373-df30-43e1-9b1b-210e3ac269e3', '1d4a7282-3404-4f36-a671-18736e189b87', 'Les traités internationaux interdisaient tout déplacement sur Mars avant 1995', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3e96b735-0ff7-4088-8878-2c758f4bebe3', '1d4a7282-3404-4f36-a671-18736e189b87', 'Aucun appareil photo n''était assez petit pour tenir sur un rover', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('6f39fe94-a177-4109-ae01-17246fe29035', 'f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'Quelles différences ou caractéristiques ressortent des archives visuelles entre les sites de Viking 1 et Viking 2 ? (Plusieurs bonnes réponses)', 'Viking 1 a exploré Chryse Planitia tandis que Viking 2 a atterri dans une plaine parsemée de gros blocs rocheux, tous deux en 1976.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9fcfc214-a5cf-4549-8d44-97c87dcc0e87', '6f39fe94-a177-4109-ae01-17246fe29035', 'Viking 1 s''est posé dans la plaine de Chryse Planitia ET Viking 2 est photographié devant un champ dense de blocs rocheux (PIA01522) ET Les deux missions ont fourni des images depuis la surface dès 1976', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b72a7750-2a10-40da-a7a0-115f1a18b518', '6f39fe94-a177-4109-ae01-17246fe29035', 'Viking 2 s''est posé au sommet du volcan Olympus Mons ET Viking 1 a atterri dans le cratère Jezero', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('100331bd-9005-4fe9-9ef1-6de82c9ec0a7', '6f39fe94-a177-4109-ae01-17246fe29035', 'Viking 1 s''est posé dans la plaine de Chryse Planitia', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('d80a92b3-317a-4e1d-8aaa-185736835253', 'f7cd8608-6acc-4d93-9b96-97c2c092ddfc', 'Quelle date commémorative est associée à l''affiche « Viking — 50 Years on Mars » publiée par NASA/JPL-Caltech ?', 'L''affiche célèbre le cinquantenaire du 20 juillet 1976, date à laquelle Viking 1 a touché le sol martien et transmis les premières images depuis la surface.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('631602fb-e5e3-46e8-802d-97ec074fd5cf', 'd80a92b3-317a-4e1d-8aaa-185736835253', 'Le 20 juillet 2026 (50 ans après l''atterrissage du 20 juillet 1976)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8a70c275-c46a-4083-a53c-fc9d59625c75', 'd80a92b3-317a-4e1d-8aaa-185736835253', 'Le 4 juillet 2026 (anniversaire de Mars Pathfinder)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b5a94c17-d5fb-4a8e-a3b9-d8adcec175cd', 'd80a92b3-317a-4e1d-8aaa-185736835253', 'Le 19 avril 2026 (anniversaire d''Ingenuity)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('94d10730-0fc9-4213-aa41-58b68e612b75', 'd80a92b3-317a-4e1d-8aaa-185736835253', 'Le 26 novembre 2026 (anniversaire d''InSight)', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Rover Sojourner & Mars Pathfinder (Explorateur) (rover-sojourner-explorer)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'rover-sojourner-explorer', 'Rover Sojourner & Mars Pathfinder (Explorateur)', 'EXPLORER'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'mars' LIMIT 1), NULL, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a5d56ed5-1487-40a8-9bf2-9f00808b072e', '891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'Quel record historique le petit robot Sojourner a-t-il établi en 1997 ?', 'Sojourner est devenu en juillet 1997 le tout premier rover à rouler sur une autre planète que la Terre.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('83e18a8c-c65b-45f2-9ca0-c76d5622a151', 'a5d56ed5-1487-40a8-9bf2-9f00808b072e', 'Le premier robot à rouler sur Mars', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('aee08fd7-e6cf-4d42-9891-8e2d7fb08586', 'a5d56ed5-1487-40a8-9bf2-9f00808b072e', 'Le premier robot à se poser sur la Lune', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a7b0552a-97be-4159-9ac3-fa1408506560', 'a5d56ed5-1487-40a8-9bf2-9f00808b072e', 'Le premier satellite autour de Jupiter', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('315054fd-4910-47e4-baae-7845404e77fc', 'a5d56ed5-1487-40a8-9bf2-9f00808b072e', 'La première fusée réutilisable', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('77c288b5-929d-46e3-9d7d-86c05883e4ce', '891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'À quel appareil de cuisine la taille du rover Sojourner ressemblait-elle ?', 'Avec ses 65 cm de long, 48 cm de large et 30 cm de haut, Sojourner avait la taille d''un four à micro-ondes.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c3447d7c-6e90-4d33-9258-cd3e7be649c9', '77c288b5-929d-46e3-9d7d-86c05883e4ce', 'Un four à micro-ondes', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9eb573d5-f377-47c9-9283-dfb8e5969fb1', '77c288b5-929d-46e3-9d7d-86c05883e4ce', 'Un grand réfrigérateur américain', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3fbd8f3f-aa9a-48b2-bb7f-cff3b5714c16', '77c288b5-929d-46e3-9d7d-86c05883e4ce', 'Une machine à laver', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9a25a471-1219-41b9-bb52-f3c0ae1fb590', '77c288b5-929d-46e3-9d7d-86c05883e4ce', 'Une cuisinière industrielle', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('10e23e75-84be-4156-b883-5c5f2d4dec9b', '891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'Combien de roues possédait le rover Sojourner pour rouler sur les rochers martiens ?', 'Sojourner était équipé de 6 roues motrices indépendantes qui lui permettaient d''enjamber de petits obstacles.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('16c94b71-5c0f-4e40-bc15-b07fb073123b', '10e23e75-84be-4156-b883-5c5f2d4dec9b', '6 roues', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('52763178-d14a-46e4-8422-e8a3fa345470', '10e23e75-84be-4156-b883-5c5f2d4dec9b', '9 roues', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cd1c5ad8-8ac7-4e24-970e-87f896cbbe22', '10e23e75-84be-4156-b883-5c5f2d4dec9b', '3 roues', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('bdd43f2a-df3c-46dd-859b-9aed9a5800ef', '10e23e75-84be-4156-b883-5c5f2d4dec9b', '9 roues', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('318f12c0-3b82-4aec-ada5-45218cf53485', '891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'Vrai ou faux : Le nom « Sojourner » a été choisi par une jeune fille de 12 ans lors d''un concours d''écriture.', 'Valerie Ambroise, âgée de 12 ans, a remporté le concours de la NASA en proposant le nom de l''abolitionniste Sojourner Truth.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ca43cd37-6803-4f20-80ac-e17b79439648', '318f12c0-3b82-4aec-ada5-45218cf53485', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0fd27b64-68c8-404e-b285-7974120b3bd2', '318f12c0-3b82-4aec-ada5-45218cf53485', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('4e232c1c-fd89-40f4-96f3-6e8fa28e68f7', '891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'Comment la sonde Mars Pathfinder qui transportait Sojourner a-t-elle amorti son choc à l''arrivée sur Mars ?', 'Entourée de grands airbags, la sonde a rebondi une quinzaine de fois sur le sol martien avant de s''immobiliser.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3a50404a-3775-49d0-ae9b-3bf59781befe', '4e232c1c-fd89-40f4-96f3-6e8fa28e68f7', 'En rebondissant dans d''énormes airbags', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6ba33c65-2bbe-4df7-b246-614807206f49', '4e232c1c-fd89-40f4-96f3-6e8fa28e68f7', 'En déployant des ailes d''avion', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('48fa356c-f1fe-4cd3-ac39-0abcdca55d3f', '4e232c1c-fd89-40f4-96f3-6e8fa28e68f7', 'En amerrissant dans un lac', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e872c9d9-23b1-4680-9d32-ef15411bc5a9', '4e232c1c-fd89-40f4-96f3-6e8fa28e68f7', 'En s''accrochant à un ballon dirigeable', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('8ae8d6ae-05bc-42e4-adf5-472b6de85407', '891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'De quoi était équipé le rover Sojourner sur Mars ? (Plusieurs bonnes réponses)', 'Sojourner disposait d''un panneau solaire dorsal, de 6 roues crantées et de caméras à l''avant et à l''arrière.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('688a2c8f-4e61-41a3-9e32-feaba2d4a0c2', '8ae8d6ae-05bc-42e4-adf5-472b6de85407', 'Un panneau solaire plat sur le dessus ET Six roues en aluminium avec des crampons ET Des caméras pour voir devant et derrière lui', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('069309e9-a460-4395-b4cf-b3fd60e2f6cb', '8ae8d6ae-05bc-42e4-adf5-472b6de85407', 'Un grand bras pelleteuse de 5 mètres ET Deux hélices d''hélicoptère', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('71135e87-e2b5-41f8-8a96-62402fe88803', '8ae8d6ae-05bc-42e4-adf5-472b6de85407', 'Un panneau solaire plat sur le dessus', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c8c48e5f-b893-4330-b830-516ab0b7b878', '891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'Comment les scientifiques ont-ils surnommé les rochers martiens étudiés par Sojourner ?', 'Pour s''y retrouver facilement, l''équipe a donné aux rochers des surnoms comme « Barnacle Bill », « Yogi » ou « Scooby-Doo ».', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f8f6c0ab-574a-4239-a0b4-57681d69e5df', 'c8c48e5f-b893-4330-b830-516ab0b7b878', 'Avec des noms amusants de dessins animés comme « Barnacle Bill » ou « Yogi »', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cc19d610-bad3-4f5d-bd99-d339039c1525', 'c8c48e5f-b893-4330-b830-516ab0b7b878', 'Uniquement avec des numéros de téléphone', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('eccb97f0-71f8-418b-b613-8be93fd28c35', 'c8c48e5f-b893-4330-b830-516ab0b7b878', 'Avec des noms de villes françaises', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1879511e-0b5e-4c8f-b449-a6e73a8e7a70', 'c8c48e5f-b893-4330-b830-516ab0b7b878', 'Avec des noms de poissons rouges', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('68a84998-a0b7-4b24-889b-a27ba248c334', '891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'Remets dans l''ordre les étapes de l''arrivée de Sojourner sur Mars.', 'Après le dégonflage des airbags, l''atterrisseur a ouvert ses pétales puis déployé la rampe permettant à Sojourner de descendre sur le sol.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6fa54cbb-bfcf-407f-b40a-5feb28f4155e', '68a84998-a0b7-4b24-889b-a27ba248c334', '1. Les grands airbags se dégonflent après les rebonds ➔ 2. Les pétales de l''atterrisseur s''ouvrent comme une fleur ➔ 3. Sojourner descend doucement le long d''une petite rampe ➔ 4. Les six roues de Sojourner touchent enfin le sable de Mars', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ac245e97-244f-49fb-a6b2-227347f3c274', '68a84998-a0b7-4b24-889b-a27ba248c334', '1. Les six roues de Sojourner touchent enfin le sable de Mars ➔ 2. Sojourner descend doucement le long d''une petite rampe ➔ 3. Les pétales de l''atterrisseur s''ouvrent comme une fleur ➔ 4. Les grands airbags se dégonflent après les rebonds', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a0f46d7b-5aff-4ba9-94d0-8643bb6eb729', '68a84998-a0b7-4b24-889b-a27ba248c334', '1. Les pétales de l''atterrisseur s''ouvrent comme une fleur ➔ 2. Les grands airbags se dégonflent après les rebonds ➔ 3. Sojourner descend doucement le long d''une petite rampe ➔ 4. Les six roues de Sojourner touchent enfin le sable de Mars', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('795e652a-397e-4547-95d7-4245a2a980d4', '891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'À quelle vitesse maximale avançait Sojourner sur Mars ?', 'Sojourner se déplaçait à une vitesse maximale d''environ 1 cm par seconde, soit 36 mètres en une heure !', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0de456b8-1953-47a2-adb8-2a2bd547a0f8', '795e652a-397e-4547-95d7-4245a2a980d4', 'Très lentement, environ 1 centimètre par seconde', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e2a8d8c7-dc7e-4b68-8057-3e2955503292', '795e652a-397e-4547-95d7-4245a2a980d4', 'Aussi vite qu''un guépard', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('69a77f34-d9bf-4f3a-802e-701f00e256aa', '795e652a-397e-4547-95d7-4245a2a980d4', 'Aussi vite qu''une voiture sur l''autoroute', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('54e4804d-1ea2-459b-9b3c-ef2ecbc8ed1a', '795e652a-397e-4547-95d7-4245a2a980d4', 'Aussi vite qu''un vélo de course', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a08555e6-4fdc-471f-8e6e-912ee600d807', '891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'Vrai ou faux : Sojourner restait toujours à quelques mètres de sa station d''atterrissage pour pouvoir lui parler par radio.', 'Sojourner transmettait ses messages à l''atterrisseur Mars Pathfinder, qui les envoyait ensuite vers la Terre.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7fce7ec9-e791-46bc-ab83-882d6ea2f02e', 'a08555e6-4fdc-471f-8e6e-912ee600d807', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a8c2ccf7-1290-4812-9064-b43ff4aeee44', 'a08555e6-4fdc-471f-8e6e-912ee600d807', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('2dfa012d-76b0-4d25-b17d-4135b2f32c6f', '891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'Que faisait Sojourner lorsqu''il s''approchait d''un rocher sur Mars ? (Plusieurs bonnes réponses)', 'Sojourner photographiait les roches, analysait leur chimie par contact avec son spectromètre et étudiait le sol martien.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('87f5ec28-941e-4596-bb3d-1551ad010da3', '2dfa012d-76b0-4d25-b17d-4135b2f32c6f', 'Il prenait des photos du rocher de très près ET Il collait son capteur contre la roche pour connaître sa composition ET Il testait l''adhérence de ses roues dans la poussière', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('db124aec-ff4b-438c-ae68-f07826346c09', '2dfa012d-76b0-4d25-b17d-4135b2f32c6f', 'Il cassait le rocher à coups de marteau ET Il ramenait le rocher jusqu''à la Terre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('761e5f5c-665d-4d17-a6b1-73f8fa9c5d76', '2dfa012d-76b0-4d25-b17d-4135b2f32c6f', 'Il prenait des photos du rocher de très près', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('8114b9da-843c-4464-88a1-ed12021d4ef0', '891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'Associe chaque élément de la mission Mars Pathfinder à sa description.', 'Mars Pathfinder s''est posé dans Ares Vallis et a libéré le rover Sojourner.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f28934dc-a219-4c56-b430-9392598be0fa', '8114b9da-843c-4464-88a1-ed12021d4ef0', 'Sojourner = Le petit rover à six roues | Mars Pathfinder = La station fixe qui a transporté le rover | Ares Vallis = La plaine rocheuse de Mars où la mission s''est posée', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f7c12f8c-d813-4dda-92f4-6a9b6e2d44a6', '8114b9da-843c-4464-88a1-ed12021d4ef0', 'Sojourner = La station fixe qui a transporté le rover | Mars Pathfinder = La plaine rocheuse de Mars où la mission s''est posée | Ares Vallis = Le petit rover à six roues', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('72bf2f8d-49a9-48c2-a18f-0ceed7b2a211', '891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'D''où venait l''électricité qui faisait avancer les roues de Sojourner en journée ?', 'Son panneau solaire alimentait directement ses moteurs et son ordinateur pendant la journée martienne.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d40ff900-ab13-4d14-ab1a-f334d7508a24', '72bf2f8d-49a9-48c2-a18f-0ceed7b2a211', 'De la lumière du Soleil captée par son panneau solaire', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7b628564-5daf-4d0d-a169-068bd0bf7176', '72bf2f8d-49a9-48c2-a18f-0ceed7b2a211', 'D''une rallonge électrique déroulée depuis l''atterrisseur', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c65eb78a-490a-4cc5-91e2-9a25947602db', '72bf2f8d-49a9-48c2-a18f-0ceed7b2a211', 'Du vent martien', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('587edbc4-a5d5-4352-8754-ed770c733839', '72bf2f8d-49a9-48c2-a18f-0ceed7b2a211', 'D''un moteur à essence', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('1c2a45d2-a0c4-4bb0-ba1a-9480d55136b1', '891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'À quoi ressemblait le paysage d''Ares Vallis exploré par Sojourner ? (Plusieurs bonnes réponses)', 'Ares Vallis est un désert rougeâtre parsemé de rochers charriés par d''anciennes crues, dominé au loin par les collines Twin Peaks.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a6d13150-528c-4e70-834e-61354cfddffa', '1c2a45d2-a0c4-4bb0-ba1a-9480d55136b1', 'Un sol couvert de poussière rougeâtre et de sable ET De nombreux rochers et cailloux de toutes tailles ET Deux petites collines à l''horizon appelées Twin Peaks', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9f4b1f2f-6e2c-4b63-a40c-86d745da1781', '1c2a45d2-a0c4-4bb0-ba1a-9480d55136b1', 'Des forêts d''arbres verts ET Des rivières d''eau bleue qui coulent', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a6ba4fbc-df62-414a-9293-a7abc453af79', '1c2a45d2-a0c4-4bb0-ba1a-9480d55136b1', 'Un sol couvert de poussière rougeâtre et de sable', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f5103d61-c4f3-4fe7-87c3-76dace0a0c6c', '891ff3aa-a46d-4fb2-8fe1-4ced5d371783', 'Combien de jours martiens (sols) la mission de Sojourner devait-elle durer au minimum ?', 'La mission primaire de Sojourner n''était prévue que pour 7 sols, mais il a finalement fonctionné pendant 83 sols.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('affa8f2c-289b-4c03-89ba-d1f78d2c2f2e', 'f5103d61-c4f3-4fe7-87c3-76dace0a0c6c', '7 jours martiens', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d52a4bf0-c74d-4089-b33c-1dc15ebd4597', 'f5103d61-c4f3-4fe7-87c3-76dace0a0c6c', '100 jours martiens', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a9500c25-b5ac-40f4-a86f-a0f7c870f975', 'f5103d61-c4f3-4fe7-87c3-76dace0a0c6c', '1 000 jours martiens', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f740c15c-52bd-42b8-bdd5-12485574e1c0', 'f5103d61-c4f3-4fe7-87c3-76dace0a0c6c', '10 ans', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Rover Sojourner & Mars Pathfinder (Expert) (rover-sojourner-expert)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'rover-sojourner-expert', 'Rover Sojourner & Mars Pathfinder (Expert)', 'EXPERT'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'mars' LIMIT 1), NULL, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9c3244f0-ed7f-454b-ad25-257bf0e80b71', 'ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'Quel microprocesseur 8 bits cadencé à environ 2 MHz équipait l''ordinateur de bord du rover Sojourner ?', 'Sojourner était piloté par un microprocesseur Intel 80C85 (version CMOS du 8085) avec environ 512 Ko de RAM, exécutant une boucle de contrôle cyclique.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('866f27cf-0bfc-4cae-88aa-ef8ea5323e47', '9c3244f0-ed7f-454b-ad25-257bf0e80b71', 'Intel 80C85', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ba119f7a-6ee0-4160-8497-27eb7e40a20c', '9c3244f0-ed7f-454b-ad25-257bf0e80b71', 'BAE RAD6000', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('690dda74-f064-40a5-858e-33be12e065b5', '9c3244f0-ed7f-454b-ad25-257bf0e80b71', 'Motorola 68000', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d90ffb87-36ef-468f-8076-bf110b0d9bde', '9c3244f0-ed7f-454b-ad25-257bf0e80b71', 'Qualcomm Snapdragon 801', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('4a015b5d-1f98-4d4d-989e-870f7599433a', 'ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'À sa vitesse nominale maximale de 1 cm/s, combien de minutes faut-il à Sojourner pour parcourir une distance linéaire de 15 mètres sans arrêt ?', '15 m = 1 500 cm ; à 1 cm/s, le trajet prend 1 500 secondes, soit 1 500 / 60 = 25 minutes.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dc45072d-8d61-41e6-a97c-6538a095d60f', '4a015b5d-1f98-4d4d-989e-870f7599433a', '25 minutes', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8c19e400-cf53-4016-9931-d2c2ff82a843', '4a015b5d-1f98-4d4d-989e-870f7599433a', '38 minutes', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7d95fa93-01a6-4f5d-9234-bbfc14d77012', '4a015b5d-1f98-4d4d-989e-870f7599433a', '13 minutes', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fb770250-4bb1-44c5-82c3-5821cd3151b2', '4a015b5d-1f98-4d4d-989e-870f7599433a', '35 minutes', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a2aa0f18-050e-4bd0-9a28-693d4c725216', 'ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'Quel bug logiciel célèbre a provoqué des redémarrages répétés de l''atterrisseur Mars Pathfinder peu après l''atterrissage, avant d''être corrigé depuis la Terre ?', 'Ce cas d''école d''inversion de priorité sous VxWorks a été résolu en activant à distance l''héritage de priorité (priority inheritance) sur le sémaphore concerné.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cdb6cb6c-96c6-45d5-9c2e-f31177d6bb9d', 'a2aa0f18-050e-4bd0-9a28-693d4c725216', 'Une inversion de priorité (priority inversion) sur un mutex du bus de données sous VxWorks', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cf505313-7986-4cf4-b0f7-ec89603a0fb5', 'a2aa0f18-050e-4bd0-9a28-693d4c725216', 'Un dépassement d''entier lié au passage à l''an 2000', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a5b75b5d-65e5-40b5-a837-2090ae34b61f', 'a2aa0f18-050e-4bd0-9a28-693d4c725216', 'Une division par zéro dans le calcul de la trajectoire solaire', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1676566d-b9f7-4b9b-a1b6-4d91f08056a9', 'a2aa0f18-050e-4bd0-9a28-693d4c725216', 'La saturation complète de la mémoire flash par les images couleur', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c9059573-3316-4458-951d-30c687019cb6', 'ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'Quels éléments composaient la séquence innovante d''entrée, descente et atterrissage (EDL) de Mars Pathfinder ? (Plusieurs bonnes réponses)', 'Mars Pathfinder a inauguré l''entrée directe combinant bouclier thermique, parachute, rétrofusées RAD, câble de suspension et grappe d''airbags.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('12b16611-7acb-432d-829c-c56d00bf93e0', 'c9059573-3316-4458-951d-30c687019cb6', 'Un bouclier thermique inspiré des sondes Viking effectuant une entrée directe sans mise en orbite préalable ET Un parachute supersonique de 11,5 mètres de diamètre ET Trois rétrofusées à poudre (RAD) allumées à environ 100 mètres d''altitude pour annuler la vitesse verticale ET Une grappe de quatre airbags tétraédriques gonflés juste avant l''impact', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('11bf0995-79f7-4b7b-a47e-503ce8efc4a5', 'c9059573-3316-4458-951d-30c687019cb6', 'Un grutage par câble (Sky Crane) descendant le rover directement sur ses roues', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('05578fae-c981-45cf-b3e0-3f94d1344d1b', 'c9059573-3316-4458-951d-30c687019cb6', 'Un bouclier thermique inspiré des sondes Viking effectuant une entrée directe sans mise en orbite préalable', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('d7e8b51c-9aeb-4eda-9027-9b26cacd7a0a', 'ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'Vrai ou faux : Le spectromètre APXS de Sojourner utilisait des sources radioactives de curium-244 pour émettre des particules alpha vers la roche analysée.', 'L''APXS embarquait neuf sources de curium-244 et mesurait les particules alpha rétrodiffusées, les protons émis et les rayons X caractéristiques.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c7dced94-03e5-4559-a86e-eac81b280bb1', 'd7e8b51c-9aeb-4eda-9027-9b26cacd7a0a', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e41eed07-25e9-41b9-bb12-6aad4080d949', 'd7e8b51c-9aeb-4eda-9027-9b26cacd7a0a', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9f038543-889f-4709-877b-6b3e31a6f251', 'ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'Quel incident mécanique a retardé la descente de Sojourner lors du sol 1, obligeant les ingénieurs à effectuer une manœuvre corrective ?', 'Un pli d''airbag formait un bourrelet devant la rampe ; les ingénieurs ont actionné le moteur du pétale pour rétracter l''airbag et libérer le passage.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('692c56a2-9878-4d89-9fb7-a1e12aac055f', '9f038543-889f-4709-877b-6b3e31a6f251', 'Un airbag mal rétracté gênait l''extrémité de la rampe de déploiement avant', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ee37f0c9-3f06-41c5-a7da-704353825ea3', '9f038543-889f-4709-877b-6b3e31a6f251', 'Le panneau solaire de Sojourner était resté bloqué en position repliée', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a4170134-bfb0-4ada-9d27-624b1aa9e2cd', '9f038543-889f-4709-877b-6b3e31a6f251', 'L''une des six roues était coincée contre le mât caméra de l''atterrisseur', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c008403c-9e32-4cfb-a2e2-64a6ab2dea20', '9f038543-889f-4709-877b-6b3e31a6f251', 'Les boulons pyrotechniques de la rampe arrière n''avaient pas explosé', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('db3493b0-c3de-4f70-94b2-6ec9a495e27c', 'ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'Remets dans l''ordre chronologique les phases finales de l''atterrissage de Mars Pathfinder le 4 juillet 1997.', 'Après le parachute, l''atterrisseur est descendu le long de sa longe, a gonflé ses airbags, allumé les rétrofusées RAD puis coupé le câble à ~21 m avant la chute libre finale.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('802daff3-a3da-40a4-a1ee-fd6f1a235c68', 'db3493b0-c3de-4f70-94b2-6ec9a495e27c', '1. Déploiement du parachute supersonique à environ 9,4 km d''altitude ➔ 2. Gonflage des airbags quelques secondes avant l''allumage des rétrofusées ➔ 3. Allumage des trois rétrofusées à poudre (RAD) à ~98 m du sol ➔ 4. Sectionnement du câble de liaison (bridle) à environ 21 m du sol', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4ad311dd-88c8-49c9-87f4-3d854d9a49a0', 'db3493b0-c3de-4f70-94b2-6ec9a495e27c', '1. Sectionnement du câble de liaison (bridle) à environ 21 m du sol ➔ 2. Allumage des trois rétrofusées à poudre (RAD) à ~98 m du sol ➔ 3. Gonflage des airbags quelques secondes avant l''allumage des rétrofusées ➔ 4. Déploiement du parachute supersonique à environ 9,4 km d''altitude', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ca9f2388-0c5a-4018-9c5e-b060ea66a4d9', 'db3493b0-c3de-4f70-94b2-6ec9a495e27c', '1. Gonflage des airbags quelques secondes avant l''allumage des rétrofusées ➔ 2. Déploiement du parachute supersonique à environ 9,4 km d''altitude ➔ 3. Allumage des trois rétrofusées à poudre (RAD) à ~98 m du sol ➔ 4. Sectionnement du câble de liaison (bridle) à environ 21 m du sol', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('aeac6280-02b2-4838-b09e-8f47b5001796', 'ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'Comment Sojourner détectait-il la hauteur des rochers et la profondeur des trous devant lui sans radar ni lidar 3D ?', 'Cinq diodes laser projetaient des motifs sur le sol devant le rover ; la déformation de ces lignes sur les capteurs CCD permettait de détecter obstacles et pentes.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9aa758a6-9b42-4739-9e7f-1d2f9fa5b6ee', 'aeac6280-02b2-4838-b09e-8f47b5001796', 'Par triangulation optique en projetant 5 lignes laser infrarouges observées par ses caméras stéréo', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e25ff8dc-a1c6-48de-9bda-849e182c694f', 'aeac6280-02b2-4838-b09e-8f47b5001796', 'Par écholocalisation ultrasonore dans l''atmosphère martienne', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b12fef92-42a1-4a93-b8b6-6bad8dd8f11a', 'aeac6280-02b2-4838-b09e-8f47b5001796', 'En mesurant la résistance électrique du sol avec ses roues avant', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9b2046aa-d70a-4c96-84fa-67cf75642226', 'aeac6280-02b2-4838-b09e-8f47b5001796', 'Par interférométrie radio avec l''orbiteur Mars Global Surveyor', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('461660ea-23f7-44d9-8a9f-63b39554f8e9', 'ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'Quelles sont les causes techniques identifiées de la perte de contact avec Mars Pathfinder le 27 septembre 1997 ? (Plusieurs bonnes réponses)', 'L''épuisement de la batterie argent-zinc de l''atterrisseur a laissé refroidir son électronique, déréglant l''horloge et l''oscillateur de transmission.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ed0fd49c-1597-423d-b59b-7b664d5cdfd0', '461660ea-23f7-44d9-8a9f-63b39554f8e9', 'La dégradation de la batterie rechargeable argent-zinc de l''atterrisseur après de nombreux cycles thermiques ET La chute de température de l''électronique de l''atterrisseur entraînant une dérive de la fréquence de son oscillateur radio ET La perte de la horloge maître de l''atterrisseur empêchant l''ordonnancement des fenêtres d''émission', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ec04befe-e698-49c8-84a9-026316e2f42c', '461660ea-23f7-44d9-8a9f-63b39554f8e9', 'L''impact d''une météorite détruisant simultanément le rover et l''atterrisseur ET L''ordre volontaire envoyé par la NASA de saborder le rover dans un ravin', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('08a784ba-4319-4a19-9865-ed2fa0ee97a0', '461660ea-23f7-44d9-8a9f-63b39554f8e9', 'La dégradation de la batterie rechargeable argent-zinc de l''atterrisseur après de nombreux cycles thermiques', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('7652a601-6a2d-4647-a802-339b8e725b44', 'ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'Associe chaque sous-système de Sojourner à sa spécification technique.', 'Sojourner disposait de 10 moteurs CC, d''un modem UHF à 9 600 bit/s et de moins d''un mégaoctet de mémoire totale.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('81a2571e-3959-4934-b292-ac621f21680b', '7652a601-6a2d-4647-a802-339b8e725b44', 'Moteurs de roue et direction = 10 moteurs à courant continu (6 pour la traction, 4 pour la direction des roues d''angle) | Liaison radio UHF = Modem UHF à 9 600 bit/s reliant le rover à l''atterrisseur | Mémoire embarquée = 512 Ko de RAM, 176 Ko de mémoire flash et 16 Ko de PROM | Dimensions du châssis = 65 cm de longueur × 48 cm de largeur × 30 cm de hauteur', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('75bf83aa-297c-4cad-b8ba-fba81fbbf2aa', '7652a601-6a2d-4647-a802-339b8e725b44', 'Moteurs de roue et direction = Modem UHF à 9 600 bit/s reliant le rover à l''atterrisseur | Liaison radio UHF = 512 Ko de RAM, 176 Ko de mémoire flash et 16 Ko de PROM | Mémoire embarquée = 65 cm de longueur × 48 cm de largeur × 30 cm de hauteur | Dimensions du châssis = 10 moteurs à courant continu (6 pour la traction, 4 pour la direction des roues d''angle)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('901c85a1-f18e-4e3d-98f8-bbe6f45d076e', 'ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'Comment Sojourner mesurait-il la cohésion, l''angle de frottement interne et la portance du sol martien ?', 'En faisant creuser une seule roue à la fois tout en enregistrant l''intensité électrique absorbée, les ingénieurs déduisaient les propriétés géotechniques du régolithe.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('08b2440f-484f-4e16-acf2-f3f314fb8991', '901c85a1-f18e-4e3d-98f8-bbe6f45d076e', 'En bloquant cinq roues et en faisant patiner la sixième tout en mesurant le courant moteur et l''enfoncement', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2ebf5343-f35f-4ce2-9857-55fcc5cb85a4', '901c85a1-f18e-4e3d-98f8-bbe6f45d076e', 'En tirant un harpon pyrotechnique dans le régolithe', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('eb9bafc2-988c-492e-a33d-17902012cd32', '901c85a1-f18e-4e3d-98f8-bbe6f45d076e', 'En envoyant des ondes sismiques depuis l''atterrisseur', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4a7327f3-43ab-4564-acaa-fbc9446f5539', '901c85a1-f18e-4e3d-98f8-bbe6f45d076e', 'En pesant des échantillons de sable dans un godet interne', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('be73a2e2-7c2d-4116-a913-3f8250c4d913', 'ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'Vrai ou faux : Lorsque la liaison radio entre Sojourner et l''atterrisseur était interrompue pendant plusieurs jours, le rover était programmé pour revenir automatiquement vers l''atterrisseur.', 'En cas de silence radio prolongé de la station de base, le logiciel de sauvegarde commandait à Sojourner de se rapprocher de l''atterrisseur pour tenter de rétablir le contact.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('784b50b5-0d18-44dc-b957-a897a6677a14', 'be73a2e2-7c2d-4116-a913-3f8250c4d913', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9fd0bcec-94f8-438d-9c6c-c737fdaed1bd', 'be73a2e2-7c2d-4116-a913-3f8250c4d913', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('b601540b-6b69-483f-b22d-d950f6be8775', 'ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'Pourquoi les premières analyses APXS des roches martiennes semblaient-elles anormalement riches en soufre avant correction ?', 'Dépourvu de brosse ou de meuleuse (introduites plus tard sur Spirit et Opportunity), l''APXS mesurait un mélange de roche sous-jacente et de poussière superficielle riche en soufre.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('96b72226-585b-403c-b57d-0e763784b69a', 'b601540b-6b69-483f-b22d-d950f6be8775', 'En raison de la fine couche de poussière martienne riche en sulfates recouvrant la surface des roches', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9b35cbcb-3c3f-4b7b-9693-0143dc786a91', 'b601540b-6b69-483f-b22d-d950f6be8775', 'Parce que le capteur était contaminé par les gaz des rétrofusées', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('aa0e54fd-b65f-43c9-b724-fa7dab18366b', 'b601540b-6b69-483f-b22d-d950f6be8775', 'Parce que le plutonium des RHU faussait le spectre', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('09907519-2004-43d9-a202-1c80aee398bb', 'b601540b-6b69-483f-b22d-d950f6be8775', 'Parce que les roches martiennes sont composées de soufre pur', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('129abdca-6d08-41d9-b027-f1094e30df54', 'ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'Quelles expériences embarquées sur Mars Pathfinder et Sojourner ont permis d''étudier l''accumulation de poussière sur les panneaux solaires ? (Plusieurs bonnes réponses)', 'L''expérience MAE et le suivi électrique ont mesuré une perte de puissance due à la poussière d''environ 0,28 % par sol, donnée cruciale pour dimensionner Spirit et Opportunity.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('19daf1d5-629d-490a-b255-f8a48c853513', '129abdca-6d08-41d9-b027-f1094e30df54', 'La cellule solaire de référence (MAE - Materials Adherence Experiment) équipée d''un cache amovible et d''une microbalance à quartz ET Le suivi quotidien de la baisse de courant produit par les panneaux solaires (environ 0,28 % par sol) ET L''observation des dépôts de poussière sur les aimants fixés sur l''atterrisseur', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7f4fb028-d3f0-4531-9bdf-22809433eb99', '129abdca-6d08-41d9-b027-f1094e30df54', 'Un essuie-glace mécanique nettoyant le panneau de Sojourner chaque matin ET Un souffleur d''air comprimé haute pression', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('13e6a641-0294-445e-a2f8-7d7bd69582fe', '129abdca-6d08-41d9-b027-f1094e30df54', 'La cellule solaire de référence (MAE - Materials Adherence Experiment) équipée d''un cache amovible et d''une microbalance à quartz', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('84112daf-b50f-48e6-93e2-5e28ca89821b', 'ba9890cb-0f27-44ce-9a8a-962db3b7e35c', 'Quel était le diamètre approximatif des six roues en aluminium de Sojourner ?', 'Les roues de Sojourner mesuraient 13 cm de diamètre, ce qui lui permettait de franchir des obstacles allant jusqu''à environ 20 cm de hauteur.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b0ebe5a1-a3c3-44db-b82a-d2cc15ba910e', '84112daf-b50f-48e6-93e2-5e28ca89821b', '13 cm', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5b2bc63c-7aca-43d1-92ff-6e2d7a064d81', '84112daf-b50f-48e6-93e2-5e28ca89821b', '30 cm', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1e6ef0cd-6d0b-4899-840d-7a4b2171eb2f', '84112daf-b50f-48e6-93e2-5e28ca89821b', '52 cm', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1bf5a977-f8f4-41f8-b734-b8c51c235096', '84112daf-b50f-48e6-93e2-5e28ca89821b', '85 cm', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Atterrisseurs Phoenix & InSight (Explorateur) (phoenix-insight-explorer)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('ded6188b-a7d9-4c12-8efe-52526f99359b', 'phoenix-insight-explorer', 'Atterrisseurs Phoenix & InSight (Explorateur)', 'EXPLORER'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'mars' LIMIT 1), NULL, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('07b8f9ed-51c4-49ee-a837-bdc55f1a1c2d', 'ded6188b-a7d9-4c12-8efe-52526f99359b', 'Sur quelle planète les atterrisseurs Phoenix et InSight se sont-ils posés ?', 'Phoenix et InSight sont deux atterrisseurs envoyés sur la planète Mars[cite: 29].', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('86f975fa-96ed-4a52-b2dd-e81fea8f4c03', '07b8f9ed-51c4-49ee-a837-bdc55f1a1c2d', 'Mars', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8ebf98f8-4f73-46bf-bcdf-1f169d8eba0b', '07b8f9ed-51c4-49ee-a837-bdc55f1a1c2d', 'Mercure', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cbce4974-64ba-460d-afaf-e926725e3092', '07b8f9ed-51c4-49ee-a837-bdc55f1a1c2d', 'Saturne', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dd875e1a-0a88-4905-8043-730182da5054', '07b8f9ed-51c4-49ee-a837-bdc55f1a1c2d', 'Uranus', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('4ca93f18-f45e-47a3-9110-2babfeda2d03', 'ded6188b-a7d9-4c12-8efe-52526f99359b', 'Vrai ou faux : L''atterrisseur InSight roulait sur Mars grâce à des roues comme une voiture.', 'Faux, InSight était un atterrisseur fixe posé sur la surface de Mars sans rouler[cite: 29].', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('29b5fd73-98ce-4562-bddd-570f5ec270f3', '4ca93f18-f45e-47a3-9110-2babfeda2d03', 'Vrai', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('eee87576-0dea-47ee-b3d0-30cc621605a4', '4ca93f18-f45e-47a3-9110-2babfeda2d03', 'Faux', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c8b5abce-8342-4b42-92f9-f088e2086c36', 'ded6188b-a7d9-4c12-8efe-52526f99359b', 'Quelle était la mission principale du robot InSight sur Mars ?', 'InSight a écouté les séismes martiens (marsquakes) afin d''étudier l''intérieur de la planète[cite: 29].', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('245c3d68-1b13-4c63-862a-0e9106405d72', 'c8b5abce-8342-4b42-92f9-f088e2086c36', 'Écouter les séismes martiens', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('939533d1-926f-4436-8e9b-7d41fcc13471', 'c8b5abce-8342-4b42-92f9-f088e2086c36', 'Chercher des plantes vertes', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0bc775a9-a4d9-4ffe-855b-54e05603eb6e', 'c8b5abce-8342-4b42-92f9-f088e2086c36', 'Construire une maison pour astronautes', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e4208a7a-2306-45c8-a0d9-eebaec4f442e', 'c8b5abce-8342-4b42-92f9-f088e2086c36', 'Voler au-dessus des nuages', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('563caee2-cd6e-41b8-9b25-5873e119ddf2', 'ded6188b-a7d9-4c12-8efe-52526f99359b', 'Quels équipements se trouvaient sur l''atterrisseur InSight ? (Plusieurs bonnes réponses)', 'InSight était équipé de panneaux solaires, d''un bras robotique et d''une caméra de déploiement d''instruments[cite: 29].', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('74045e91-6de3-4c9b-8d05-d063f4a92e88', '563caee2-cd6e-41b8-9b25-5873e119ddf2', 'Des panneaux solaires ET Un bras robotique ET Une caméra sur le bras robotique', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a97ffbd5-adf6-4b6a-970a-cfa147f213cf', '563caee2-cd6e-41b8-9b25-5873e119ddf2', 'Des ailes d''oiseau ET Une hélice de sous-marin', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('266826b5-1b42-48ad-9b0d-83d9fb6af5b8', '563caee2-cd6e-41b8-9b25-5873e119ddf2', 'Des panneaux solaires', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('27e98ef9-ac9d-40e1-bdaf-124231dae12d', 'ded6188b-a7d9-4c12-8efe-52526f99359b', 'Que cherchait l''atterrisseur Phoenix en forant le sol de Mars ?', 'Phoenix a foré le sol martien à la recherche de glace d''eau[cite: 29].', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e3c81701-4723-4384-b702-8a025f345f0d', '27e98ef9-ac9d-40e1-bdaf-124231dae12d', 'De la glace d''eau', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('648d25dc-82b0-4ac1-ac2c-a71f25f6955b', '27e98ef9-ac9d-40e1-bdaf-124231dae12d', 'Du pétrole', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7f0b3350-6347-4878-958f-57d549d57b3c', '27e98ef9-ac9d-40e1-bdaf-124231dae12d', 'Des diamants', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6db0c197-69f2-415c-8455-0694ab14c711', '27e98ef9-ac9d-40e1-bdaf-124231dae12d', 'Des coquillages', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('29bad166-e944-4145-9db5-9981172ca981', 'ded6188b-a7d9-4c12-8efe-52526f99359b', 'Environ combien de mètres mesurait le bras robotique d''InSight (arrondi au nombre entier le plus proche) ?', 'Le bras robotique d''InSight mesurait plus de 1,8 mètre de long, soit près de 2 mètres[cite: 29].', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c29ca255-d142-4b37-9b26-9810e495129b', '29bad166-e944-4145-9db5-9981172ca981', '2 mètres', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6d01ee42-20d5-46b0-9db4-1a5cbf9f0a89', '29bad166-e944-4145-9db5-9981172ca981', '3 mètres', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9fd23147-d1c0-4a5a-892e-3730709d5804', '29bad166-e944-4145-9db5-9981172ca981', '1 mètres', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f0fdd3b7-b9cb-42bb-994b-6acdbe0533ab', '29bad166-e944-4145-9db5-9981172ca981', '5 mètres', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c245426f-7cb3-47b3-8f68-577e807e6db5', 'ded6188b-a7d9-4c12-8efe-52526f99359b', 'Pourquoi Phoenix et InSight ont-ils fini par s''arrêter de fonctionner ?', 'Phoenix et InSight ont tous deux fini par tomber en panne de courant sur Mars[cite: 29].', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('800b3e9c-ce4e-4eba-bd2b-2f7b0bc11814', 'c245426f-7cb3-47b3-8f68-577e807e6db5', 'Ils sont tombés en panne de courant', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9c32c4dc-e6bf-4045-b926-3f5c90b2f706', 'c245426f-7cb3-47b3-8f68-577e807e6db5', 'Ils sont revenus sur Terre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8c47724f-60a1-48a3-8ae4-14a5a6e82c45', 'c245426f-7cb3-47b3-8f68-577e807e6db5', 'Ils ont plongé dans un océan', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cc1811ea-b2db-4ee8-a430-2b17ce93536e', 'c245426f-7cb3-47b3-8f68-577e807e6db5', 'Ils ont été démontés par des astronautes', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('bd8d748a-0950-4dca-9cdc-6026cc0a9a5f', 'ded6188b-a7d9-4c12-8efe-52526f99359b', 'Vrai ou faux : InSight a posé un bouclier en forme de dôme par-dessus son sismomètre pour le protéger du vent et des changements de température.', 'Vrai, InSight a recouvert son sismomètre d''un bouclier éolien et thermique en forme de dôme[cite: 29].', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c9cb365a-cac4-435c-91d1-7c6b71a9271e', 'bd8d748a-0950-4dca-9cdc-6026cc0a9a5f', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('43c58e92-8b47-49b4-a8b8-58cc257cd98f', 'bd8d748a-0950-4dca-9cdc-6026cc0a9a5f', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('6da5b3fb-4716-49fb-aa85-e56a27645036', 'ded6188b-a7d9-4c12-8efe-52526f99359b', 'Remets ces étapes de la mission d''InSight dans le bon ordre :', 'InSight a été lancé, s''est posé sur Mars, a déployé son sismomètre puis s''est arrêté faute d''énergie[cite: 29].', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('37d47c45-57aa-4ead-b188-9befd667907b', '6da5b3fb-4716-49fb-aa85-e56a27645036', '1. La fusée décolle vers Mars ➔ 2. L''atterrisseur se pose sur Mars ➔ 3. Le bras pose le sismomètre sur le sol ➔ 4. L''atterrisseur s''éteint par manque d''électricité', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dc112fec-b599-4711-872b-043937de0d59', '6da5b3fb-4716-49fb-aa85-e56a27645036', '1. L''atterrisseur s''éteint par manque d''électricité ➔ 2. Le bras pose le sismomètre sur le sol ➔ 3. L''atterrisseur se pose sur Mars ➔ 4. La fusée décolle vers Mars', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e1725292-b238-47c3-9a21-b4ce8ecb8d51', '6da5b3fb-4716-49fb-aa85-e56a27645036', '1. L''atterrisseur se pose sur Mars ➔ 2. La fusée décolle vers Mars ➔ 3. Le bras pose le sismomètre sur le sol ➔ 4. L''atterrisseur s''éteint par manque d''électricité', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('bdcb44ab-a1e3-46c5-8814-8cd3778a8c4c', 'ded6188b-a7d9-4c12-8efe-52526f99359b', 'Qu''est-ce qui a recouvert les panneaux solaires d''InSight au fil du temps sur Mars ?', 'La poussière martienne s''est accumulée sur les panneaux solaires d''InSight, réduisant sa puissance électrique[cite: 29].', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7d13b27e-8930-46da-a214-c5fe1f099041', 'bdcb44ab-a1e3-46c5-8814-8cd3778a8c4c', 'De la poussière martienne', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b46d0bc7-832d-4712-b951-f9154fc88b13', 'bdcb44ab-a1e3-46c5-8814-8cd3778a8c4c', 'De la neige fondue', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0caaadae-1ce1-4a8a-a8f6-7103d74ea23a', 'bdcb44ab-a1e3-46c5-8814-8cd3778a8c4c', 'Des feuilles d''arbres', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a69ea5d4-1e51-44f7-b1e6-71498c4ef0f9', 'bdcb44ab-a1e3-46c5-8814-8cd3778a8c4c', 'De la peinture grise', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('0a5c001e-9b07-4273-8fd0-2cbf56d94b98', 'ded6188b-a7d9-4c12-8efe-52526f99359b', 'Qu''est-ce qui pouvait faire vibrer le sol ou l''atterrisseur InSight sur Mars ? (Plusieurs bonnes réponses)', 'InSight a capté les séismes martiens, les impacts de météoroïdes ainsi que les vibrations causées par le vent[cite: 29].', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e0940188-b9c0-436b-95bd-2465d822e314', '0a5c001e-9b07-4273-8fd0-2cbf56d94b98', 'Des séismes martiens ET Des chutes de météorites ET Le vent martien', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8dfd5e1b-08c8-44ce-9191-e67d9b410a18', '0a5c001e-9b07-4273-8fd0-2cbf56d94b98', 'Des voitures sur une route ET Des vagues dans un océan', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2b59aa65-ddba-4c25-8dee-6d242bdf9396', '0a5c001e-9b07-4273-8fd0-2cbf56d94b98', 'Des séismes martiens', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('8dd46991-f102-4620-9276-12764365120d', 'ded6188b-a7d9-4c12-8efe-52526f99359b', 'Associe chaque élément d''InSight à son rôle :', 'Les panneaux alimentent le robot, le bras déploie les outils, le sismomètre écoute et le dôme le protège[cite: 29].', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5ea4d47b-d7e6-4c30-8960-e2889150ef62', '8dd46991-f102-4620-9276-12764365120d', 'Panneaux solaires = Produire de l''électricité avec la lumière du Soleil | Bras robotique = Attraper et poser les instruments sur le sol | Sismomètre SEIS = Écouter les séismes martiens | Bouclier en dôme = Protéger le sismomètre du vent et de la température', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9033f223-5a7c-4d01-a519-e2296c184e4f', '8dd46991-f102-4620-9276-12764365120d', 'Panneaux solaires = Attraper et poser les instruments sur le sol | Bras robotique = Écouter les séismes martiens | Sismomètre SEIS = Protéger le sismomètre du vent et de la température | Bouclier en dôme = Produire de l''électricité avec la lumière du Soleil', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('34331e27-2a28-4557-a4df-dc3ce2c0a29c', 'ded6188b-a7d9-4c12-8efe-52526f99359b', 'Avec quel appareil InSight a-t-il pris des « selfies » de lui-même sur Mars ?', 'InSight a pris ses selfies grâce à la caméra de déploiement d''instruments montée sur son bras robotique[cite: 29].', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7c4161d1-14fe-44f5-99e8-cc272dc7b610', '34331e27-2a28-4557-a4df-dc3ce2c0a29c', 'La caméra fixée sur son bras robotique', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a417d766-b38c-4faf-9094-5015495bc4a0', '34331e27-2a28-4557-a4df-dc3ce2c0a29c', 'Un appareil photo tenu par un astronaute', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4b831e64-cce6-44f3-9cc0-f4e445e1c25d', '34331e27-2a28-4557-a4df-dc3ce2c0a29c', 'Un petit drone volant', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e321b12a-1abf-4f0f-85d6-209fad4ca0e1', '34331e27-2a28-4557-a4df-dc3ce2c0a29c', 'Un satellite autour de la Lune', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('dd472e8d-0d8f-43eb-971d-c472044cf836', 'ded6188b-a7d9-4c12-8efe-52526f99359b', 'Quelles affirmations sont vraies à propos de Phoenix et InSight ? (Plusieurs bonnes réponses)', 'Phoenix et InSight sont deux atterrisseurs de la NASA qui ont opéré sur Mars avant de manquer d''électricité[cite: 29].', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a64e5d48-b06b-472a-bda5-656bcd101926', 'dd472e8d-0d8f-43eb-971d-c472044cf836', 'Ce sont des missions de la NASA ET Ils ont exploré la surface de Mars ET Ils ont tous deux fini par tomber en panne de courant', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('84d748ca-1d24-49c5-a7ac-06c1ce7e08fd', 'dd472e8d-0d8f-43eb-971d-c472044cf836', 'Ils ont ramené des astronautes sur Terre ET Ils roulent encore aujourd''hui sur Mars', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4e2a120a-4622-4132-82f4-7d28213fec24', 'dd472e8d-0d8f-43eb-971d-c472044cf836', 'Ce sont des missions de la NASA', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('aabfacac-10ec-4d95-8d3c-69a957b75cbc', 'ded6188b-a7d9-4c12-8efe-52526f99359b', 'Grâce aux séismes détectés par InSight, qu''ont pu étudier les scientifiques ?', 'InSight a permis aux scientifiques d''étudier la croûte, le manteau et le noyau de Mars[cite: 29].', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dfa70890-bbab-4c2e-a39f-ed5b819eaefd', 'aabfacac-10ec-4d95-8d3c-69a957b75cbc', 'Les couches profondes à l''intérieur de Mars', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fc71c16f-04c1-4d28-81dc-b28dbd292db2', 'aabfacac-10ec-4d95-8d3c-69a957b75cbc', 'Les poissons des rivières martiennes', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f2119052-b338-4bdd-b879-57d6b3890ac5', 'aabfacac-10ec-4d95-8d3c-69a957b75cbc', 'Les nuages de la Terre', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c9d6a478-a586-4567-8713-e78c6e56eb23', 'aabfacac-10ec-4d95-8d3c-69a957b75cbc', 'Les anneaux de Saturne', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Atterrisseurs Phoenix & InSight (Expert) (phoenix-insight-expert)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('bffec71a-9224-45d4-bb62-8a7dcc65d510', 'phoenix-insight-expert', 'Atterrisseurs Phoenix & InSight (Expert)', 'EXPERT'::"QuizLevel", (SELECT "id" FROM "celestial_bodies" WHERE "slug" = 'mars' LIMIT 1), NULL, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f0f7b83b-6c50-471b-82aa-968689181427', 'bffec71a-9224-45d4-bb62-8a7dcc65d510', 'À quelle date l''atterrisseur InSight a-t-il été lancé depuis la base de Vandenberg en Californie ?', 'InSight a été lancé le 5 mai 2018 à bord d''une fusée Atlas V-401 depuis Vandenberg Air Force Base[cite: 29].', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cbcd454f-85fa-4b6c-bec7-13ccaa4ea228', 'f0f7b83b-6c50-471b-82aa-968689181427', '5 mai 2018', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('584b124f-cd79-4296-b903-852e27342a98', 'f0f7b83b-6c50-471b-82aa-968689181427', '26 novembre 2018', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fd154d52-3813-4ad2-94a5-bc41bde28473', 'f0f7b83b-6c50-471b-82aa-968689181427', '4 mai 2022', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4b12cc60-00cd-4e11-b41e-745202ef9a2f', 'f0f7b83b-6c50-471b-82aa-968689181427', '15 décembre 2022', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('fb043dc1-d222-4a50-9389-3bde99556b2e', 'bffec71a-9224-45d4-bb62-8a7dcc65d510', 'Dans quelle région de Mars l''atterrisseur InSight s''est-il posé le 26 novembre 2018 ?', 'InSight a atterri dans Elysium Planitia le 26 novembre 2018[cite: 29].', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ff103d80-5553-498f-9409-74f08114db99', 'fb043dc1-d222-4a50-9389-3bde99556b2e', 'Elysium Planitia', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d059a342-2b47-4af2-80c0-a0e2e88126ac', 'fb043dc1-d222-4a50-9389-3bde99556b2e', 'Amazonis Planitia', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('673f9d2d-379a-407e-ab9d-175216bedcb8', 'fb043dc1-d222-4a50-9389-3bde99556b2e', 'Valles Marineris', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fe7d7d57-de11-4fab-9667-46e8bf10bfc7', 'fb043dc1-d222-4a50-9389-3bde99556b2e', 'Olympus Mons', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('cb11eeb2-174e-411f-acbd-c648fe6fbeb3', 'bffec71a-9224-45d4-bb62-8a7dcc65d510', 'Combien de séismes martiens (marsquakes) le sismomètre d''InSight a-t-il enregistrés au total avant la fin de sa mission ?', 'Le sismomètre ultrasensible d''InSight a enregistré 1 319 séismes martiens avant la fin de mission en 2022[cite: 29].', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('da709410-78d3-4405-810d-768895cf1df7', 'cb11eeb2-174e-411f-acbd-c648fe6fbeb3', '1319 séismes', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c0d9ee7a-2d32-4b57-92c9-7708f30c730f', 'cb11eeb2-174e-411f-acbd-c648fe6fbeb3', '1979 séismes', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cea0ee1e-b673-4146-a833-c08ac53195ca', 'cb11eeb2-174e-411f-acbd-c648fe6fbeb3', '660 séismes', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('84ee3571-07e7-4b0f-a7f7-16e6a50ea92d', 'cb11eeb2-174e-411f-acbd-c648fe6fbeb3', '1329 séismes', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('47a2d516-9e3a-487a-897f-5944623d7778', 'bffec71a-9224-45d4-bb62-8a7dcc65d510', 'Vrai ou faux : Le plus grand séisme jamais détecté sur une autre planète a été enregistré par InSight le 4 mai 2022 avec une magnitude estimée à 5.', 'Vrai, le 4 mai 2022 (sol 1 222), InSight a enregistré un marsquake estimé à une magnitude 5[cite: 29].', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('48cd9d1e-d277-4103-b8bc-8be6777e0d9f', '47a2d516-9e3a-487a-897f-5944623d7778', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e21db14f-2f25-450c-b1ab-3e7e0210a260', '47a2d516-9e3a-487a-897f-5944623d7778', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('967e959f-2169-4ffd-b849-970f707d2c61', 'bffec71a-9224-45d4-bb62-8a7dcc65d510', 'Quel lanceur a propulsé InSight vers Mars en mai 2018 ?', 'InSight a été lancé par une fusée Atlas V-401[cite: 29].', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2306c6dc-31ed-4943-9ed1-e2e30ac7e2b4', '967e959f-2169-4ffd-b849-970f707d2c61', 'Atlas V-401', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7324c93b-a4fc-4ecd-a95a-fcf27155db76', '967e959f-2169-4ffd-b849-970f707d2c61', 'Falcon 9', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('247f689b-1d4a-4203-b3b0-2429ffd6d6b2', '967e959f-2169-4ffd-b849-970f707d2c61', 'Delta II', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ef31d1f1-a8fb-4f41-b562-92df8fbd4cce', '967e959f-2169-4ffd-b849-970f707d2c61', 'Titan IV', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('cf3ef3d1-2ed6-4780-aa14-9dfc21b44bf4', 'bffec71a-9224-45d4-bb62-8a7dcc65d510', 'Parmi ces équipements scientifiques, lesquels équipaient l''atterrisseur InSight ? (Plusieurs bonnes réponses)', 'InSight embarquait le sismomètre SEIS, une sonde thermique pour explorer le sous-sol et un magnétomètre[cite: 29].', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('022e21c7-4faf-4c4d-b328-ebc68db6271b', 'cf3ef3d1-2ed6-4780-aa14-9dfc21b44bf4', 'Le sismomètre SEIS ET Une sonde thermique (heat probe) ET Un magnétomètre', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c21c4bff-063b-4d2d-a43d-1cc25ea0a78c', 'cf3ef3d1-2ed6-4780-aa14-9dfc21b44bf4', 'Un hélicoptère drone ET Un télescope spatial infrarouge', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3b8ea8c6-2ed1-4e93-a025-121324b97f89', 'cf3ef3d1-2ed6-4780-aa14-9dfc21b44bf4', 'Le sismomètre SEIS', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('64e9dc48-4f9c-4209-b355-b2075c4c65e4', 'bffec71a-9224-45d4-bb62-8a7dcc65d510', 'Quel était le diamètre du cratère formé par l''impact météoritique du 5 septembre 2021 détecté par InSight ?', 'Le cratère d''impact formé le 5 septembre 2021 mesurait 21,5 mètres (71 pieds) de diamètre[cite: 29].', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c07fa7d7-a19b-4bc5-a7f3-bfd553351870', '64e9dc48-4f9c-4209-b355-b2075c4c65e4', '21,5 mètres (71 pieds)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4b2d23d6-7e67-43a0-a8ee-e6946904c324', '64e9dc48-4f9c-4209-b355-b2075c4c65e4', '1,8 mètre (5,9 pieds)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('340822f1-fdd3-48fb-8303-31ebbe7cfcef', '64e9dc48-4f9c-4209-b355-b2075c4c65e4', '61 mètres (200 pieds)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2d255b4c-57d5-47d3-9784-b0f97e504c19', '64e9dc48-4f9c-4209-b355-b2075c4c65e4', '500 mètres (1 640 pieds)', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('3b7d92a2-7e64-4057-9ebf-4e1ea54c6cad', 'bffec71a-9224-45d4-bb62-8a7dcc65d510', 'Classe ces étapes de la mission InSight dans l''ordre chronologique :', 'Le sismomètre a été déposé le 19 décembre 2018, protégé par son bouclier le 2 février 2019, a capté le séisme record en mai 2022 et la mission s''est achevée en décembre 2022[cite: 29].', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a8f2a8df-fa8f-4485-8195-5e905134a74f', '3b7d92a2-7e64-4057-9ebf-4e1ea54c6cad', '1. Dépôt du sismomètre sur le sol martien (19 décembre 2018) ➔ 2. Déploiement du bouclier éolien et thermique (2 février 2019) ➔ 3. Détection du séisme de magnitude 5 (4 mai 2022) ➔ 4. Fin officielle de la mission (décembre 2022)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('43ec6c17-62a9-456a-9736-1576ffac8b68', '3b7d92a2-7e64-4057-9ebf-4e1ea54c6cad', '1. Fin officielle de la mission (décembre 2022) ➔ 2. Détection du séisme de magnitude 5 (4 mai 2022) ➔ 3. Déploiement du bouclier éolien et thermique (2 février 2019) ➔ 4. Dépôt du sismomètre sur le sol martien (19 décembre 2018)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5eb25214-355f-4dcb-b180-5193f56b8781', '3b7d92a2-7e64-4057-9ebf-4e1ea54c6cad', '1. Déploiement du bouclier éolien et thermique (2 février 2019) ➔ 2. Dépôt du sismomètre sur le sol martien (19 décembre 2018) ➔ 3. Détection du séisme de magnitude 5 (4 mai 2022) ➔ 4. Fin officielle de la mission (décembre 2022)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('32d0f254-2e0f-4c18-83b1-83fd46bf8adc', 'bffec71a-9224-45d4-bb62-8a7dcc65d510', 'Quel orbiteur de la NASA a photographié les cratères d''impact correspondant aux signaux sismiques enregistrés par InSight ?', 'Mars Reconnaissance Orbiter a photographié les nouveaux cratères associés aux vibrations sismiques détectées par InSight[cite: 29].', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a59c0b25-b572-49ef-86a9-f9a40878b984', '32d0f254-2e0f-4c18-83b1-83fd46bf8adc', 'Mars Reconnaissance Orbiter (MRO)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4ae328c9-23e6-4d94-bce7-96ea3d9ad82d', '32d0f254-2e0f-4c18-83b1-83fd46bf8adc', 'Sonde Dawn', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9d426ad9-9136-4891-9349-28f8eaba1c20', '32d0f254-2e0f-4c18-83b1-83fd46bf8adc', 'Télescope Hubble', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f0813e99-06ab-454b-a544-7602f88b1c62', '32d0f254-2e0f-4c18-83b1-83fd46bf8adc', 'Sonde Voyager 1', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('3b346ecc-dc4d-44e5-b85b-140e7ed11846', 'bffec71a-9224-45d4-bb62-8a7dcc65d510', 'Vrai ou faux : Le magnétomètre d''InSight a découvert que les roches situées entre 61 mètres (200 pieds) et plusieurs kilomètres de profondeur sont fortement magnétisées.', 'Vrai, le magnétomètre d''InSight a révélé que d''anciennes roches situées entre 61 mètres (200 pieds) et plusieurs kilomètres sous la surface sont fortement magnétisées[cite: 29].', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('915887ce-39f2-4a3a-9cc7-59cb892dd2ed', '3b346ecc-dc4d-44e5-b85b-140e7ed11846', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9e55c7de-b83e-481a-8fbc-d891b6bff500', '3b346ecc-dc4d-44e5-b85b-140e7ed11846', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('1c8d4ef8-095f-413b-bd50-e82f55eb012b', 'bffec71a-9224-45d4-bb62-8a7dcc65d510', 'Quels éléments caractérisent conjointement les atterrisseurs Phoenix et InSight ? (Plusieurs bonnes réponses)', 'Phoenix (forage pour trouver de la glace d''eau) et InSight (écoute des séismes martiens) sont deux atterrisseurs martiens ayant tous deux fini par manquer de courant[cite: 29].', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5f91647b-bd35-4936-b538-f218f6cb625e', '1c8d4ef8-095f-413b-bd50-e82f55eb012b', 'Ils ont exploré la surface de Mars ET Ils ont tous deux fini par tomber en panne de courant ET Phoenix a foré à la recherche de glace d''eau tandis qu''InSight a écouté les séismes martiens', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2dff630b-a5f9-433d-81dd-7828d995e6aa', '1c8d4ef8-095f-413b-bd50-e82f55eb012b', 'Ils étaient tous deux équipés de moteurs ioniques au xénon ET Ils ont tous deux atterri sur Cérès', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('23052bc1-2a97-4dfc-9c3b-4caf02e67050', '1c8d4ef8-095f-413b-bd50-e82f55eb012b', 'Ils ont exploré la surface de Mars', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('bfc7e5d3-5aab-4230-97ac-dc6f7ea258fc', 'bffec71a-9224-45d4-bb62-8a7dcc65d510', 'Associe chaque date de la mission InSight à l''événement correspondant :', 'InSight a décollé le 5 mai 2018, s''est posé le 26 novembre 2018, a déployé le bouclier de SEIS en février 2019 et a capturé son dernier selfie le 24 avril 2022.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cb4511b0-7bc3-4a0e-9295-dd01077d8241', 'bfc7e5d3-5aab-4230-97ac-dc6f7ea258fc', '5 mai 2018 = Lancement depuis la base de Vandenberg | 26 novembre 2018 = Atterrissage dans Elysium Planitia | 2 février 2019 = Déploiement du bouclier thermique du sismomètre SEIS | 24 avril 2022 = Dernier selfie d''InSight montrant ses panneaux couverts de poussière', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('07bb053b-a1f0-47bc-b933-a8e5d21d3af9', 'bfc7e5d3-5aab-4230-97ac-dc6f7ea258fc', '5 mai 2018 = Atterrissage dans Elysium Planitia | 26 novembre 2018 = Déploiement du bouclier thermique du sismomètre SEIS | 2 février 2019 = Dernier selfie d''InSight montrant ses panneaux couverts de poussière | 24 avril 2022 = Lancement depuis la base de Vandenberg', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Sonde NEAR Shoemaker sur Éros (Explorateur) (near-shoemaker-explorer)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('a9caa603-9dfe-48ab-99e3-8743160986e1', 'near-shoemaker-explorer', 'Sonde NEAR Shoemaker sur Éros (Explorateur)', 'EXPLORER'::"QuizLevel", NULL, NULL, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('8107eea2-447f-4ae2-88a9-6b5f5036ccdc', 'a9caa603-9dfe-48ab-99e3-8743160986e1', 'Sur quel objet spatial la sonde NEAR Shoemaker a-t-elle réussi à tourner en orbite puis à se poser ?', 'NEAR Shoemaker est devenue la première sonde spatiale à orbiter autour d''un astéroïde (433 Éros) et à s''y poser.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2825fa01-1e04-4a7f-8519-220053289857', '8107eea2-447f-4ae2-88a9-6b5f5036ccdc', 'L''astéroïde Éros', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0bcd92d3-fda6-4200-af1c-1ae198f70ffb', '8107eea2-447f-4ae2-88a9-6b5f5036ccdc', 'La planète Vénus', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a573c45d-1dfe-4285-9471-da60dbb39152', '8107eea2-447f-4ae2-88a9-6b5f5036ccdc', 'La lune Titan', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('71b42ac5-5c27-4465-a6ac-23b9cdf350fc', '8107eea2-447f-4ae2-88a9-6b5f5036ccdc', 'La comète de Halley', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('8fe199c1-8a19-4d7a-af80-74fc5064b4af', 'a9caa603-9dfe-48ab-99e3-8743160986e1', 'Vrai ou faux : La sonde NEAR Shoemaker repose toujours aujourd''hui à la surface de l''astéroïde Éros.', 'NEAR Shoemaker s''est posée sur Éros en février 2001 et y demeure depuis comme un vestige silencieux.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('866ef7a6-ee4d-4a2f-9380-8a75b4d7fabd', '8fe199c1-8a19-4d7a-af80-74fc5064b4af', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('acf437fd-adce-47d6-8b35-125b14b5d56d', '8fe199c1-8a19-4d7a-af80-74fc5064b4af', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('4f0b76e3-7ce2-4fbe-86c8-6b7a6673a474', 'a9caa603-9dfe-48ab-99e3-8743160986e1', 'À quel aliment compare-t-on souvent la forme allongée de l''astéroïde 433 Éros ?', 'Avec ses 34 km de long, Éros présente une silhouette allongée et incurvée semblable à une cacahuète ou une pomme de terre.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c2c56351-95bb-41bd-8026-becdc07b7052', '4f0b76e3-7ce2-4fbe-86c8-6b7a6673a474', 'Une cacahuète ou une pomme de terre', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('64f09568-dd38-4ea3-9584-7e2a6e1b1f78', '4f0b76e3-7ce2-4fbe-86c8-6b7a6673a474', 'Une orange bien ronde', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('27b80c42-31dc-439a-9585-afdc5b5baa8e', '4f0b76e3-7ce2-4fbe-86c8-6b7a6673a474', 'Une part de pizza triangulaire', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('116b99b7-1945-4f5f-8fe1-9e45fb64a944', '4f0b76e3-7ce2-4fbe-86c8-6b7a6673a474', 'Un bretzel', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('331e6033-f505-4ff1-97eb-b9c25c2fe666', 'a9caa603-9dfe-48ab-99e3-8743160986e1', 'Quelles grandes premières spatiales NEAR Shoemaker a-t-elle accomplies ? (Plusieurs bonnes réponses)', 'NEAR Shoemaker a été la première sonde à orbiter autour d''un astéroïde, à en cartographier la surface en détail et à s''y poser.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0303f806-4950-48d8-9184-a49796c67807', '331e6033-f505-4ff1-97eb-b9c25c2fe666', 'Premier vaisseau à tourner en orbite autour d''un astéroïde ET Premier vaisseau à atterrir à la surface d''un astéroïde ET Premier vaisseau à photographier un astéroïde géocroiseur de près', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f3bcbcb5-ca6c-4343-a291-36528a9fb71c', '331e6033-f505-4ff1-97eb-b9c25c2fe666', 'Premier vaisseau à poser des astronautes sur Mars ET Premier vaisseau à traverser les anneaux de Saturne', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c1cd09e4-5548-45b4-b63d-641d1bf91a71', '331e6033-f505-4ff1-97eb-b9c25c2fe666', 'Premier vaisseau à tourner en orbite autour d''un astéroïde', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('15290928-f143-43fc-a734-978316855edf', 'a9caa603-9dfe-48ab-99e3-8743160986e1', 'En l''honneur de quel célèbre géologue et planétologue la sonde NEAR a-t-elle été rebaptisée « NEAR Shoemaker » ?', 'La sonde NEAR (Near Earth Asteroid Rendezvous) a été renommée NEAR Shoemaker en hommage au géologue Eugene Shoemaker.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4bca8c0f-814a-4193-9609-3002d526c71b', '15290928-f143-43fc-a734-978316855edf', 'Eugene Shoemaker', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('be733ebe-5fa2-4ce9-9bae-63722f59c25a', '15290928-f143-43fc-a734-978316855edf', 'Galilée', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5f7aa7a3-6a11-45b2-95fc-e93f23275ac2', '15290928-f143-43fc-a734-978316855edf', 'Isaac Newton', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('11043b64-9a9d-4902-af09-79a7eb293bf3', '15290928-f143-43fc-a734-978316855edf', 'Thomas Pesquet', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('925e8be6-edae-478f-8cbf-ff5535e4bf56', 'a9caa603-9dfe-48ab-99e3-8743160986e1', 'Relie chaque élément de la mission NEAR Shoemaker à sa description.', 'NEAR Shoemaker a survolé 253 Mathilde en route vers sa cible principale, l''astéroïde 433 Éros.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('88079af8-ee0e-496d-8327-c8126fc8624e', '925e8be6-edae-478f-8cbf-ff5535e4bf56', '433 Éros = Astéroïde autour duquel la sonde s''est mise en orbite et posée | 253 Mathilde = Astéroïde survolé en chemin en juin 1997 | NEAR Shoemaker = Première sonde à atterrir sur un astéroïde', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('03145895-9b2f-470f-a14a-17463b6b0762', '925e8be6-edae-478f-8cbf-ff5535e4bf56', '433 Éros = Astéroïde survolé en chemin en juin 1997 | 253 Mathilde = Première sonde à atterrir sur un astéroïde | NEAR Shoemaker = Astéroïde autour duquel la sonde s''est mise en orbite et posée', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('5e5fbd42-ce23-43e4-9dd6-3903212d31bf', 'a9caa603-9dfe-48ab-99e3-8743160986e1', 'En quelle année la sonde NEAR Shoemaker s''est-elle posée sur l''astéroïde Éros ?', 'Le 12 février 2001, après un an en orbite, NEAR Shoemaker a effectué un atterrissage contrôlé sur 433 Éros.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d885211e-7af4-49d5-aca6-22c9318f6953', '5e5fbd42-ce23-43e4-9dd6-3903212d31bf', '2001', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1389dd97-9cf1-4f78-8abc-a79e68c7c2c0', '5e5fbd42-ce23-43e4-9dd6-3903212d31bf', '1969', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f1940fa9-24ef-454d-94ce-55626a4b17b5', '5e5fbd42-ce23-43e4-9dd6-3903212d31bf', '1985', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f762e04c-c7f5-4012-8f04-04bd8e00949f', '5e5fbd42-ce23-43e4-9dd6-3903212d31bf', '2024', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9d786067-532c-45ab-9c19-a1db71318871', 'a9caa603-9dfe-48ab-99e3-8743160986e1', 'Quel numéro officiel porte l''astéroïde Éros exploré par NEAR Shoemaker ?', 'Éros est le 433e astéroïde découvert, d''où sa désignation officielle 433 Éros.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0511d65d-8c65-418d-8339-10d5a1342224', '9d786067-532c-45ab-9c19-a1db71318871', '433 numéro', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1082cf70-341c-4d94-905c-abecf784877c', '9d786067-532c-45ab-9c19-a1db71318871', '650 numéro', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c82f2c4d-8279-4d3e-b1c7-468dbd8c3e3e', '9d786067-532c-45ab-9c19-a1db71318871', '217 numéro', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b51e4878-7df0-4900-b683-ee35a20a9f35', '9d786067-532c-45ab-9c19-a1db71318871', '443 numéro', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('85c24764-f65a-48cb-a5fa-3b75df6a42f2', 'a9caa603-9dfe-48ab-99e3-8743160986e1', 'Que voit-on à la surface de l''astéroïde Éros sur les photos prises par NEAR Shoemaker ? (Plusieurs bonnes réponses)', 'Les clichés de NEAR Shoemaker révèlent une surface criblée de cratères, jonchée de rochers et recouverte de poussière.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('80d55a66-a73e-401b-935f-e3c8eb5411c8', '85c24764-f65a-48cb-a5fa-3b75df6a42f2', 'De nombreux cratères d''impact ET Des milliers de rochers et blocs de pierre ET Une couche de poussière grise appelée régolithe', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('beae0679-810e-4e9b-8d0a-fb8ba22f4d07', '85c24764-f65a-48cb-a5fa-3b75df6a42f2', 'Des arbres et des rivières ET Des nuages de pluie', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4b7f0279-8d2a-4ad2-9c36-81ca8db29a04', '85c24764-f65a-48cb-a5fa-3b75df6a42f2', 'De nombreux cratères d''impact', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('3ec4a01b-39a1-4907-a922-89c46ec505c1', 'a9caa603-9dfe-48ab-99e3-8743160986e1', 'Comment la sonde NEAR Shoemaker produisait-elle son électricité dans l''espace ?', 'NEAR Shoemaker utilisait quatre panneaux solaires fixés autour de son corps octogonal.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('86795150-746e-4629-952d-69d652037ee1', '3ec4a01b-39a1-4907-a922-89c46ec505c1', 'Avec quatre grands panneaux solaires', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9c029450-8bea-4098-8d3b-345cad1ce84c', '3ec4a01b-39a1-4907-a922-89c46ec505c1', 'En brûlant du charbon', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('282b301a-9304-44a2-9b32-fa164af6697c', '3ec4a01b-39a1-4907-a922-89c46ec505c1', 'Avec une éolienne', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4969fe0d-8b49-4a38-b51f-8f2d2222d94f', '3ec4a01b-39a1-4907-a922-89c46ec505c1', 'Grâce à un câble branché sur la Terre', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('b07b7e65-4a17-4159-9557-a8677b436854', 'a9caa603-9dfe-48ab-99e3-8743160986e1', 'Remets dans l''ordre les étapes de la mission NEAR Shoemaker.', 'Lancée en 1996, NEAR a survolé Mathilde en 1997, orbité autour d''Éros dès février 2000 et s''y est posée en février 2001.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('20212db2-29da-44a9-b982-9670493db49b', 'b07b7e65-4a17-4159-9557-a8677b436854', '1. Lancement depuis la Terre (février 1996) ➔ 2. Survol de l''astéroïde Mathilde (juin 1997) ➔ 3. Mise en orbite autour d''Éros (février 2000) ➔ 4. Atterrissage en douceur sur Éros (février 2001)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d3c3f4d0-459c-4dd8-9730-f421b19127b2', 'b07b7e65-4a17-4159-9557-a8677b436854', '1. Atterrissage en douceur sur Éros (février 2001) ➔ 2. Mise en orbite autour d''Éros (février 2000) ➔ 3. Survol de l''astéroïde Mathilde (juin 1997) ➔ 4. Lancement depuis la Terre (février 1996)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e5bc55bc-a7a8-4717-9833-2e0ec9429f96', 'b07b7e65-4a17-4159-9557-a8677b436854', '1. Survol de l''astéroïde Mathilde (juin 1997) ➔ 2. Lancement depuis la Terre (février 1996) ➔ 3. Mise en orbite autour d''Éros (février 2000) ➔ 4. Atterrissage en douceur sur Éros (février 2001)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('637a9472-d2b8-4855-8364-a71ce395edb2', 'a9caa603-9dfe-48ab-99e3-8743160986e1', 'Vrai ou faux : Au départ, NEAR Shoemaker n''avait pas de pieds d''atterrissage car elle n''était pas prévue pour se poser sur Éros.', 'NEAR n''était conçue que pour rester en orbite, mais les ingénieurs ont réussi à la poser en douceur sur ses panneaux solaires et son bord inférieur.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5e9b66b5-1b2f-4ca3-a7dd-46b017824921', '637a9472-d2b8-4855-8364-a71ce395edb2', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a3f4beae-1e91-4e65-87a6-a07dbe83e6a0', '637a9472-d2b8-4855-8364-a71ce395edb2', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('4804dbb7-ed37-4723-bcc2-68eff3916ee2', 'a9caa603-9dfe-48ab-99e3-8743160986e1', 'Si tu sautais sur l''astéroïde Éros, que se passerait-il par rapport à la Terre ?', 'La gravité sur Éros est environ mille fois plus faible que sur Terre, ce qui a permis à la sonde de s''y poser très lentement.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0aa4cb0d-151a-47ea-971d-4475c5159a71', '4804dbb7-ed37-4723-bcc2-68eff3916ee2', 'Tu t''envolerais très haut et très lentement car la gravité y est minuscule', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2ce27e58-d552-4b54-a6de-8f771e9d4310', '4804dbb7-ed37-4723-bcc2-68eff3916ee2', 'Tu resterais collé au sol comme par un aimant géant', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ed8d6d9f-53c6-490c-88cb-a82326c9e52d', '4804dbb7-ed37-4723-bcc2-68eff3916ee2', 'Tu pèserais dix fois plus lourd que sur Terre', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('97664f56-f498-47c8-8f46-d78602d56806', '4804dbb7-ed37-4723-bcc2-68eff3916ee2', 'Tu tomberais deux fois plus vite', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('cf95c245-d97c-41d0-a7a7-b3a82cc39fd1', 'a9caa603-9dfe-48ab-99e3-8743160986e1', 'Quelles informations NEAR Shoemaker a-t-elle mesurées sur l''astéroïde Éros ? (Plusieurs bonnes réponses)', 'NEAR Shoemaker a cartographié la forme d''Éros, analysé la composition de sa surface et mesuré sa gravité et son magnétisme.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('601056e4-87b5-49b3-9a71-669379993cc4', 'cf95c245-d97c-41d0-a7a7-b3a82cc39fd1', 'Sa forme et sa taille précises ET Les éléments chimiques présents dans ses roches ET Son champ magnétique et sa gravité', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('77a6fe69-699b-4b69-bc68-a353db5de65b', 'cf95c245-d97c-41d0-a7a7-b3a82cc39fd1', 'La température de ses océans ET La vitesse de ses ouragans', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('594a2ba3-2f35-495a-9902-fff5dc03c7ca', 'cf95c245-d97c-41d0-a7a7-b3a82cc39fd1', 'Sa forme et sa taille précises', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('ebcf7d2a-eb19-452f-972f-3afa0dc97ced', 'a9caa603-9dfe-48ab-99e3-8743160986e1', 'Pourquoi appelle-t-on Éros un astéroïde « géocroiseur » ?', 'Un astéroïde géocroiseur (Near-Earth Asteroid) suit une orbite qui s''approche de l''orbite terrestre.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f7d923be-3262-48fa-bf48-21369dea4cda', 'ebcf7d2a-eb19-452f-972f-3afa0dc97ced', 'Parce que son orbite l''amène relativement près de celle de la Terre', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('913d2c41-a3e1-424a-a183-7b0ec7384771', 'ebcf7d2a-eb19-452f-972f-3afa0dc97ced', 'Parce qu''il a la même taille que la Terre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4e43c194-7eda-431c-9827-0931041353a7', 'ebcf7d2a-eb19-452f-972f-3afa0dc97ced', 'Parce qu''il tourne autour de la Terre comme la Lune', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b06ccab9-ed18-481d-a328-de9979312b8a', 'ebcf7d2a-eb19-452f-972f-3afa0dc97ced', 'Parce qu''il est recouvert d''herbe', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Sonde NEAR Shoemaker sur Éros (Expert) (near-shoemaker-expert)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('3a028282-ff98-4d44-8eb8-ca0c8071836f', 'near-shoemaker-expert', 'Sonde NEAR Shoemaker sur Éros (Expert)', 'EXPERT'::"QuizLevel", NULL, NULL, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a1eaeb87-7eb0-42db-a74b-c569f42e0307', '3a028282-ff98-4d44-8eb8-ca0c8071836f', 'Quelle a été la cause technique de la perte de contact et de l''échec initial d''insertion orbitale de NEAR autour d''Éros le 20 décembre 1998 ?', 'Une accélération transitoire lors de l''allumage a dépassé le seuil logiciel de sécurité, coupant le moteur et entraînant une perte d''attitude et de liaison pendant 27 heures.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7ef13862-994f-44ec-b81b-59c1f26965bf', 'a1eaeb87-7eb0-42db-a74b-c569f42e0307', 'L''allumage du moteur principal à biergol a déclenché un dépassement du seuil d''accélération latérale programmé, provoquant l''arrêt immédiat de la poussée et une mise en sécurité avec désorientation des panneaux solaires', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d7c0fc36-17c7-411f-b9ac-b18056674e36', 'a1eaeb87-7eb0-42db-a74b-c569f42e0307', 'Une collision directe avec un satellite naturel d''Éros a détruit le réservoir d''hydrazine', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2c0f8179-8a57-4516-8c58-76e7821673bb', 'a1eaeb87-7eb0-42db-a74b-c569f42e0307', 'Le calculateur de bord a été effacé par une éruption solaire de classe X', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6bf0cea0-996e-40c4-b28f-f1dbfc62be02', 'a1eaeb87-7eb0-42db-a74b-c569f42e0307', 'La sonde a épuisé tout son carburant lors du survol de Mathilde', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('cfab844b-e26a-41b0-8dd9-2cd90b6ea9b7', '3a028282-ff98-4d44-8eb8-ca0c8071836f', 'À quelle altitude approximative au-dessus du sol d''Éros, en mètres, la caméra MSI de NEAR Shoemaker a-t-elle pris sa toute dernière image avant le contact final le 12 février 2001 ?', 'La dernière image transmise lors de la descente contrôlée a été prise à environ 120 mètres d''altitude, révélant des détails de l''ordre du centimètre.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fab7d617-8cab-4a37-867a-5e3fd8f7fc1c', 'cfab844b-e26a-41b0-8dd9-2cd90b6ea9b7', '120 mètres', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b87e05d4-dfeb-4770-97d1-3eb622262793', 'cfab844b-e26a-41b0-8dd9-2cd90b6ea9b7', '180 mètres', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6c7ca057-50ba-4221-b610-7380512bccf8', 'cfab844b-e26a-41b0-8dd9-2cd90b6ea9b7', '60 mètres', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3d641045-b2c8-4128-a170-cb4270abf043', 'cfab844b-e26a-41b0-8dd9-2cd90b6ea9b7', '130 mètres', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('3798965c-ebc0-4be3-9b9f-be5244ec0a3b', '3a028282-ff98-4d44-8eb8-ca0c8071836f', 'Pourquoi l''extension de mission de NEAR Shoemaker au sol d''Éros entre le 12 et le 28 février 2001 a-t-elle eu une valeur scientifique exceptionnelle ? (Plusieurs bonnes réponses)', 'Une fois posé, le détecteur gamma de NEAR s''est trouvé à quelques centimètres du sol, améliorant considérablement le rapport signal/bruit pour l''analyse élémentaire.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0ae633d5-8c12-4674-a20b-9b2447eed186', '3798965c-ebc0-4be3-9b9f-be5244ec0a3b', 'Le spectromètre à rayons gamma (GRS) placé au contact direct du régolithe a gagné d''un facteur ~10 en sensibilité par rapport aux mesures orbitales ET Il a permis de mesurer directement les abondances d''éléments majeurs (Fe, Si, O, Mg, K) dans le régolithe d''Éros ET Il a démontré la capacité à opérer et commander un vaisseau non conçu pour l''atterrissage à la surface d''un petit corps', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('04c2d6d3-4aed-4172-b927-5c281544b332', '3798965c-ebc0-4be3-9b9f-be5244ec0a3b', 'Il a permis de forer une carotte de 10 mètres de profondeur dans le noyau d''Éros ET Il a redécollé d''Éros pour rapporter un échantillon sur Terre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('599f1c78-b88f-4881-a72d-03b1ca93a848', '3798965c-ebc0-4be3-9b9f-be5244ec0a3b', 'Le spectromètre à rayons gamma (GRS) placé au contact direct du régolithe a gagné d''un facteur ~10 en sensibilité par rapport aux mesures orbitales', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('37bfb113-c346-42cf-b07d-67f5f90d4f1a', '3a028282-ff98-4d44-8eb8-ca0c8071836f', 'Quel défi majeur la mécanique orbitale autour de 433 Éros posait-elle aux navigateurs de NEAR Shoemaker ?', 'Autour d''un corps allongé en rotation rapide avec une vitesse de libération de ~10 m/s, les harmoniques gravitationnels déstabilisent rapidement les orbites basses.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e911b6ef-ab20-47b4-9c67-840226c2093d', '37bfb113-c346-42cf-b07d-67f5f90d4f1a', 'Le champ gravitationnel fortement non sphérique et la rotation rapide d''Éros (période de 5,27 h) induisent de fortes perturbations orbitales risquant d''éjecter la sonde ou de la faire impacter la surface', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c13964cc-e194-4ae1-ba97-1b258a1586e7', '37bfb113-c346-42cf-b07d-67f5f90d4f1a', 'La traînée atmosphérique dense d''Éros freinait la sonde à chaque orbite', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e371f7ca-2a35-4aae-82f8-f5ea006e13b8', '37bfb113-c346-42cf-b07d-67f5f90d4f1a', 'La pression de radiation d''Éros repoussait la sonde à plus de 10 000 km', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b19a765f-9f57-40e9-8098-dc71da6e257b', '37bfb113-c346-42cf-b07d-67f5f90d4f1a', 'Le champ magnétique d''Éros inversait la polarité des panneaux solaires', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('6a190e28-5f78-4243-9867-2068cfdb950b', '3a028282-ff98-4d44-8eb8-ca0c8071836f', 'Vrai ou faux : Les spectromètres XGRS de NEAR Shoemaker ont mis en évidence un appauvrissement marqué en soufre à la surface d''Éros par rapport aux chondrites ordinaires, attribué au vieillissement spatial (space weathering) et aux micrométéorites.', 'L''analyse XGRS a montré que les rapports Mg/Si, Fe/Si et Al/Si correspondent aux chondrites ordinaires, mais que le soufre est nettement appauvri en surface.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8d51b9f2-0a52-4ea0-986f-58693b7b8430', '6a190e28-5f78-4243-9867-2068cfdb950b', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('41c8da18-1541-4f3b-8441-e3a4471fa1e7', '6a190e28-5f78-4243-9867-2068cfdb950b', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9581719f-74f2-4bfa-a179-09f1595844fb', '3a028282-ff98-4d44-8eb8-ca0c8071836f', 'Relie chaque paramètre physique de 433 Éros mesuré par NEAR Shoemaker à sa valeur caractéristique.', 'La cartographie laser NLR et le suivi Doppler ont établi avec précision les dimensions, la densité, la rotation et le champ gravitationnel d''Éros.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a9580e0c-b1f2-419a-8874-6c1a7499d27a', '9581719f-74f2-4bfa-a179-09f1595844fb', 'Dimensions triaxiales = Environ 34,4 × 11,2 × 11,2 km | Densité moyenne = Environ 2,67 g/cm³ | Période de rotation sidérale = 5,27 heures | Gravité de surface = Environ un millième de la gravité terrestre', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('70dea67f-482b-4d7c-9727-452260aad818', '9581719f-74f2-4bfa-a179-09f1595844fb', 'Dimensions triaxiales = Environ 2,67 g/cm³ | Densité moyenne = 5,27 heures | Période de rotation sidérale = Environ un millième de la gravité terrestre | Gravité de surface = Environ 34,4 × 11,2 × 11,2 km', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c259d57c-5580-4f6c-baa7-bcb19b920a7f', '3a028282-ff98-4d44-8eb8-ca0c8071836f', 'Quel mécanisme physique a été proposé pour expliquer la formation des « dust ponds » (dépôts plats de poussière fine) observés par NEAR au fond de nombreux cratères d''Éros ?', 'Les gradients électrostatiques induits par la photoémission UV mobilisent les grains submicroniques de régolithe qui s''accumulent ensuite au fond des cratères.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f752b0b5-9589-4058-ae07-2242928128c2', 'c259d57c-5580-4f6c-baa7-bcb19b920a7f', 'La lévitation et le transport électrostatique des grains de poussière les plus fins chargés par le rayonnement solaire UV et le vent solaire, suivis de leur piégeage dans les dépressions ombragées', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d9badb26-c566-4878-bc93-f324e43e8179', 'c259d57c-5580-4f6c-baa7-bcb19b920a7f', 'L''écoulement de rivières d''eau liquide lors du passage d''Éros au périhélie', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('01ba5d7b-2f62-4bc2-9b47-01453201d705', 'c259d57c-5580-4f6c-baa7-bcb19b920a7f', 'Le dépôt de cendres issues d''un volcanisme actif au pôle Sud d''Éros', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('eca6375c-7dae-4f5e-a88b-f32e1720aeb8', 'c259d57c-5580-4f6c-baa7-bcb19b920a7f', 'Le triage éolien par des tempêtes de poussière atmosphériques', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c3b4ec9a-fac1-4bb6-a000-d96a2fc45b01', '3a028282-ff98-4d44-8eb8-ca0c8071836f', 'Comment la géométrie de contact de NEAR Shoemaker lors de son atterrissage sur Éros a-t-elle été conçue par les ingénieurs du JHUAPL ?', 'La sonde s''est immobilisée en appui sur le bord de son châssis et deux panneaux solaires, maintenant une production électrique suffisante pour communiquer via l''antenne faible gain.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8884a983-37bf-4b90-bb4a-f4391ee713ac', 'c3b4ec9a-fac1-4bb6-a000-d96a2fc45b01', 'La sonde s''est posée sur les extrémités de deux de ses panneaux solaires et sur le bord inférieur du corps principal, formant un trépied stable sous très faible gravité', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d20edca1-9a38-496b-a582-ce7f5b5f017c', 'c3b4ec9a-fac1-4bb6-a000-d96a2fc45b01', 'Elle a déployé quatre jambes télescopiques équipées de harpons pyrotechniques', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c0001b8c-8d5e-4fa5-bb24-2acf0d94b658', 'c3b4ec9a-fac1-4bb6-a000-d96a2fc45b01', 'Elle a gonflé un coussin d''air sphérique autour de l''antenne à gain élevé', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('bf232fca-fca0-44bd-8e3e-e0d2e9bea8a6', 'c3b4ec9a-fac1-4bb6-a000-d96a2fc45b01', 'Elle s''est plantée verticalement par le cône de la tuyère du moteur principal', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('63373b09-c0e6-409a-b046-b0527ee725f3', '3a028282-ff98-4d44-8eb8-ca0c8071836f', 'Quelles caractéristiques matérielles définissaient la sonde NEAR Shoemaker ? (Plusieurs bonnes réponses)', 'NEAR Shoemaker combinait un châssis octogonal simple, une antenne fixe de 1,5 m et quatre panneaux solaires fixes, sans mécanismes de pointage complexes.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('935c6333-d068-4de9-89f5-476ddc8b2bae', '63373b09-c0e6-409a-b046-b0527ee725f3', 'Un corps principal en prisme octogonal d''environ 1,7 m de côté ET Une antenne parabolique fixe à gain élevé de 1,5 m de diamètre monté sur le pont supérieur ET Quatre panneaux solaires fixes en arséniure de gallium', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d109f29b-72ae-4778-a9c9-c145a116ac76', '63373b09-c0e6-409a-b046-b0527ee725f3', 'Un générateur nucléaire RTG au plutonium-238 ET Un bras robotique articulé de 3 mètres avec foreuse', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a2029932-fab7-483e-a1af-f67392fc5f3c', '63373b09-c0e6-409a-b046-b0527ee725f3', 'Un corps principal en prisme octogonal d''environ 1,7 m de côté', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c87c47a8-2b83-4b99-a73c-b3a72c076178', '3a028282-ff98-4d44-8eb8-ca0c8071836f', 'Quelle anomalie statistique surprenante la cartographie haute résolution d''Éros par NEAR a-t-elle révélée concernant la population de cratères ?', 'La secousse sismique globale générée par des impacts ultérieurs fait glisser le régolithe et efface les petits cratères (< 100 m) à la surface d''Éros.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('02ec9cc5-7c38-4093-a222-82533987a1d8', 'c87c47a8-2b83-4b99-a73c-b3a72c076178', 'Un déficit marqué en petits cratères de diamètre inférieur à 100 mètres, causé par l''effacement sismique global dû aux impacts ultérieurs sur ce petit corps', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('386c1f90-6599-4fa8-8e3c-c4fb85be15ce', 'c87c47a8-2b83-4b99-a73c-b3a72c076178', 'Une absence totale de cratères de plus de 500 mètres de diamètre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('23e0ebbd-9b84-4f1a-853f-639dee6f0fad', 'c87c47a8-2b83-4b99-a73c-b3a72c076178', 'Une répartition strictement concentrée sur un seul hémisphère', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('024ce873-b47c-4d85-b7d3-4403e285649b', 'c87c47a8-2b83-4b99-a73c-b3a72c076178', 'La présence de cratères parfaitement carrés', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('70d2c388-23f5-4df8-b3b3-25463ac7511f', '3a028282-ff98-4d44-8eb8-ca0c8071836f', 'Classe dans l''ordre chronologique ces étapes majeures de la mission NEAR Shoemaker.', 'Après le lancement (1996) et le survol de Mathilde (1997), NEAR a utilisé la Terre pour changer d''inclinaison orbitale en 1998 avant d''atteindre Éros en 2000 et d''y atterrir en 2001.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('eba36c82-e04e-49e1-9465-e01f3892ffb6', '70d2c388-23f5-4df8-b3b3-25463ac7511f', '1. Lancement par une fusée Delta II (février 1996) ➔ 2. Survol de l''astéroïde 253 Mathilde (juin 1997) ➔ 3. Survol d''assistance gravitationnelle terrestre (janvier 1998) ➔ 4. Insertion en orbite autour de 433 Éros (février 2000) ➔ 5. Atterrissage contrôlé sur 433 Éros (février 2001)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1ef33dda-2842-49df-9e50-9d20adc674eb', '70d2c388-23f5-4df8-b3b3-25463ac7511f', '1. Atterrissage contrôlé sur 433 Éros (février 2001) ➔ 2. Insertion en orbite autour de 433 Éros (février 2000) ➔ 3. Survol d''assistance gravitationnelle terrestre (janvier 1998) ➔ 4. Survol de l''astéroïde 253 Mathilde (juin 1997) ➔ 5. Lancement par une fusée Delta II (février 1996)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('715b3a12-4a0f-411b-aaa1-8df270d52385', '70d2c388-23f5-4df8-b3b3-25463ac7511f', '1. Survol de l''astéroïde 253 Mathilde (juin 1997) ➔ 2. Lancement par une fusée Delta II (février 1996) ➔ 3. Survol d''assistance gravitationnelle terrestre (janvier 1998) ➔ 4. Insertion en orbite autour de 433 Éros (février 2000) ➔ 5. Atterrissage contrôlé sur 433 Éros (février 2001)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('ce40e344-b6c9-41ab-8a35-6f8648f8fce4', '3a028282-ff98-4d44-8eb8-ca0c8071836f', 'Vrai ou faux : Le magnétomètre de NEAR Shoemaker a détecté un champ magnétique intrinsèque puissant autour d''Éros, comparable à celui de la Terre.', 'NEAR Shoemaker n''a détecté aucune magnétisation rémanente significative sur Éros, fixant une limite supérieure très basse à son moment magnétique.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b9933042-7b7a-4061-a350-30830ea1a481', 'ce40e344-b6c9-41ab-8a35-6f8648f8fce4', 'Vrai', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0ce69ac4-b46e-46fa-b973-0f1719f10678', 'ce40e344-b6c9-41ab-8a35-6f8648f8fce4', 'Faux', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('52c0c386-9295-49e6-b348-e16510fcb301', '3a028282-ff98-4d44-8eb8-ca0c8071836f', 'Comment les contrôleurs au sol ont-ils communiqué avec NEAR Shoemaker après son atterrissage sur Éros alors que son antenne principale à gain élevé ne pointait plus vers la Terre ?', 'Grâce aux antennes de 70 m du DSN captant le signal de l''antenne à faible gain, la NASA a même pu commander une prolongation de mission de 14 jours au sol.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('61a22bfe-b828-4fa7-b865-ac6ffa088f44', '52c0c386-9295-49e6-b348-e16510fcb301', 'En utilisant l''antenne omnidirectionnelle à faible gain et les grandes antennes de 70 mètres du Deep Space Network pour envoyer des commandes et recevoir la télémétrie du spectromètre gamma', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7375fb31-bba4-4be8-a1f5-aec8cc8befec', '52c0c386-9295-49e6-b348-e16510fcb301', 'En faisant rebondir le signal radio sur la surface de la Lune', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7ea2980a-4632-4be1-9d91-f2e0017084bb', '52c0c386-9295-49e6-b348-e16510fcb301', 'En utilisant la sonde Mars Global Surveyor comme relais', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('541c600b-b668-45e4-88ba-da0f5ef635fe', '52c0c386-9295-49e6-b348-e16510fcb301', 'Aucune communication n''a eu lieu après le contact avec le sol', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('69274dd9-af51-4c93-a603-edf8dbf89306', '3a028282-ff98-4d44-8eb8-ca0c8071836f', 'Quels résultats scientifiques ont été obtenus durant l''année passée en orbite autour d''Éros (février 2000 - février 2001) ? (Plusieurs bonnes réponses)', 'NEAR a combiné altimétrie laser, imagerie multispectrale, spectrométrie X/gamma et gravimétrie pour caractériser entièrement 433 Éros.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0b77f38a-14f8-4e8b-8696-8b9c08b7d364', '69274dd9-af51-4c93-a603-edf8dbf89306', 'Acquisition de plus de 11 millions de mesures altimétriques laser (NLR) produisant un modèle topographique global précis ET Couverture photographique quasi complète à des résolutions atteignant quelques mètres par pixel ET Détermination précise de la masse d''Éros (environ 6,69 × 10¹⁵ kg) par suivi radiométrique', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c39d806f-7e2d-44a5-a3b4-6d167d687039', '69274dd9-af51-4c93-a603-edf8dbf89306', 'Découverte de deux satellites naturels en orbite autour d''Éros ET Observation d''une activité cométaire avec queue de gaz et de poussière', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8420ea0c-9004-451e-999b-cbdee20d4a42', '69274dd9-af51-4c93-a603-edf8dbf89306', 'Acquisition de plus de 11 millions de mesures altimétriques laser (NLR) produisant un modèle topographique global précis', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('77249dca-fb3f-43ec-8a77-c71282b035d4', '3a028282-ff98-4d44-8eb8-ca0c8071836f', 'Pourquoi les communications avec NEAR Shoemaker ont-elles définitivement cessé après le 28 février 2001 ?', 'Avec la baisse de l''éclairement solaire au sol et des températures descendant vers -150 °C, la mission a pris fin le 28 février 2001, laissant NEAR Shoemaker reposer sur Éros.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5786d762-7f95-46b9-9494-67353eea418c', '77249dca-fb3f-43ec-8a77-c71282b035d4', 'L''éloignement d''Éros par rapport au Soleil et l''inclinaison défavorable des panneaux solaires au sol ont plongé la sonde dans le froid extrême et privé ses systèmes d''énergie', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3009afb7-025d-489a-bf0f-85ccb762ca48', '77249dca-fb3f-43ec-8a77-c71282b035d4', 'Une fusée de destruction a été déclenchée pour éviter de contaminer Éros', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5bcc8e4f-26bc-4551-90a7-f9f2d773566b', '77249dca-fb3f-43ec-8a77-c71282b035d4', 'Un astéroïde de 10 km a pulvérisé Éros', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e73e67d5-d5f9-44d9-a756-7cb468421c55', '77249dca-fb3f-43ec-8a77-c71282b035d4', 'La sonde a redécollé vers Vesta', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Sondes Pionnières Pioneer 10 & 11 (Explorateur) (pioneer-10-11-explorer)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('844e17c2-520a-4c30-ae84-e5b682829cab', 'pioneer-10-11-explorer', 'Sondes Pionnières Pioneer 10 & 11 (Explorateur)', 'EXPLORER'::"QuizLevel", NULL, NULL, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('410e1a0f-ae3d-40be-9a79-f3cab13bc9ae', '844e17c2-520a-4c30-ae84-e5b682829cab', 'Où se trouvent aujourd''hui les sondes spatiales Pioneer 10 et Pioneer 11 ?', 'Pioneer 10 et 11 ont quitté le système solaire et dérivent silencieusement dans l''espace profond.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('95f06bfd-5526-4938-912c-28a0493d51bb', '410e1a0f-ae3d-40be-9a79-f3cab13bc9ae', 'Elles dérivent silencieusement hors du système solaire', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('49620334-805e-4de9-80da-63e337eaf67e', '410e1a0f-ae3d-40be-9a79-f3cab13bc9ae', 'Elles sont posées sur la Lune', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ace38f7a-7859-45a4-ac9b-febea3525feb', '410e1a0f-ae3d-40be-9a79-f3cab13bc9ae', 'Elles tournent autour de Mars', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1359376a-26ff-4b43-a8ff-4cb2c942245c', '410e1a0f-ae3d-40be-9a79-f3cab13bc9ae', 'Elles sont revenues sur Terre', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('3c0dd081-5eb5-4e12-9c57-b244d415298c', '844e17c2-520a-4c30-ae84-e5b682829cab', 'Vrai ou faux : Pioneer 10 et Pioneer 11 ont été les premiers vaisseaux spatiaux à explorer les planètes géantes de notre système solaire.', 'Pioneer 10 et 11 ont ouvert la voie à l''exploration des planètes géantes Jupiter et Saturne.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('aa5ddc46-81e5-4485-bbc8-bb19725d1a5b', '3c0dd081-5eb5-4e12-9c57-b244d415298c', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c638354f-befc-44df-b092-6d7df41bd20a', '3c0dd081-5eb5-4e12-9c57-b244d415298c', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('84aa60da-18fa-46cb-82c2-a7138d0523ef', '844e17c2-520a-4c30-ae84-e5b682829cab', 'Quelle planète géante Pioneer 10 a-t-elle survolée en premier en décembre 1973 ?', 'En décembre 1973, Pioneer 10 est devenue la première sonde à survoler Jupiter et à en envoyer des images rapprochées.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a36efde8-2e0a-4b2a-81df-e3a22f2d2d58', '84aa60da-18fa-46cb-82c2-a7138d0523ef', 'Jupiter', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c76ec61a-0e8d-44b4-934e-38d0c724898c', '84aa60da-18fa-46cb-82c2-a7138d0523ef', 'Mercure', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5eec3650-8fb0-4631-947e-8d0e76bc66ea', '84aa60da-18fa-46cb-82c2-a7138d0523ef', 'Vénus', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('93e96556-68b6-4fcd-9299-fd7af1ba8d86', '84aa60da-18fa-46cb-82c2-a7138d0523ef', 'Neptune', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('3826e2ad-cf21-4fea-90bf-f728011205ed', '844e17c2-520a-4c30-ae84-e5b682829cab', 'Quelles planètes géantes ont été survolées par les sondes Pioneer 10 et 11 ? (Plusieurs bonnes réponses)', 'Pioneer 10 a survolé Jupiter en 1973, et Pioneer 11 a survolé Jupiter en 1974 puis Saturne en 1979.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('268fe92f-72f6-4cd6-a31e-919ad851e00b', '3826e2ad-cf21-4fea-90bf-f728011205ed', 'Jupiter ET Saturne', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7ad63cd6-e1a8-465b-b5e9-7b93bfd4aab5', '3826e2ad-cf21-4fea-90bf-f728011205ed', 'Mercure ET Vénus ET Pluton', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6a129f0d-90fc-431a-a741-4a26d17804d1', '3826e2ad-cf21-4fea-90bf-f728011205ed', 'Jupiter', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('efba6511-c396-48bc-a52f-a81578216ca8', '844e17c2-520a-4c30-ae84-e5b682829cab', 'Quel objet spécial est fixé sur les sondes Pioneer 10 et 11 au cas où des extraterrestres les trouveraient un jour ?', 'Les sondes Pioneer portent une plaque gravée en aluminium anodisé or représentant l''humanité et la position de la Terre.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ec053451-ca11-4356-bca4-e08f2ef89eba', 'efba6511-c396-48bc-a52f-a81578216ca8', 'Une plaque en aluminium doré avec des dessins et une carte', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('900ab2b3-e4c6-40c8-bf03-ad931089569d', 'efba6511-c396-48bc-a52f-a81578216ca8', 'Un téléphone portable', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7184bae4-e522-4bee-b19a-c0feb299c9dc', 'efba6511-c396-48bc-a52f-a81578216ca8', 'Une boîte de chocolats', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('af556188-c2d6-4c47-81cb-028c8c6150c5', 'efba6511-c396-48bc-a52f-a81578216ca8', 'Un livre d''histoire de 500 pages', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('37005dba-ef15-46c5-90dc-beb5a68950cd', '844e17c2-520a-4c30-ae84-e5b682829cab', 'Relie chaque sonde Pioneer à sa grande première spatiale.', 'Pioneer 10 a survolé Jupiter la première en 1973, Pioneer 11 a atteint Saturne en 1979, et toutes deux emportent la célèbre plaque.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cf4ac01b-2d04-474d-a7b5-6e69cf9255e9', '37005dba-ef15-46c5-90dc-beb5a68950cd', 'Pioneer 10 = Premier survol de Jupiter en 1973 | Pioneer 11 = Premier survol de Saturne en 1979 | Plaque de Pioneer = Message gravé destiné d''éventuels extraterrestres', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7b13ac07-fb64-4e16-90d4-3316bb8cb053', '37005dba-ef15-46c5-90dc-beb5a68950cd', 'Pioneer 10 = Premier survol de Saturne en 1979 | Pioneer 11 = Message gravé destiné d''éventuels extraterrestres | Plaque de Pioneer = Premier survol de Jupiter en 1973', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('0fde89ad-92ba-47f9-ab0d-1de529849730', '844e17c2-520a-4c30-ae84-e5b682829cab', 'En quelle année Pioneer 11 a-t-elle réalisé le tout premier survol rapproché de Saturne et de ses anneaux ?', 'Pioneer 11 a survolé Saturne en septembre 1979, révélant de nouveaux détails sur ses anneaux.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a7d513dd-a3f7-475c-9224-d9c4016b7f18', '0fde89ad-92ba-47f9-ab0d-1de529849730', '1979', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9081c49f-2d87-4724-b070-c43b0d9cf46f', '0fde89ad-92ba-47f9-ab0d-1de529849730', '1969', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4ca26b1e-3608-4295-b32e-62b8b43c1288', '0fde89ad-92ba-47f9-ab0d-1de529849730', '1999', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('102ceb7f-531c-4877-a90f-1921bfb8c1cc', '0fde89ad-92ba-47f9-ab0d-1de529849730', '2020', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e8906a7a-73d8-4f5c-861a-a366d6b4f768', '844e17c2-520a-4c30-ae84-e5b682829cab', 'Quel numéro porte la sonde sœur de Pioneer 10 qui a survolé Jupiter puis Saturne ?', 'Il s''agit de Pioneer 11, lancée en avril 1973 un an après Pioneer 10.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dea9363e-dcfc-465d-8d3e-38f80431d079', 'e8906a7a-73d8-4f5c-861a-a366d6b4f768', '11 numéro', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6e0c3b9b-4597-47fe-8ae1-d85c79511476', 'e8906a7a-73d8-4f5c-861a-a366d6b4f768', '17 numéro', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b81fc8c7-1f75-4927-baff-f6828212950a', 'e8906a7a-73d8-4f5c-861a-a366d6b4f768', '6 numéro', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('de19ce92-54cd-4223-9150-daafd0a0d235', 'e8906a7a-73d8-4f5c-861a-a366d6b4f768', '21 numéro', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('ecf56e68-23b4-47d1-8347-b59384267b03', '844e17c2-520a-4c30-ae84-e5b682829cab', 'Que peut-on voir dessiné sur la plaque dorée des sondes Pioneer ? (Plusieurs bonnes réponses)', 'La plaque représente un couple humain devant la silhouette de la sonde, une carte des pulsars et le schéma du système solaire.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e8e24f79-eef0-4b71-954e-a0187abaabc5', 'ecf56e68-23b4-47d1-8347-b59384267b03', 'Un homme et une femme ET Une carte montrant la position du Soleil par rapport à des étoiles ET Les planètes du système solaire avec la trajectoire de la sonde', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('31df7777-7b1f-4765-900d-f79665a7ca45', 'ecf56e68-23b4-47d1-8347-b59384267b03', 'Une photo d''un château fort ET Le drapeau d''une équipe de football', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d1402dfd-8664-4142-b229-0eba7617f83c', 'ecf56e68-23b4-47d1-8347-b59384267b03', 'Un homme et une femme', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('5b9dc9b6-7f8f-4ff3-b498-17443fb559ea', '844e17c2-520a-4c30-ae84-e5b682829cab', 'Pourquoi ne reçoit-on plus de nouvelles des sondes Pioneer 10 et 11 aujourd''hui ?', 'L''énergie de leurs générateurs ayant diminué avec le temps et la distance étant immense, le contact a été perdu en 1995 pour Pioneer 11 et en 2003 pour Pioneer 10.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2bd666a0-faf8-451c-a334-16a5a92daaf2', '5b9dc9b6-7f8f-4ff3-b498-17443fb559ea', 'Elles sont trop loin et n''ont plus assez d''énergie électrique pour émettre', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('82bca134-1ea2-4b51-a3ac-9de2b4575114', '5b9dc9b6-7f8f-4ff3-b498-17443fb559ea', 'Elles ont été détruites par un astéroïde', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('27880547-0446-4692-bfe7-0b6309e9fcc4', '5b9dc9b6-7f8f-4ff3-b498-17443fb559ea', 'Elles sont tombées dans le Soleil', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('abb316cb-78d4-4eef-8332-1db0b09dce9c', '5b9dc9b6-7f8f-4ff3-b498-17443fb559ea', 'Leurs antennes ont fondu', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('3fa8e409-cee4-4db6-a6eb-a617ff67d740', '844e17c2-520a-4c30-ae84-e5b682829cab', 'Remets dans l''ordre le voyage de la sonde Pioneer 11.', 'Lancée en 1973, Pioneer 11 a survolé Jupiter en 1974, puis Saturne en 1979 avant de poursuivre vers l''espace interstellaire.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('050b32a2-2bbb-4b14-820d-0815f3084c85', '3fa8e409-cee4-4db6-a6eb-a617ff67d740', '1. Décollage depuis la Terre (1973) ➔ 2. Survol de Jupiter (1974) ➔ 3. Survol de Saturne (1979) ➔ 4. Sortie vers l''espace interstellaire', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1b89e479-9d0c-41ca-80b0-66595826a15a', '3fa8e409-cee4-4db6-a6eb-a617ff67d740', '1. Sortie vers l''espace interstellaire ➔ 2. Survol de Saturne (1979) ➔ 3. Survol de Jupiter (1974) ➔ 4. Décollage depuis la Terre (1973)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1000d875-a918-4951-99a9-6bbe221ecc0e', '3fa8e409-cee4-4db6-a6eb-a617ff67d740', '1. Survol de Jupiter (1974) ➔ 2. Décollage depuis la Terre (1973) ➔ 3. Survol de Saturne (1979) ➔ 4. Sortie vers l''espace interstellaire', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('b69a5919-98e1-442a-869a-5e600e2e084a', '844e17c2-520a-4c30-ae84-e5b682829cab', 'Vrai ou faux : Pioneer 10 a été le tout premier vaisseau spatial à traverser la ceinture d''astéroïdes située entre Mars et Jupiter.', 'Pioneer 10 a traversé sans encombre la ceinture d''astéroïdes entre juillet 1972 et février 1973.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('26caa78a-753a-4271-bc63-29d214018aea', 'b69a5919-98e1-442a-869a-5e600e2e084a', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2f17c0ce-df89-4da7-80ff-a88a7179adfc', 'b69a5919-98e1-442a-869a-5e600e2e084a', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('7e1059fb-68ea-4d10-b3ab-bd43bf414353', '844e17c2-520a-4c30-ae84-e5b682829cab', 'Quelle grande lune de Saturne entourée d''une épaisse atmosphère a été photographiée par Pioneer 11 ?', 'Pioneer 11 a pris des images de Saturne et de sa plus grande lune, Titan.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8e9494f7-a466-4e8c-9e6b-129d70341f22', '7e1059fb-68ea-4d10-b3ab-bd43bf414353', 'Titan', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('bc72818d-71e1-4e8a-b74f-2fcd0912a812', '7e1059fb-68ea-4d10-b3ab-bd43bf414353', 'Phobos', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b3438e22-3e5d-4871-9403-79ff5fa6c2b0', '7e1059fb-68ea-4d10-b3ab-bd43bf414353', 'Io', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5cb9a74d-51ee-4b9e-a6a3-0a21f5f41717', '7e1059fb-68ea-4d10-b3ab-bd43bf414353', 'Europe', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('276c5275-116f-4178-8776-e79e96245389', '844e17c2-520a-4c30-ae84-e5b682829cab', 'À quoi ressemblent les sondes Pioneer 10 et Pioneer 11 ? (Plusieurs bonnes réponses)', 'Pioneer 10 et 11 possèdent une grande antenne parabolique de 2,74 m de diamètre et des mâts déployables.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2a6dd469-807b-40bf-98d9-46b8f02fcae9', '276c5275-116f-4178-8776-e79e96245389', 'Elles ont une grande antenne parabolique blanche ET Elles ont de longs bras portant leurs générateurs d''énergie', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ba7ee038-f171-4fdb-9ca7-407f6df68833', '276c5275-116f-4178-8776-e79e96245389', 'Elles ressemblent à une voiture à 4 roues ET Elles ont de grandes ailes d''avion ET Elles sont en forme de pyramide', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6af02276-4195-4782-ab5c-a265088d10ea', '276c5275-116f-4178-8776-e79e96245389', 'Elles ont une grande antenne parabolique blanche', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c161d2c3-bf00-488b-9397-962f0da1e5ef', '844e17c2-520a-4c30-ae84-e5b682829cab', 'Vers quelle constellation la sonde Pioneer 10 se dirige-t-elle dans l''espace lointain ?', 'Pioneer 10 se dirige vers la constellation du Taureau, où elle passera près d''Aldébaran dans environ deux millions d''années.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('80fd6e1c-8e0e-4184-946a-9611dc403573', 'c161d2c3-bf00-488b-9397-962f0da1e5ef', 'Le Taureau', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f42294cb-4570-478c-9e11-5523b5875bcc', 'c161d2c3-bf00-488b-9397-962f0da1e5ef', 'La Grande Ourse', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('71518899-e7b1-4997-a8e7-0fd0d0615858', 'c161d2c3-bf00-488b-9397-962f0da1e5ef', 'Le Lion', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e19ae43d-0930-4902-90a5-efd62c3cde81', 'c161d2c3-bf00-488b-9397-962f0da1e5ef', 'Le Scorpion', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Sondes Pionnières Pioneer 10 & 11 (Expert) (pioneer-10-11-expert)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('8496b938-8735-4cb7-a46b-5494d80b72a1', 'pioneer-10-11-expert', 'Sondes Pionnières Pioneer 10 & 11 (Expert)', 'EXPERT'::"QuizLevel", NULL, NULL, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e03a9782-80d6-4919-a994-3cf16af218c9', '8496b938-8735-4cb7-a46b-5494d80b72a1', 'Quelle explication physique rigoureuse a finalement résolu « l''anomalie Pioneer » observée sur Pioneer 10 et 11 à grande distance héliocentrique ?', 'La modélisation thermique fine a montré que le rayonnement infrarouge des RTG réfléchi par le dos de la parabole génère une force de recul photonique rendant compte de l''accélération anormale.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6d200a97-5285-467c-b290-cf6377d1745a', 'e03a9782-80d6-4919-a994-3cf16af218c9', 'Le recul photonique causé par l''émission thermique anisotrope des générateurs RTG et de l''électronique réfléchie par l''arrière de l''antenne parabolique', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('12ed9eb0-67e4-4553-bb1c-8c1f45e97441', 'e03a9782-80d6-4919-a994-3cf16af218c9', 'Une violation de la relativité générale à l''échelle du système solaire externe', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7a4aba79-dc70-4ced-a73b-fe0c393808ae', 'e03a9782-80d6-4919-a994-3cf16af218c9', 'La traînée aérodynamique exercée par la matière noire froide', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('365f8e28-34c7-4ce0-b2cd-f905eee0cd22', 'e03a9782-80d6-4919-a994-3cf16af218c9', 'Une fuite continue d''hydrazine sur le propulseur axial', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('87afd381-a0c5-4d53-b6b9-621e253e6172', '8496b938-8735-4cb7-a46b-5494d80b72a1', 'Sur la plaque des sondes Pioneer, l''échelle de distance et de temps repose sur la transition hyperfine de l''hydrogène neutre. Quelle est, en centimètres, la longueur d''onde de cette raie spectrale ?', 'La transition hyperfine de l''atome d''hydrogène neutre émet un photon d''une longueur d''onde de 21,1 cm (fréquence 1420,4 MHz).', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7e1d87a1-956c-452e-b6b4-db685b99c72f', '87afd381-a0c5-4d53-b6b9-621e253e6172', '21 cm', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3e239cc7-b64e-4843-9d64-99f8ae023229', '87afd381-a0c5-4d53-b6b9-621e253e6172', '32 cm', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a0314fe4-a6e9-4344-ab29-b9f26f6490b1', '87afd381-a0c5-4d53-b6b9-621e253e6172', '11 cm', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6d6ec43f-a5cc-4441-9708-9dc80a06ec77', '87afd381-a0c5-4d53-b6b9-621e253e6172', '31 cm', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('647379ac-f080-4e31-987f-0a4f5e222694', '8496b938-8735-4cb7-a46b-5494d80b72a1', 'Quelles conséquences l''environnement radiatif extrême de la magnétosphère jovienne a-t-il eues sur Pioneer 10 lors de son passage au périapse en décembre 1973 ? (Plusieurs bonnes réponses)', 'Les radiations intenses de Jupiter ont provoqué des faux déclenchements électroniques et la perte d''images d''Io, tout en fournissant des données cruciales pour blinder Voyager et Galileo.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4bee0b2e-bab0-4fee-870f-8a09de3ebe78', '647379ac-f080-4e31-987f-0a4f5e222694', 'Dégradation temporaire et commandes erronées générées par les particules piégées dans les circuits électroniques ET Perte de certaines images de la lune Io due à la saturation et aux parasites radiatifs ET Validation des seuils de blindage nécessaires pour les missions ultérieures Voyager et Galileo', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e9e1df43-96c0-4ddc-bddd-dfba56ea72a3', '647379ac-f080-4e31-987f-0a4f5e222694', 'Destruction définitive des quatre RTG SNAP-19 ET Fusion complète du réflecteur parabolique en aluminium', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1457fa67-385d-48bf-88a6-953ccc389645', '647379ac-f080-4e31-987f-0a4f5e222694', 'Dégradation temporaire et commandes erronées générées par les particules piégées dans les circuits électroniques', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a2d7de1d-e4d4-4ec7-94fe-26b10e6cc6f5', '8496b938-8735-4cb7-a46b-5494d80b72a1', 'Quelle manœuvre orbitale audacieuse a permis à Pioneer 11 de rejoindre Saturne après son survol de Jupiter en décembre 1974 ?', 'En passant très près de Jupiter sur une trajectoire rétrograde, Pioneer 11 a utilisé l''assistance gravitationnelle jovienne pour traverser le système solaire vers Saturne.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4af52665-7d7e-455a-a7ba-97fe3e7740e5', 'a2d7de1d-e4d4-4ec7-94fe-26b10e6cc6f5', 'Un survol rétrograde rapproché à 43 000 km de Jupiter qui a courbé sa trajectoire de près de 180° à travers le système solaire interne vers Saturne', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('64208d79-c9f7-4471-89f7-dbd2dfdda035', 'a2d7de1d-e4d4-4ec7-94fe-26b10e6cc6f5', 'L''allumage d''un moteur ionique au xénon pendant trois ans', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('51e99713-ba05-4058-9d68-228bc422469b', 'a2d7de1d-e4d4-4ec7-94fe-26b10e6cc6f5', 'Une mise en orbite autour de Mars pour se ravitailler en ergols', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('85123f1a-355d-4ae7-bb36-25e73e63ce92', 'a2d7de1d-e4d4-4ec7-94fe-26b10e6cc6f5', 'Un freinage atmosphérique dans la haute atmosphère de Jupiter', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('6ee4474d-4eaa-4f7e-a13c-eaf16b78c78a', '8496b938-8735-4cb7-a46b-5494d80b72a1', 'Vrai ou faux : Lors de son survol de Saturne en septembre 1979, Pioneer 11 a traversé le plan des anneaux juste à l''extérieur de l''anneau A, à une distance où l''on craignait un impact fatal avec des débris.', 'Pioneer 11 a franchi le plan des anneaux à environ 35 000 km du bord externe de l''anneau A, survivant aux micrométéoroïdes et découvrant l''anneau F.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b2af9c82-e961-4b93-a226-508ce26b62f7', '6ee4474d-4eaa-4f7e-a13c-eaf16b78c78a', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('db780e37-6eb1-4ad5-bd2c-c0f64e3db118', '6ee4474d-4eaa-4f7e-a13c-eaf16b78c78a', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('eda1243e-3fcd-4274-8998-738499c9852b', '8496b938-8735-4cb7-a46b-5494d80b72a1', 'Relie chaque sous-système de Pioneer 10/11 à son principe de fonctionnement ou sa contrainte d''ingénierie.', 'L''architecture spin-stabilisée de Pioneer dictait le balayage optique de l''IPP, le déploiement radial des RTG SNAP-19 et la simplicité du contrôle d''attitude.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('23a46564-2413-4c9d-b91a-7e69ff6400c8', 'eda1243e-3fcd-4274-8998-738499c9852b', 'Photopolarimètre imageur (IPP) = Construction d''images ligne par ligne en exploitant la rotation de la sonde | RTG SNAP-19 = Production d''environ 155 W au lancement via la décroissance du Pu-238 | Stabilisation par spin (~4,8 tr/min) = Maintien passif du pointage de l''antenne vers la Terre sans roues de réaction | Plaque en aluminium anodisé or = Gravure de 14 pulsars et de leurs périodes en binaire pour localiser le Soleil', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e324833f-da6e-4790-939d-a07cb97cb701', 'eda1243e-3fcd-4274-8998-738499c9852b', 'Photopolarimètre imageur (IPP) = Production d''environ 155 W au lancement via la décroissance du Pu-238 | RTG SNAP-19 = Maintien passif du pointage de l''antenne vers la Terre sans roues de réaction | Stabilisation par spin (~4,8 tr/min) = Gravure de 14 pulsars et de leurs périodes en binaire pour localiser le Soleil | Plaque en aluminium anodisé or = Construction d''images ligne par ligne en exploitant la rotation de la sonde', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f76cf1aa-7887-4a94-aa3b-5da2a04aa78e', '8496b938-8735-4cb7-a46b-5494d80b72a1', 'Comment la carte des 14 pulsars gravée sur la plaque Pioneer permet-elle à une intelligence extraterrestre de déterminer l''époque du lancement de la sonde ?', 'Chaque rayon de la carte indique en binaire la période de rotation d''un pulsar à l''époque du lancement ; le ralentissement séculaire des pulsars sert ainsi d''horloge cosmique.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('347f761a-28f6-40b6-b6c7-7ff64096d5ed', 'f76cf1aa-7887-4a94-aa3b-5da2a04aa78e', 'En comparant les fréquences de rotation des pulsars gravées en binaire avec leurs fréquences ralenties observées au moment de la découverte', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c9e12c66-4d24-4ecf-afb2-761ab1cce062', 'f76cf1aa-7887-4a94-aa3b-5da2a04aa78e', 'En mesurant la demi-vie radioactive de l''aluminium de la plaque', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b9015e97-ec79-48a0-bc91-8a3694157cee', 'f76cf1aa-7887-4a94-aa3b-5da2a04aa78e', 'En comptant le nombre d''anneaux autour de Saturne sur le schéma', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cc327bc0-b10f-41d3-8879-1ded519eede5', 'f76cf1aa-7887-4a94-aa3b-5da2a04aa78e', 'En lisant la date grégorienne écrite en chiffres romains', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('4d34e2c4-25f7-479a-8769-cadad0fcf8a7', '8496b938-8735-4cb7-a46b-5494d80b72a1', 'Pourquoi les communications avec Pioneer 10 ont-elles pris fin en janvier 2003 alors que la sonde était à environ 80 unités astronomiques de la Terre ?', 'Après plus de 30 ans, la puissance électrique disponible des RTG SNAP-19 était devenue trop faible pour alimenter simultanément l''émetteur et les systèmes de bord.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4819c848-41fe-4501-87f6-1ada4f353aec', '4d34e2c4-25f7-479a-8769-cadad0fcf8a7', 'La décroissance radioactive du Pu-238 et la dégradation des thermocouples avaient réduit la puissance des RTG sous le seuil requis pour alimenter l''émetteur radio', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('42be1a4a-54dc-416f-aec9-d8043713e909', '4d34e2c4-25f7-479a-8769-cadad0fcf8a7', 'La sonde est entrée dans le nuage d''Oort et a été percutée par une comète', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7032b67d-af66-4171-ba61-2c3db79d353a', '4d34e2c4-25f7-479a-8769-cadad0fcf8a7', 'Le Deep Space Network de la NASA a été définitivement fermé', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c4b4c6d1-1c6d-4d38-b655-6944615a889c', '4d34e2c4-25f7-479a-8769-cadad0fcf8a7', 'L''orbite de la Terre l''a placée derrière le Soleil en permanence', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('205478b7-b4ca-44d1-a9a8-982734b4e28e', '8496b938-8735-4cb7-a46b-5494d80b72a1', 'Quels apports scientifiques et d''ingénierie de Pioneer 10 et 11 ont directement conditionné la conception du programme Voyager ? (Plusieurs bonnes réponses)', 'Les mesures de poussières interplanétaires, de radiations joviennes et de densité des anneaux saturniens par Pioneer 10/11 ont permis de dimensionner et sécuriser les missions Voyager.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a70a4352-b2cf-4707-9583-4a0f2053a95b', '205478b7-b4ca-44d1-a9a8-982734b4e28e', 'La démonstration que la ceinture principale d''astéroïdes ne présente pas un flux de débris prohibitif pour une sonde ET La mesure directe de la densité et de l''énergie des protons et électrons piégés dans la magnétosphère de Jupiter ET La reconnaissance de la sécurité du couloir de traversée du plan des anneaux de Saturne', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('43b47c6b-bacd-4ed1-99a9-16314d0f92cb', '205478b7-b4ca-44d1-a9a8-982734b4e28e', 'La mise au point du système d''atterrissage par airbags utilisé sur Mars ET Le test en vol du télescope spatial à photométrie de transit', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ab697f19-08ec-4e3d-91e2-a6cf61ddcf2d', '205478b7-b4ca-44d1-a9a8-982734b4e28e', 'La démonstration que la ceinture principale d''astéroïdes ne présente pas un flux de débris prohibitif pour une sonde', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f0aa9c9d-72a4-44df-a5bd-f645ccdf7949', '8496b938-8735-4cb7-a46b-5494d80b72a1', 'Quelle découverte fondamentale sur la structure interne de Jupiter les données radiométriques et gravitationnelles de Pioneer 10 et 11 ont-elles confirmée ?', 'Les observations infrarouges et gravitationnelles de Pioneer 10 et 11 ont confirmé la nature fluide de Jupiter et son excès d''émission thermique interne.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f81f0d4b-aa06-4b8d-ba7b-ce9858e3284d', 'f0aa9c9d-72a4-44df-a5bd-f645ccdf7949', 'Jupiter est une planète majoritairement fluide composée d''hydrogène et d''hélium liquides sans surface solide, et émet plus de chaleur interne qu''elle n''en reçoit du Soleil', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e9fb34b6-715d-4f41-9bbf-465adbd2b6fc', 'f0aa9c9d-72a4-44df-a5bd-f645ccdf7949', 'Jupiter possède une croûte continentale de basalte sous une fine couche de nuages', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a3a875b8-717f-4fea-91d4-c760b325ac7d', 'f0aa9c9d-72a4-44df-a5bd-f645ccdf7949', 'Le noyau de Jupiter est composé d''eau liquide à température ambiante', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c9cd475f-b4a4-4596-a405-f1316e972b3a', 'f0aa9c9d-72a4-44df-a5bd-f645ccdf7949', 'Jupiter ne possède aucun champ magnétique intrinsèque', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('6c1d9266-dbac-4aaa-877c-d9e009f58b36', '8496b938-8735-4cb7-a46b-5494d80b72a1', 'Ordonne les étapes techniques caractéristiques du survol de Jupiter par Pioneer 10 en décembre 1973.', 'Pioneer 10 a d''abord franchi l''onde de choc magnétosphérique, entamé l''imagerie d''approche, subi le pic de radiations au périapse puis poursuivi sa télémétrie en s''éloignant.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5d0445a1-0429-4346-8f35-3f2b723476c0', '6c1d9266-dbac-4aaa-877c-d9e009f58b36', '1. Entrée dans la magnétosphère externe de Jupiter et franchissement de l''onde de choc ➔ 2. Début du balayage photographique par le photopolarimètre imageur (IPP) durant l''approche ➔ 3. Passage au périapse à environ 130 000 km au sommet des ceintures de radiations internes ➔ 4. Reprise de la télémétrie nominale après la sortie des zones de radiations les plus intenses', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('186e05d0-72b1-4395-9f96-8a94c8478d64', '6c1d9266-dbac-4aaa-877c-d9e009f58b36', '1. Reprise de la télémétrie nominale après la sortie des zones de radiations les plus intenses ➔ 2. Passage au périapse à environ 130 000 km au sommet des ceintures de radiations internes ➔ 3. Début du balayage photographique par le photopolarimètre imageur (IPP) durant l''approche ➔ 4. Entrée dans la magnétosphère externe de Jupiter et franchissement de l''onde de choc', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('11e0ee1a-6005-4996-923d-8050a5e067ab', '6c1d9266-dbac-4aaa-877c-d9e009f58b36', '1. Début du balayage photographique par le photopolarimètre imageur (IPP) durant l''approche ➔ 2. Entrée dans la magnétosphère externe de Jupiter et franchissement de l''onde de choc ➔ 3. Passage au périapse à environ 130 000 km au sommet des ceintures de radiations internes ➔ 4. Reprise de la télémétrie nominale après la sortie des zones de radiations les plus intenses', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('cf8b9038-fef6-4bfb-ad41-8cf0bbd0dbd0', '8496b938-8735-4cb7-a46b-5494d80b72a1', 'Vrai ou faux : Pioneer 10 a atteint la vitesse de libération du système solaire dès son survol de Jupiter en décembre 1973, devenant le premier objet artificiel sur une trajectoire hyperbolique d''échappement solaire.', 'Grâce à l''assistance gravitationnelle de Jupiter en décembre 1973, Pioneer 10 est devenue le premier artefact humain à atteindre la vitesse de libération du système solaire.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c8dc7cdf-2c2a-4ad6-8536-d15bbd77357d', 'cf8b9038-fef6-4bfb-ad41-8cf0bbd0dbd0', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3c7875f1-6b03-43b9-8ab7-74ae03dc7039', 'cf8b9038-fef6-4bfb-ad41-8cf0bbd0dbd0', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('87800c1b-2964-4f71-b90a-49f786ee1bbd', '8496b938-8735-4cb7-a46b-5494d80b72a1', 'Quel est le statut opérationnel exact de Pioneer 10 et Pioneer 11 dans l''espace interstellaire ?', 'Privées d''énergie électrique suffisante pour émettre depuis 1995 et 2003, Pioneer 10 et 11 poursuivent silencieusement leur course interstellaire.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('50bf7348-fd9a-4b18-8c36-0ecdef86b0c2', '87800c1b-2964-4f71-b90a-49f786ee1bbd', 'Ce sont des vestiges inertes et silencieux qui poursuivent leur trajectoire balistique hors du système solaire sans liaison radio', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('603efb3b-bd60-4122-a9a5-a4f08fce5852', '87800c1b-2964-4f71-b90a-49f786ee1bbd', 'Elles transmettent encore des images haute définition chaque semaine', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('aeff1278-09c6-4c2e-a092-279e00cc5c50', '87800c1b-2964-4f71-b90a-49f786ee1bbd', 'Elles ont été capturées en orbite autour d''une exoplanète', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7c5843ce-c385-4000-96a0-9ed3fd0d0943', '87800c1b-2964-4f71-b90a-49f786ee1bbd', 'Elles ont été désorbitées dans l''atmosphère de Saturne', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('6fca18b5-9cf7-4cbf-b3f6-2c5bb4e0a496', '8496b938-8735-4cb7-a46b-5494d80b72a1', 'Quelles affirmations distinguent correctement Pioneer 10 de Pioneer 11 ? (Plusieurs bonnes réponses)', 'Bien que quasi jumelles techniquement, Pioneer 10 et 11 ont suivi des trajectoires opposées après Jupiter, Pioneer 11 visitant Saturne avant de quitter le système solaire.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b6fbab86-08a6-4c95-af1b-775f8fd09d07', '6fca18b5-9cf7-4cbf-b3f6-2c5bb4e0a496', 'Pioneer 10 a survolé uniquement Jupiter tandis que Pioneer 11 a survolé Jupiter puis Saturne ET Pioneer 10 se dirige vers la constellation du Taureau tandis que Pioneer 11 se dirige vers l''Écu (Scutum) ET Pioneer 10 a maintenu le contact radio avec la Terre jusqu''en 2003 contre 1995 pour Pioneer 11', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f1e5e06d-a92d-4328-a76d-1efe2dc7c7bc', '6fca18b5-9cf7-4cbf-b3f6-2c5bb4e0a496', 'Pioneer 10 était alimentée par panneaux solaires alors que Pioneer 11 utilisait des RTG ET Pioneer 11 s''est posée sur Titan en 1979', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('aade4020-d797-48cd-96eb-85b537c7ca37', '6fca18b5-9cf7-4cbf-b3f6-2c5bb4e0a496', 'Pioneer 10 a survolé uniquement Jupiter tandis que Pioneer 11 a survolé Jupiter puis Saturne', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('8367b44c-c3d5-424a-a651-9b8eab75550e', '8496b938-8735-4cb7-a46b-5494d80b72a1', 'Pourquoi la plaque des sondes Pioneer a-t-elle été fixée sur les montants de soutien de l''antenne, tournée vers l''intérieur du vaisseau ?', 'Montée sur les entretoises de l''antenne face au corps de la sonde, la plaque est protégée de l''abrasion par les micrométéoroïdes interstellaires.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('82485384-9c09-4b14-8ecd-e1e4a3a15ce1', '8367b44c-c3d5-424a-a651-9b8eab75550e', 'Pour la protéger de l''érosion par les poussières interstellaires et les micrométéoroïdes durant des millions d''années', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d7c641ba-615e-4f79-8acd-74faa388dd06', '8367b44c-c3d5-424a-a651-9b8eab75550e', 'Pour servir de miroir de visée au capteur solaire', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a81da5b1-2ecf-40dd-885f-8be683bd7de2', '8367b44c-c3d5-424a-a651-9b8eab75550e', 'Pour refroidir l''ordinateur de bord par conduction', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('412c6140-4a8f-4458-a15f-f465f119ea80', '8367b44c-c3d5-424a-a651-9b8eab75550e', 'Pour éviter qu''elle ne reflète la lumière vers la Terre', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Mission Dawn vers Vesta et Cérès (Explorateur) (vaisseau-dawn-explorer)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('27f8734d-59ad-4898-9ae2-1557e1cd8346', 'vaisseau-dawn-explorer', 'Mission Dawn vers Vesta et Cérès (Explorateur)', 'EXPLORER'::"QuizLevel", NULL, NULL, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('b4a73aa9-1ba2-44a0-8260-ea36a5b3d557', '27f8734d-59ad-4898-9ae2-1557e1cd8346', 'Quels sont les deux mondes rocheux que la sonde spatiale Dawn a visités ?', 'Dawn a exploré l''astéroïde géant Vesta puis la planète naine Cérès[cite: 28].', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('bcdaa8d0-f83e-4b58-9f4d-f35dfb1ebe9f', 'b4a73aa9-1ba2-44a0-8260-ea36a5b3d557', 'Vesta et Cérès', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('64fec569-902c-4f04-9f05-df2c6411c8c2', 'b4a73aa9-1ba2-44a0-8260-ea36a5b3d557', 'La Terre et la Lune', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9f0a27ce-6c62-48d3-854f-85092514aa1e', 'b4a73aa9-1ba2-44a0-8260-ea36a5b3d557', 'Saturne et Uranus', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('80eee914-68c3-45a7-973e-5202d57df470', 'b4a73aa9-1ba2-44a0-8260-ea36a5b3d557', 'Mercure et Vénus', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('431b56f8-ed24-4f56-ba89-abd0400dd0a9', '27f8734d-59ad-4898-9ae2-1557e1cd8346', 'Vrai ou faux : La sonde Dawn s''est posée sur Cérès et a roulé sur ses cratères.', 'Faux, Dawn est restée en orbite autour de Vesta et de Cérès sans jamais atterrir[cite: 28].', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a7185d69-74f7-4f17-95cd-4621c0a877aa', '431b56f8-ed24-4f56-ba89-abd0400dd0a9', 'Vrai', false, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a21207ee-e816-4b64-9403-273d2bcff6a3', '431b56f8-ed24-4f56-ba89-abd0400dd0a9', 'Faux', true, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f2bceabf-85d2-4dac-a15e-ac52ac02ed7f', '27f8734d-59ad-4898-9ae2-1557e1cd8346', 'Avec ses grands panneaux solaires déployés, à quoi ressemble la longueur de la sonde Dawn ?', 'Avec ses grands panneaux solaires ouverts sur 19,7 mètres, Dawn est aussi longue qu''un camion semi-remorque[cite: 28].', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f913d6e3-ed99-4724-a4e4-d3cc5f46838e', 'f2bceabf-85d2-4dac-a15e-ac52ac02ed7f', 'Un camion semi-remorque', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3ed708c4-e4ae-4a2a-8bce-85a7261045cc', 'f2bceabf-85d2-4dac-a15e-ac52ac02ed7f', 'Un ballon de football', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('349d328c-306a-4ba0-a5a3-6274fa7d4d11', 'f2bceabf-85d2-4dac-a15e-ac52ac02ed7f', 'Un crayon à papier', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2c63a66f-aa5f-4946-9159-0823296cf845', 'f2bceabf-85d2-4dac-a15e-ac52ac02ed7f', 'Une petite chaise', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('ac2548cd-480c-4034-9fae-2f033339a965', '27f8734d-59ad-4898-9ae2-1557e1cd8346', 'De quoi le vaisseau spatial Dawn était-il équipé ? (Plusieurs bonnes réponses)', 'Dawn était doté de grands panneaux solaires, d''un moteur ionique et d''une antenne principale pour communiquer avec la Terre[cite: 28].', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c6a1c2ea-0719-4a01-adf1-712a52073921', 'ac2548cd-480c-4034-9fae-2f033339a965', 'Deux grands panneaux solaires ET Un moteur ionique ET Une antenne pour communiquer avec la Terre', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('33b5d950-d450-4a2f-be4c-0042b5dab3d2', 'ac2548cd-480c-4034-9fae-2f033339a965', 'Des roues de vélo ET Des ailes d''avion en tissu', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8651acd1-fbe5-4a18-bb00-d6d4b283d1e4', 'ac2548cd-480c-4034-9fae-2f033339a965', 'Deux grands panneaux solaires', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f592b8e8-dd1b-4114-aed2-1d264e5a0b80', '27f8734d-59ad-4898-9ae2-1557e1cd8346', 'Combien de mètres mesurait la sonde Dawn d''un bout à l''autre de ses panneaux solaires (arrondi au nombre entier le plus proche) ?', 'D''un bout à l''autre de ses panneaux solaires, Dawn mesurait 19,7 mètres (soit environ 20 mètres)[cite: 28].', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4d5115ad-58b7-4b52-9604-b5caf728468f', 'f592b8e8-dd1b-4114-aed2-1d264e5a0b80', '20 mètres', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('90d76405-dff7-4339-882f-64bad0df7bf8', 'f592b8e8-dd1b-4114-aed2-1d264e5a0b80', '30 mètres', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6306b304-5fad-448d-9ba5-af2b5fc38e73', 'f592b8e8-dd1b-4114-aed2-1d264e5a0b80', '10 mètres', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3aa1f813-ed09-48f6-9b5c-5e02b10a2bd2', 'f592b8e8-dd1b-4114-aed2-1d264e5a0b80', '30 mètres', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('85040023-6a1b-4b93-a2c2-6abfe9cf9a7e', '27f8734d-59ad-4898-9ae2-1557e1cd8346', 'Qu''a-t-on observé d''étonnant à l''intérieur du cratère Occator sur Cérès ?', 'Dawn a photographié de célèbres régions très brillantes à l''intérieur du cratère Occator sur Cérès[cite: 28].', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0a5d560a-82a1-4edf-8cf9-5a6e061c2942', '85040023-6a1b-4b93-a2c2-6abfe9cf9a7e', 'Des régions très brillantes', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5802b188-dd68-43ad-94a5-eb5be683336a', '85040023-6a1b-4b93-a2c2-6abfe9cf9a7e', 'Une forêt de sapins', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f2f13dbb-c37a-4cbc-bf60-d30b267c7d05', '85040023-6a1b-4b93-a2c2-6abfe9cf9a7e', 'Un océan de lave rouge', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cd311388-55e1-4d91-ad31-4146f966df7e', '85040023-6a1b-4b93-a2c2-6abfe9cf9a7e', 'Des nuages de pluie', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('3e87c5aa-34af-4723-a2cf-81352b2fbbef', '27f8734d-59ad-4898-9ae2-1557e1cd8346', 'Vrai ou faux : À court de carburant, Dawn tourne toujours autour de Cérès sans alimentation électrique.', 'Vrai, une fois à court de carburant, Dawn demeure en orbite perpétuelle et sans alimentation électrique autour de Cérès[cite: 28].', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('007bed61-46ff-4c60-a76e-69cbbb9bb79b', '3e87c5aa-34af-4723-a2cf-81352b2fbbef', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ae2a3223-ce7b-4b6a-b2e2-c6ff1d7a9af6', '3e87c5aa-34af-4723-a2cf-81352b2fbbef', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('21f72dd3-ed54-4ef5-a7b1-e4779e88d85b', '27f8734d-59ad-4898-9ae2-1557e1cd8346', 'Remets les étapes du voyage de Dawn dans le bon ordre :', 'Lancée en 2007, Dawn a survolé Mars en 2009, atteint Vesta en 2011 et rejoint Cérès en 2015[cite: 28].', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('42dd5d98-8d88-48da-ae64-81e160eb2146', '21f72dd3-ed54-4ef5-a7b1-e4779e88d85b', '1. Décollage depuis la Terre ➔ 2. Passage près de Mars ➔ 3. Arrivée autour de Vesta ➔ 4. Arrivée autour de Cérès', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0000fcd0-a11e-4c26-9702-26ae3a904675', '21f72dd3-ed54-4ef5-a7b1-e4779e88d85b', '1. Arrivée autour de Cérès ➔ 2. Arrivée autour de Vesta ➔ 3. Passage près de Mars ➔ 4. Décollage depuis la Terre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a58c30fb-aacd-4c41-9656-425dd74dbbca', '21f72dd3-ed54-4ef5-a7b1-e4779e88d85b', '1. Passage près de Mars ➔ 2. Décollage depuis la Terre ➔ 3. Arrivée autour de Vesta ➔ 4. Arrivée autour de Cérès', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('3daba97a-8f9e-4f84-92ec-a70d52848687', '27f8734d-59ad-4898-9ae2-1557e1cd8346', 'Quel type d''astre est Cérès, le deuxième monde exploré par Dawn ?', 'Cérès est une planète naine que Dawn a cartographiée en détail[cite: 28].', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c30bda1d-65f8-40f3-beb6-fdef92cb2edf', '3daba97a-8f9e-4f84-92ec-a70d52848687', 'Une planète naine', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d467789c-11e7-420e-806e-c27324e2f60b', '3daba97a-8f9e-4f84-92ec-a70d52848687', 'Une étoile brillante', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('de4036e0-b394-413e-89df-386c761bec9e', '3daba97a-8f9e-4f84-92ec-a70d52848687', 'Une lune de Saturne', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8a4fb962-ca98-47ab-bb36-428a2d2fc5f9', '3daba97a-8f9e-4f84-92ec-a70d52848687', 'Une planète géante gazeuse', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('972e35c1-4be6-4ebb-8da1-9bdec889c709', '27f8734d-59ad-4898-9ae2-1557e1cd8346', 'Quelles découvertes Dawn a-t-elle observées sur Vesta et Cérès ? (Plusieurs bonnes réponses)', 'Dawn a découvert deux immenses bassins sur Vesta ainsi que les taches brillantes d''Occator et Ahuna Mons sur Cérès[cite: 28].', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b9194d21-c368-4f54-a4b1-2ceb861d5192', '972e35c1-4be6-4ebb-8da1-9bdec889c709', 'D''immenses bassins d''impact sur Vesta ET Une montagne remarquable appelée Ahuna Mons sur Cérès ET Des zones brillantes dans le cratère Occator', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0c643a83-f153-48b7-9be4-28a46e98384c', '972e35c1-4be6-4ebb-8da1-9bdec889c709', 'Des rivières d''eau douce ET Des volcans de lave bleue en éruption', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('03738bee-199d-416f-9a0b-5b0069ee717d', '972e35c1-4be6-4ebb-8da1-9bdec889c709', 'D''immenses bassins d''impact sur Vesta', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('8dcceeba-0cf1-43d9-be49-655e0a14ed28', '27f8734d-59ad-4898-9ae2-1557e1cd8346', 'Associe chaque élément de la sonde Dawn à son utilité :', 'Chaque composant permettait à Dawn de s''alimenter en énergie, de se propulser, d''observer et de communiquer[cite: 28].', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5e6c50a4-19e9-4a53-ad8c-10871e1e1cf4', '8dcceeba-0cf1-43d9-be49-655e0a14ed28', 'Panneaux solaires = Capter la lumière du Soleil pour faire de l''électricité | Gaz xénon = Servir de carburant au moteur ionique | Caméras = Cartographier Vesta et Cérès | Antenne = Communiquer avec la Terre', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f77654ce-404c-4db4-a92b-9b73f47ddace', '8dcceeba-0cf1-43d9-be49-655e0a14ed28', 'Panneaux solaires = Servir de carburant au moteur ionique | Gaz xénon = Cartographier Vesta et Cérès | Caméras = Communiquer avec la Terre | Antenne = Capter la lumière du Soleil pour faire de l''électricité', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('4afd8458-b4eb-4311-8c54-3eb7f9af098e', '27f8734d-59ad-4898-9ae2-1557e1cd8346', 'De quelle couleur principale apparaît Cérès sur les photographies prises par Dawn ?', 'Sur les images de Dawn, Cérès apparaît comme un monde gris couvert de cratères[cite: 28].', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('588fbaa7-18de-465c-ab68-0b313ee56bb8', '4afd8458-b4eb-4311-8c54-3eb7f9af098e', 'Grise et couverte de cratères', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2fbd9eaf-941a-487a-9887-95c19a4d9f28', '4afd8458-b4eb-4311-8c54-3eb7f9af098e', 'Rouge vif', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('07617490-0339-4f6c-bb68-e1decf09dda9', '4afd8458-b4eb-4311-8c54-3eb7f9af098e', 'Verte comme l''herbe', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e0163a45-5aef-4fc4-b1a3-cd21f032a433', '4afd8458-b4eb-4311-8c54-3eb7f9af098e', 'Bleue comme le ciel', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('ad747e01-d64b-4f4e-8f4f-57b76d721a89', '27f8734d-59ad-4898-9ae2-1557e1cd8346', 'Quel type d''objet céleste est Vesta, le premier monde visité par Dawn ?', 'Vesta est un astéroïde géant exploré en détail par la sonde Dawn[cite: 28].', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b747e345-0891-488d-b862-5031bac09419', 'ad747e01-d64b-4f4e-8f4f-57b76d721a89', 'Un astéroïde géant', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('48718034-7cca-4580-9046-81c4b8b7edba', 'ad747e01-d64b-4f4e-8f4f-57b76d721a89', 'Une comète glacée', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('65a92941-c386-4a43-ac4a-81506476f7a8', 'ad747e01-d64b-4f4e-8f4f-57b76d721a89', 'Une étoile', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('810a94fc-9dd7-495c-a255-0034f066b8a8', 'ad747e01-d64b-4f4e-8f4f-57b76d721a89', 'Une planète gazeuse', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9b525309-dcb6-4d72-ac4d-387a65e1b4f8', '27f8734d-59ad-4898-9ae2-1557e1cd8346', 'Quelles affirmations sont vraies concernant Vesta ? (Plusieurs bonnes réponses)', 'Vesta est un astéroïde géant marqué par deux colossaux bassins d''impact dans son hémisphère sud[cite: 28].', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('00b9277f-ec68-449d-9e88-e3fcb114a568', '9b525309-dcb6-4d72-ac4d-387a65e1b4f8', 'C''est un astéroïde géant ET Dawn l''a visité avant Cérès ET Il possède deux énormes bassins d''impact au sud', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('aa577e18-3053-4e9c-bbd7-4c829185c9f3', '9b525309-dcb6-4d72-ac4d-387a65e1b4f8', 'Il est plus chaud que le Soleil ET Il est entouré de quatre anneaux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8e8a61e2-c3d5-4aae-9151-d0c4e25225dd', '9b525309-dcb6-4d72-ac4d-387a65e1b4f8', 'C''est un astéroïde géant', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('40a13a68-a2dc-426d-8416-889091399701', '27f8734d-59ad-4898-9ae2-1557e1cd8346', 'Quelle agence spatiale a dirigé la mission Dawn ?', 'Dawn est une mission scientifique de la NASA[cite: 28].', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3cf8ea1a-9264-4e28-af7a-c3084d107e41', '40a13a68-a2dc-426d-8416-889091399701', 'La NASA', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0367a4d7-c154-4fe2-aca5-9c589fdb9881', '40a13a68-a2dc-426d-8416-889091399701', 'L''agence spatiale russe (Roscosmos)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('738a5f53-3daa-4e24-a8b3-6ce49a9b89ef', '40a13a68-a2dc-426d-8416-889091399701', 'L''agence spatiale japonaise (JAXA)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b8c64433-7b68-4a4f-b214-dd913eab4ced', '40a13a68-a2dc-426d-8416-889091399701', 'L''agence spatiale canadienne (ASC)', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Mission Dawn vers Vesta et Cérès (Expert) (vaisseau-dawn-expert)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('19962f86-74cb-4639-a622-5444d1943183', 'vaisseau-dawn-expert', 'Mission Dawn vers Vesta et Cérès (Expert)', 'EXPERT'::"QuizLevel", NULL, NULL, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('1a0d7ce1-50e9-4499-abee-75dd324b8644', '19962f86-74cb-4639-a622-5444d1943183', 'À poussée maximale, le moteur ionique de Dawn consomme environ 0,25 kg de xénon par jour pour modifier sa vitesse de 10 m/s. Combien de kilogrammes de xénon faut-il pour obtenir un changement de vitesse de 1 000 m/s ?', 'Pour atteindre 1 000 m/s de changement de vitesse en 100 jours, le moteur ionique ne requiert que 25 kg de xénon[cite: 28].', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('47169b4c-0d0b-42d9-b9b5-8c9f1b03e02a', '1a0d7ce1-50e9-4499-abee-75dd324b8644', '25 kg', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ea5a3d9a-82cd-4190-ab61-f5587b89728a', '1a0d7ce1-50e9-4499-abee-75dd324b8644', '38 kg', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('096891f7-3cda-4a08-90b3-95dcdff5bec7', '1a0d7ce1-50e9-4499-abee-75dd324b8644', '13 kg', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('618f1b3e-a573-4480-a403-682ee8207a34', '1a0d7ce1-50e9-4499-abee-75dd324b8644', '35 kg', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('096c02d6-a7e1-42d8-b6b8-21a05776fdf0', '19962f86-74cb-4639-a622-5444d1943183', 'Quel compromis physique caractérise le moteur ionique de Dawn selon les données de la mission ?', 'Le moteur ionique permet une économie considérable de masse au lancement (25 kg pour 1 000 m/s) mais demande 100 jours pour atteindre cette variation de vitesse[cite: 28].', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('275fc902-5eaa-41dc-98e2-8624149bd16a', '096c02d6-a7e1-42d8-b6b8-21a05776fdf0', 'Une énorme économie de masse de propergol (25 kg de xénon pour 1 000 m/s) au prix d''une accélération lente s''étalant sur 100 jours', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2ce9a296-8cd4-489b-8f1d-a37fba79ff34', '096c02d6-a7e1-42d8-b6b8-21a05776fdf0', 'Une poussée instantanée très élevée permettant de changer d''orbite en quelques secondes', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7dd80958-98c7-4e3d-8e1e-7f77e13e2828', '096c02d6-a7e1-42d8-b6b8-21a05776fdf0', 'Un fonctionnement indépendant de toute alimentation électrique solaire', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d614c83e-cb5d-4f0e-887a-91cb7cd94a25', '096c02d6-a7e1-42d8-b6b8-21a05776fdf0', 'Une consommation de plusieurs tonnes de propergol par jour de poussée', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('2e41f175-3065-4e19-bf17-59b2dbc1020a', '19962f86-74cb-4639-a622-5444d1943183', 'Quelle défaillance matérielle a contraint Dawn à confier le contrôle de son orientation à ses propulseurs à hydrazine ?', 'Après l''arrêt d''une roue de réaction le 23 avril puis d''une troisième, Dawn a basculé en mode de sauvegarde et assigné le contrôle d''orientation à ses propulseurs à hydrazine[cite: 28].', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4e9c30d5-9583-4505-a3a7-27997be7d106', '2e41f175-3065-4e19-bf17-59b2dbc1020a', 'L''arrêt successif de ses roues de réaction', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a19116c7-4c40-439f-a1ea-47d36155d9a9', '2e41f175-3065-4e19-bf17-59b2dbc1020a', 'La rupture mécanique de l''articulation de ses deux panneaux solaires', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0cb645ba-ffc0-4d9e-9eb7-d31fd1d7b53d', '2e41f175-3065-4e19-bf17-59b2dbc1020a', 'La fuite complète de ses réservoirs de xénon avant l''arrivée à Vesta', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b38e0551-d0e5-4a07-ada4-a0e54dcb6c91', '2e41f175-3065-4e19-bf17-59b2dbc1020a', 'La perte de son ordinateur de bord principal lors du survol de Mars', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('0efa615d-a8c1-491b-a04c-e65f48467d39', '19962f86-74cb-4639-a622-5444d1943183', 'Vrai ou faux : Lorsque Dawn a épuisé ses réserves d''hydrazine et cessé ses opérations, il lui restait encore environ 14 kg (31 livres) de xénon dans ses réservoirs.', 'Vrai, la réserve restante estimée de xénon était de 14 kg (31 livres) alors que l''épuisement de l''hydrazine a mis fin au contrôle d''orientation[cite: 28].', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b727bc67-3249-4878-b91e-e3af694ea573', '0efa615d-a8c1-491b-a04c-e65f48467d39', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c78cc2c8-6037-41c9-ab4f-2fdf77086d6d', '0efa615d-a8c1-491b-a04c-e65f48467d39', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('f4d7f350-bf84-4ee2-b9bd-69b9081d4cad', '19962f86-74cb-4639-a622-5444d1943183', 'Quelles données exactes décrivent la masse et les ergols du vaisseau spatial Dawn ? (Plusieurs bonnes réponses)', 'Dawn pesait 747,1 kg, emportait 425 kg de xénon, consommait au maximum 0,25 kg/jour et conservait environ 14 kg de xénon[cite: 28].', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('93aa006d-e531-4d7d-b916-37c21307cfef', 'f4d7f350-bf84-4ee2-b9bd-69b9081d4cad', 'Masse du vaisseau (spacecraft weight) : 747,1 kg (1 647,1 livres) ET Xénon embarqué au lancement : 425 kg (937 livres) ET Débit maximal du moteur ionique : environ 0,25 kg de xénon par jour ET Masse de xénon restante estimée : 14 kg (31 livres)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0e603313-5f2b-4157-a697-c1ec72523597', 'f4d7f350-bf84-4ee2-b9bd-69b9081d4cad', 'Masse de xénon nécessaire pour un changement de vitesse de 1 000 m/s : 425 kg', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('69a3a69b-bb36-4895-9b7c-e023e241a01c', 'f4d7f350-bf84-4ee2-b9bd-69b9081d4cad', 'Masse du vaisseau (spacecraft weight) : 747,1 kg (1 647,1 livres)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('31835006-d47e-4fff-a372-5919b30c1003', '19962f86-74cb-4639-a622-5444d1943183', 'Comment la sonde Dawn a-t-elle réagi automatiquement lorsqu''une troisième roue de réaction a cessé de fonctionner ?', 'Lorsqu''une troisième roue de réaction s''est arrêtée, Dawn est entrée dans l''un de ses modes de sauvegarde et a assigné le contrôle d''orientation à ses propulseurs à hydrazine[cite: 28].', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a3d71227-801d-4297-8167-4da74562d570', '31835006-d47e-4fff-a372-5919b30c1003', 'Elle est entrée dans l''un de ses modes de sauvegarde (safe modes) et a assigné le contrôle de son orientation aux propulseurs à hydrazine', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('57189516-7965-437d-ae5b-4484a56891f5', '31835006-d47e-4fff-a372-5919b30c1003', 'Elle a immédiatement coupé ses panneaux solaires et éteint son émetteur radio définitivement', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('309a28ff-4e16-4e99-8448-8bdc59c20052', '31835006-d47e-4fff-a372-5919b30c1003', 'Elle a allumé son moteur ionique à pleine puissance pendant six mois sans interruption', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ceaf8649-a39b-4fbb-bc08-c480ec20c7e3', '31835006-d47e-4fff-a372-5919b30c1003', 'Elle a largué ses roues de réaction défectueuses dans l''espace', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c31a4e07-7531-41bc-a020-46adcaa5c640', '19962f86-74cb-4639-a622-5444d1943183', 'Associe chaque grandeur physique de Dawn à sa valeur exacte :', 'Ces quatre valeurs résument les spécifications techniques du vaisseau Dawn[cite: 28].', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c4ccd336-ec2e-4a3f-aa6c-b9112ca073b3', 'c31a4e07-7531-41bc-a020-46adcaa5c640', 'Envergure totale des panneaux solaires = 19,7 mètres (65 pieds) | Dimensions du corps central = 1,64 m × 1,27 m × 1,77 m | Masse du vaisseau = 747,1 kg (1 647,1 livres) | Variation de vitesse journalière à poussée maximale = 10 m/s par jour', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('33017e3d-200d-4ff7-9d4a-1e8432f0ded0', 'c31a4e07-7531-41bc-a020-46adcaa5c640', 'Envergure totale des panneaux solaires = 1,64 m × 1,27 m × 1,77 m | Dimensions du corps central = 747,1 kg (1 647,1 livres) | Masse du vaisseau = 10 m/s par jour | Variation de vitesse journalière à poussée maximale = 19,7 mètres (65 pieds)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('750b72f9-be02-486b-8d93-b9636b6e2736', '19962f86-74cb-4639-a622-5444d1943183', 'Ordonne chronologiquement ces jalons de la mission Dawn :', 'Cette séquence retrace les phases de Dawn autour de Cérès entre mars 2015 et octobre 2017[cite: 28].', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5c5798aa-a28c-4630-885b-de736f580bda', '750b72f9-be02-486b-8d93-b9636b6e2736', '1. Arrivée autour de Cérès (5 mars 2015) ➔ 2. Fin de la mission primaire (juin 2016) ➔ 3. Début de la première mission étendue (juillet 2016) ➔ 4. Début de la seconde mission étendue (octobre 2017)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('35d2722e-76de-4ddf-8858-4d70cbcd1f26', '750b72f9-be02-486b-8d93-b9636b6e2736', '1. Début de la seconde mission étendue (octobre 2017) ➔ 2. Début de la première mission étendue (juillet 2016) ➔ 3. Fin de la mission primaire (juin 2016) ➔ 4. Arrivée autour de Cérès (5 mars 2015)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6ca0ab61-287b-43a0-aa84-45e6a514aeed', '750b72f9-be02-486b-8d93-b9636b6e2736', '1. Fin de la mission primaire (juin 2016) ➔ 2. Arrivée autour de Cérès (5 mars 2015) ➔ 3. Début de la première mission étendue (juillet 2016) ➔ 4. Début de la seconde mission étendue (octobre 2017)', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('54cabcf7-d8ae-4edc-99d9-7f1ec018074f', '19962f86-74cb-4639-a622-5444d1943183', 'Quelle relation d''ancienneté Dawn a-t-elle révélée entre les deux bassins méridionaux de Vesta, Rheasilvia et Veneneia ?', 'Dawn a découvert dans l''hémisphère sud de Vesta le bassin Rheasilvia (500 km de large) et le cratère plus ancien Veneneia (400 km de large)[cite: 28].', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('46eacd86-9660-47d5-a985-4efc37d1959f', '54cabcf7-d8ae-4edc-99d9-7f1ec018074f', 'Veneneia (400 km) est un cratère d''impact plus ancien que le bassin Rheasilvia (500 km)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ef433132-0997-4f50-9ac1-d61df63eb80b', '54cabcf7-d8ae-4edc-99d9-7f1ec018074f', 'Rheasilvia (400 km) s''est formé avant Veneneia (500 km)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8a744705-47ed-4835-90f7-afb2dfc1bd98', '54cabcf7-d8ae-4edc-99d9-7f1ec018074f', 'Les deux bassins sont situés aux pôles nord et sud', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c5a8ab1c-9ae9-4d2d-a661-67ebd95f5808', '54cabcf7-d8ae-4edc-99d9-7f1ec018074f', 'Les deux structures se sont formées simultanément', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('418556e0-e2ef-4a32-a32d-6d5cba6b6ff1', '19962f86-74cb-4639-a622-5444d1943183', 'Vrai ou faux : Après l''épuisement de son hydrazine, Dawn demeure pour au moins les prochaines décennies un monument céleste inerte en orbite autour de Cérès.', 'Vrai, Dawn demeure pour au moins les prochaines décennies — et probablement bien plus longtemps — un monument céleste inerte en orbite autour de Cérès[cite: 28].', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('52fc474f-0664-4538-beed-c89f70e2604c', '418556e0-e2ef-4a32-a32d-6d5cba6b6ff1', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0cf1bba7-0b31-471a-9ec3-0de0a3e44256', '418556e0-e2ef-4a32-a32d-6d5cba6b6ff1', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('0c2eca63-07c5-43d8-82e1-02eb4039f4e2', '19962f86-74cb-4639-a622-5444d1943183', 'Pourquoi Dawn devait-elle interrompre sa poussée ionique lors des séquences de communication avec la Terre ?', 'Dawn arrêtait sa poussée ionique selon le calendrier prévu et pivotait pour pointer son antenne principale vers la Terre afin de recevoir les mises à jour[cite: 28].', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ff3a67ec-6f89-46d7-b840-34f9488bf4df', '0c2eca63-07c5-43d8-82e1-02eb4039f4e2', 'Pour pivoter et pointer son antenne principale vers la Terre afin de recevoir les mises à jour depuis le sol', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6833047f-99c5-4e06-83b7-3f8c4080aefd', '0c2eca63-07c5-43d8-82e1-02eb4039f4e2', 'Parce que les ondes radio faisaient exploser le gaz xénon', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f23ef4aa-d582-41c1-ae91-ff7fdef4e87a', '0c2eca63-07c5-43d8-82e1-02eb4039f4e2', 'Parce que le moteur ionique ne fonctionnait que dans l''ombre de Cérès', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e375a6ca-c369-465b-b5a0-41ac5ebabee4', '0c2eca63-07c5-43d8-82e1-02eb4039f4e2', 'Pour éviter d''interférer avec les radars terrestres', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('ae4550f9-455e-4b85-820b-780a36cdb8cf', '19962f86-74cb-4639-a622-5444d1943183', 'Quels aspects de Cérès sont documentés par les ressources visuelles et scientifiques de Dawn ? (Plusieurs bonnes réponses)', 'Les ressources de la mission Dawn mettent en évidence les régions brillantes d''Occator, Ahuna Mons et l''intérieur de Cérès[cite: 28].', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('828ba062-b76a-43d1-a19a-d931b8175efa', 'ae4550f9-455e-4b85-820b-780a36cdb8cf', 'Les régions brillantes du cratère Occator ET Le relief remarquable Ahuna Mons ET La structure interne de la planète naine Cérès', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a6af3e15-92fb-4272-94a5-af3bbc6d6a2e', 'ae4550f9-455e-4b85-820b-780a36cdb8cf', 'Des océans liquides de méthane couvrant l''hémisphère nord ET Une atmosphère épaisse d''oxygène respirable', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ca0f4538-5146-44e4-bd07-f17128de028e', 'ae4550f9-455e-4b85-820b-780a36cdb8cf', 'Les régions brillantes du cratère Occator', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Télescope Spatial Kepler & Exoplanètes (Explorateur) (telescope-kepler-explorer)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('3918639a-814e-4082-a72f-65a9981afd11', 'telescope-kepler-explorer', 'Télescope Spatial Kepler & Exoplanètes (Explorateur)', 'EXPLORER'::"QuizLevel", NULL, NULL, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('86bd4c7c-6e57-45d1-a48a-3bb229b8016a', '3918639a-814e-4082-a72f-65a9981afd11', 'Que cherchait le télescope spatial Kepler dans l''espace ?', 'Kepler était un chasseur d''exoplanètes : il cherchait des planètes en orbite autour d''étoiles situées en dehors de notre Système solaire.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c28a964c-5f82-4263-8555-f2b474f33275', '86bd4c7c-6e57-45d1-a48a-3bb229b8016a', 'Des planètes tournant autour d''autres étoiles (des exoplanètes)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7e8d0f33-3059-418b-aec1-76d8cd568f76', '86bd4c7c-6e57-45d1-a48a-3bb229b8016a', 'Des petits hommes verts sur la Lune', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('64b0ba08-ab5a-4f4d-a390-202b77a6cda7', '86bd4c7c-6e57-45d1-a48a-3bb229b8016a', 'Des trésors cachés au fond des océans', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('52ad758b-6c58-4618-9c6f-a08cecd1aa8e', '86bd4c7c-6e57-45d1-a48a-3bb229b8016a', 'Des nuages de pluie au-dessus de la Terre', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a5ebb2df-e02d-4ba8-b18d-643199046e16', '3918639a-814e-4082-a72f-65a9981afd11', 'Vrai ou faux : Kepler repérait les planètes en observant la petite baisse de lumière d''une étoile quand une planète passe devant elle.', 'Lorsqu''une planète passe devant son étoile, elle bloque une minuscule fraction de sa lumière : c''est la méthode des transits.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('aba98122-1e6f-4fc2-9309-c09546f0efbc', 'a5ebb2df-e02d-4ba8-b18d-643199046e16', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('36aa2a0a-cb24-4ade-b848-2e3b0fb8edb9', 'a5ebb2df-e02d-4ba8-b18d-643199046e16', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('74eb3910-7cfa-45eb-8e13-89008c4fa0bb', '3918639a-814e-4082-a72f-65a9981afd11', 'De quel grand savant du passé le télescope Kepler porte-t-il le nom ?', 'Le télescope rend hommage à l''astronome allemand Johannes Kepler (1571-1630), qui a découvert les lois du mouvement des planètes.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9784345b-34ca-4e6b-afd0-57e449ef2986', '74eb3910-7cfa-45eb-8e13-89008c4fa0bb', 'Johannes Kepler, un célèbre astronome', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4d8aa4d4-054d-4e4d-96f3-3fc065f05eca', '74eb3910-7cfa-45eb-8e13-89008c4fa0bb', 'Christophe Colomb, un navigateur', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('42f81e21-54a9-4b07-8a1d-eef6191655aa', '74eb3910-7cfa-45eb-8e13-89008c4fa0bb', 'Léonard de Vinci, un peintre', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b6f44354-bbd7-4ef4-9b97-31714444281b', '74eb3910-7cfa-45eb-8e13-89008c4fa0bb', 'Jules Verne, un écrivain', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('b4bd4509-8744-4ed9-a17c-f758c4e8b6b9', '3918639a-814e-4082-a72f-65a9981afd11', 'Pendant combien d''années le télescope spatial Kepler a-t-il fonctionné dans l''espace entre 2009 et 2018 ?', 'Lancé en mars 2009 et arrêté en octobre 2018, Kepler a travaillé pendant plus de 9 ans dans l''espace.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7596421e-8c90-4d53-8749-80198e9c1802', 'b4bd4509-8744-4ed9-a17c-f758c4e8b6b9', '9 ans', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c997fae3-dd35-48a1-a980-2780c1979c1a', 'b4bd4509-8744-4ed9-a17c-f758c4e8b6b9', '14 ans', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f8087cb1-df2b-4848-87c6-a1fdbf5d2424', 'b4bd4509-8744-4ed9-a17c-f758c4e8b6b9', '5 ans', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4ac1da6a-f789-4196-a618-4dae9df7c194', 'b4bd4509-8744-4ed9-a17c-f758c4e8b6b9', '12 ans', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('450c75da-c1d7-440a-bd32-a23c3083008d', '3918639a-814e-4082-a72f-65a9981afd11', 'Où le télescope Kepler se trouvait-il pour observer les étoiles ?', 'Kepler voyageait dans l''espace sur une orbite autour du Soleil, loin de la lumière gênante de la Terre.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5fb59aef-8253-46f0-be4c-19f4b42ccd44', '450c75da-c1d7-440a-bd32-a23c3083008d', 'Dans l''espace, en train de tourner autour du Soleil derrière la Terre', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e9515e5f-0958-42be-bd6f-d5bcbcccc302', '450c75da-c1d7-440a-bd32-a23c3083008d', 'Posé sur une haute montagne au Chili', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('55c1421d-1719-411a-8691-e19e261c48b0', '450c75da-c1d7-440a-bd32-a23c3083008d', 'Sur la surface de la Lune', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('af292e4f-d73a-490a-82fc-121c5e279767', '450c75da-c1d7-440a-bd32-a23c3083008d', 'Au fond d''un cratère sur Mars', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a5f9be70-d7d9-4a01-a029-763751f282f3', '3918639a-814e-4082-a72f-65a9981afd11', 'Quelles sortes de planètes incroyables Kepler a-t-il découvertes autour d''autres étoiles ? (Plusieurs bonnes réponses)', 'Kepler a révélé une immense diversité d''exoplanètes : des planètes semblables à la Terre, des géantes brûlantes et même des planètes autour d''étoiles doubles.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b25ecdf5-68d3-4621-9192-913f8fa66c34', 'a5f9be70-d7d9-4a01-a029-763751f282f3', 'Des planètes rocheuses de la taille de la Terre ET Des planètes qui tournent autour de deux soleils à la fois ET Des planètes géantes très chaudes toutes proches de leur étoile', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fd2b8713-4cad-4830-8e7d-2016e62a7e16', 'a5f9be70-d7d9-4a01-a029-763751f282f3', 'Des planètes faites uniquement en chocolat ET Des planètes habitées par des dinosaures géants visibles au télescope', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f67cefff-7609-46ac-a585-cbe491ecf6c0', 'a5f9be70-d7d9-4a01-a029-763751f282f3', 'Des planètes rocheuses de la taille de la Terre', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('cbd4f41e-4c1e-4ab0-8e73-c9d7c6efd990', '3918639a-814e-4082-a72f-65a9981afd11', 'Comment Kepler produisait-il son électricité dans l''espace ?', 'Les panneaux solaires fixés sur Kepler alimentaient sa grande caméra et ses ordinateurs.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b1c20bcc-a577-41a1-9747-112ff4d39928', 'cbd4f41e-4c1e-4ab0-8e73-c9d7c6efd990', 'Grâce à des panneaux solaires', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a2da2fea-7471-480d-b8c4-5ba7834879e6', 'cbd4f41e-4c1e-4ab0-8e73-c9d7c6efd990', 'Grâce à des éoliennes', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a24d2f3c-ed5b-4726-a2f7-b8b131ed8e27', 'cbd4f41e-4c1e-4ab0-8e73-c9d7c6efd990', 'Grâce à un câble relié à la Terre', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cccc249a-3c26-4341-9231-4f3dee3161b6', 'cbd4f41e-4c1e-4ab0-8e73-c9d7c6efd990', 'Grâce à une roue à eau', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('8eae5860-6187-4c37-935b-19bc02a9e90e', '3918639a-814e-4082-a72f-65a9981afd11', 'Remets dans l''ordre ce qui se passe quand Kepler détecte une exoplanète.', 'Kepler enregistre la luminosité avant, pendant et après le passage de la planète devant son étoile.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a152f19a-f501-4472-a5cc-1ed215dff24d', '8eae5860-6187-4c37-935b-19bc02a9e90e', '1. Kepler mesure la lumière normale de l''étoile ➔ 2. Une planète passe devant l''étoile et cache un tout petit peu sa lumière ➔ 3. L''étoile redevient aussi brillante qu''avant ➔ 4. Les scientifiques confirment qu''une planète tourne autour de l''étoile', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e55080b5-2807-4826-b638-438a1d50ad7a', '8eae5860-6187-4c37-935b-19bc02a9e90e', '1. Les scientifiques confirment qu''une planète tourne autour de l''étoile ➔ 2. L''étoile redevient aussi brillante qu''avant ➔ 3. Une planète passe devant l''étoile et cache un tout petit peu sa lumière ➔ 4. Kepler mesure la lumière normale de l''étoile', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fee4b681-8a1f-44c7-a662-eb41e1083bdb', '8eae5860-6187-4c37-935b-19bc02a9e90e', '1. Une planète passe devant l''étoile et cache un tout petit peu sa lumière ➔ 2. Kepler mesure la lumière normale de l''étoile ➔ 3. L''étoile redevient aussi brillante qu''avant ➔ 4. Les scientifiques confirment qu''une planète tourne autour de l''étoile', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e5ad59ad-ca7b-4ce2-bbd2-323972e34d97', '3918639a-814e-4082-a72f-65a9981afd11', 'Qu''appelle-t-on la « zone habitable » autour d''une étoile ?', 'Dans la zone habitable, la température permet à l''eau de rester liquide à la surface d''une planète rocheuse.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('feba07bd-a796-4d31-b796-1bab45f05a45', 'e5ad59ad-ca7b-4ce2-bbd2-323972e34d97', 'La bonne distance où il ne fait ni trop chaud ni trop froid pour qu''il y ait de l''eau liquide', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('26e12fc2-f89a-4fa1-b268-a7d64d68f9a7', 'e5ad59ad-ca7b-4ce2-bbd2-323972e34d97', 'Une zone où les étoiles sont toutes bleues', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a57dca18-5537-46da-976c-b3e49e28f8f0', 'e5ad59ad-ca7b-4ce2-bbd2-323972e34d97', 'Un garage dans l''espace pour réparer les fusées', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('23fec787-2db3-4bd2-a964-8837980e47df', 'e5ad59ad-ca7b-4ce2-bbd2-323972e34d97', 'La partie la plus brûlante juste contre l''étoile', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('08b339d8-68c8-4e34-8cb9-880adf78fbe4', '3918639a-814e-4082-a72f-65a9981afd11', 'Vrai ou faux : Grâce à Kepler, les astronomes ont compris qu''il existe des milliards de planètes dans notre galaxie.', 'Les observations de Kepler ont démontré que les planètes sont extrêmement nombreuses dans notre galaxie, la Voie lactée.', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7371a875-6e53-4687-84fc-3436eaf00593', '08b339d8-68c8-4e34-8cb9-880adf78fbe4', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ad9c5cfc-c7df-4be5-808d-8aa7be4bc6b6', '08b339d8-68c8-4e34-8cb9-880adf78fbe4', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('13c9609a-4e37-4998-9d80-93bd868537a5', '3918639a-814e-4082-a72f-65a9981afd11', 'De quelles parties importantes le télescope Kepler était-il composé ? (Plusieurs bonnes réponses)', 'Kepler possédait un pare-soleil incliné, un miroir primaire de 1,4 mètre et un photomètre très sensible.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('51685dc5-6fb9-49cd-bf89-8f259745f9ba', '13c9609a-4e37-4998-9d80-93bd868537a5', 'Un pare-soleil pour protéger l''ouverture de la lumière éblouissante ET Un grand miroir pour concentrer la lumière des étoiles ET Une caméra géante très sensible à la lumière', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('bd2cc6a5-2848-41d0-9419-7cc49e8623b6', '13c9609a-4e37-4998-9d80-93bd868537a5', 'Six roues pour rouler sur les astéroïdes ET Deux hélices pour voler dans les nuages', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7c6b4869-0bac-4649-9390-7d0eb354a0d1', '13c9609a-4e37-4998-9d80-93bd868537a5', 'Un pare-soleil pour protéger l''ouverture de la lumière éblouissante', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('13373b80-381d-4429-9c5a-6dab736233e8', '3918639a-814e-4082-a72f-65a9981afd11', 'Associe chaque mot de la mission Kepler à sa définition simple.', 'Kepler observait des transits d''exoplanètes au sein de notre galaxie, la Voie lactée.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4650944b-06f7-42a4-84ae-656c3e72376a', '13373b80-381d-4429-9c5a-6dab736233e8', 'Exoplanète = Planète qui tourne autour d''une autre étoile que le Soleil | Transit = Passage d''une planète juste devant son étoile | Voie lactée = Notre immense galaxie remplie de milliards d''étoiles', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fc8682ed-fcca-4bf1-9f80-31d39427764d', '13373b80-381d-4429-9c5a-6dab736233e8', 'Exoplanète = Passage d''une planète juste devant son étoile | Transit = Notre immense galaxie remplie de milliards d''étoiles | Voie lactée = Planète qui tourne autour d''une autre étoile que le Soleil', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c0db595d-ae9d-4afd-b7ec-2ba8bb1d8c20', '3918639a-814e-4082-a72f-65a9981afd11', 'Pourquoi le télescope Kepler a-t-il pris sa retraite en 2018 ?', 'En octobre 2018, Kepler a épuisé tout son carburant et la NASA l''a mis hors service sur une orbite sûre.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e4414c8f-a5f7-4705-b17b-8ad421bfe79d', 'c0db595d-ae9d-4afd-b7ec-2ba8bb1d8c20', 'Il n''avait plus de carburant pour orienter son télescope', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('6805f8ab-4dcb-4ade-ace1-b1ec39dc5b2d', 'c0db595d-ae9d-4afd-b7ec-2ba8bb1d8c20', 'Il s''est écrasé sur la Lune', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('73ba2cdb-db33-405e-98fe-ac73a5a28732', 'c0db595d-ae9d-4afd-b7ec-2ba8bb1d8c20', 'Des astronautes sont venus le démonter', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a8f4c503-aff6-4a3a-a368-b0703f1b7511', 'c0db595d-ae9d-4afd-b7ec-2ba8bb1d8c20', 'Il a été vendu à un musée sur Terre', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('856e60a7-e71c-4b61-acc7-3b56763b2110', '3918639a-814e-4082-a72f-65a9981afd11', 'Que regardait Kepler pendant les quatre premières années de sa mission ? (Plusieurs bonnes réponses)', 'Durant sa mission primaire, Kepler a surveillé en continu plus de 150 000 étoiles dans une même portion du ciel.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d544920a-1a46-4c8a-a9b5-22bed437a217', '856e60a7-e71c-4b61-acc7-3b56763b2110', 'Toujours la même région du ciel ET Plus de 150 000 étoiles en même temps ET Une zone située entre les constellations du Cygne et de la Lyre', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('851d2979-0094-40cf-b2a6-a5c85b2ea719', '856e60a7-e71c-4b61-acc7-3b56763b2110', 'Uniquement la planète Mars ET Le centre de la Terre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('85ccd2d3-fa0b-4778-9620-8e0e34764dd0', '856e60a7-e71c-4b61-acc7-3b56763b2110', 'Toujours la même région du ciel', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('dbec30d6-f0a3-48a5-8c93-bb347881b6db', '3918639a-814e-4082-a72f-65a9981afd11', 'Combien d''exoplanètes confirmées Kepler a-t-il permis de découvrir ?', 'Kepler a permis de confirmer plus de 2 600 exoplanètes, révolutionnant notre connaissance de l''Univers.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('01e63003-d546-4760-8fb4-3d5d09be1462', 'dbec30d6-f0a3-48a5-8c93-bb347881b6db', 'Plus de 2 600 exoplanètes', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('226a8fca-e288-4d36-9cb4-3b317fd609fb', 'dbec30d6-f0a3-48a5-8c93-bb347881b6db', 'Seulement 3 exoplanètes', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1368d7a3-a6d3-4ed8-8ccf-8bff8c584a3c', 'dbec30d6-f0a3-48a5-8c93-bb347881b6db', 'Exactement 10 exoplanètes', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8294df83-2cdf-48e1-9dc9-f1edfefa8b1f', 'dbec30d6-f0a3-48a5-8c93-bb347881b6db', 'Aucune exoplanète', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

-- Quiz: Télescope Spatial Kepler & Exoplanètes (Expert) (telescope-kepler-expert)
INSERT INTO "quizzes" ("id", "slug", "title", "level", "bodyId", "machineId", "isPublished", "createdAt", "updatedAt")
VALUES ('49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'telescope-kepler-expert', 'Télescope Spatial Kepler & Exoplanètes (Expert)', 'EXPERT'::"QuizLevel", NULL, NULL, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "level" = EXCLUDED."level", "isPublished" = true, "updatedAt" = NOW();

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c5dcf34f-3103-4568-b098-f1823539e5fc', '49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'Pourquoi Kepler utilisait-il une configuration optique de télescope de Schmidt plutôt qu''un Ritchey-Chrétien classique comme Hubble ?', 'La chambre de Schmidt combine une lame correctrice de 0,95 m et un miroir sphérique de 1,4 m pour couvrir un champ de ~115 deg² avec une PSF volontairement étalée sur plusieurs pixels.', 1)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('dd26b397-10d3-40d5-b273-14c29a456379', 'c5dcf34f-3103-4568-b098-f1823539e5fc', 'Pour obtenir un très grand champ de vision (~115 degrés carrés) tout en éliminant la coma et l''astigmatisme', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d0190c47-8e65-4338-83fc-29953fd0c9ed', 'c5dcf34f-3103-4568-b098-f1823539e5fc', 'Pour atteindre la résolution angulaire la plus fine possible sur une seule étoile à la fois', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('d4987154-5444-4632-926d-aba1542193fb', 'c5dcf34f-3103-4568-b098-f1823539e5fc', 'Pour observer directement dans le domaine des rayons gamma', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1651c0bb-2241-452e-be08-c5d0afa93804', 'c5dcf34f-3103-4568-b098-f1823539e5fc', 'Pour éviter d''avoir à refroidir les détecteurs', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('df02af12-2761-4a69-a5d0-d3ef078b86e1', '49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'Lors du transit d''une exoplanète de rayon Rp = 2 rayons terrestres devant une étoile de rayon R* = 1 rayon solaire (1 R☉ ≈ 109 R⊕), quelle est la profondeur du transit ΔF/F exprimée en parties par million (ppm), arrondie à l''entier ?', 'ΔF/F = (2 / 109)² × 10⁶ = (4 / 11 881) × 10⁶ ≈ 336,67 ppm, soit environ 337 ppm.', 2)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('25cbc2ff-b578-4431-9475-bc9e73830890', 'df02af12-2761-4a69-a5d0-d3ef078b86e1', '337 ppm', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('7a3b6c68-28e6-4652-a719-f76dc4860830', 'df02af12-2761-4a69-a5d0-d3ef078b86e1', '506 ppm', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a74b90a7-fcf2-48bf-b32e-b71f93a0ff7b', 'df02af12-2761-4a69-a5d0-d3ef078b86e1', '169 ppm', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('926726a0-6df3-4906-979d-8cb9b978299c', 'df02af12-2761-4a69-a5d0-d3ef078b86e1', '347 ppm', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e80534e3-8e2c-49bb-9f8a-e5dab9ae1f31', '49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'Comment les ingénieurs ont-ils résolu le problème de pointage sur le troisième axe (roulis) durant la mission K2 avec seulement deux roues de réaction valides ?', 'En pointant dans le plan de l''écliptique, le télescope se comportait comme un « kayak sur une crête » : la pression photonique solaire compensait le roulis, assistée par de brèves impulsions des propulseurs toutes les 6 heures.', 3)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9da808ed-64e3-4709-b763-9f8ee87041f1', 'e80534e3-8e2c-49bb-9f8a-e5dab9ae1f31', 'En orientant le vaisseau dans le plan de l''écliptique afin que la pression de radiation solaire équilibre symétriquement le couple autour de l''axe de roulis', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8b70e4a8-b143-455e-9e21-7c2d12f0909b', 'e80534e3-8e2c-49bb-9f8a-e5dab9ae1f31', 'En utilisant des magnéto-coupleurs interagissant avec le champ magnétique terrestre', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e676253f-2efb-4527-b408-8cf8aecd1af8', 'e80534e3-8e2c-49bb-9f8a-e5dab9ae1f31', 'En déployant un voile solaire de 500 mètres d''envergure', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5469fb29-636d-4112-8f6e-65f625f641f9', 'e80534e3-8e2c-49bb-9f8a-e5dab9ae1f31', 'En faisant tourner continuellement le télescope sur lui-même comme un gyroscope', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c4364ea9-db5c-4371-9160-556bfcfb5383', '49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'Quelles configurations astrophysiques peuvent imiter le signal photométrique d''un transit planétaire (faux positifs) dans les données de Kepler ? (Plusieurs bonnes réponses)', 'Les binaires à éclipses diluées en arrière-plan et les compagnons stellaires de faible masse produisent des baisses de flux semblables à des transits planétaires.', 4)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1ffb4569-4cb7-456d-9a25-ac2b5fdfa99f', 'c4364ea9-db5c-4371-9160-556bfcfb5383', 'Une binaire à éclipses en arrière-plan (background eclipsing binary) mélangée dans la même ouverture photométrique ET Une étoile naine rouge ou naine brune orbitant une étoile de type solaire (éclipse rasante) ET Une étoile triple hiérarchique dont deux composantes s''éclipsent', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ad9aece8-cf96-4374-8d68-7b750bf66faf', 'c4364ea9-db5c-4371-9160-556bfcfb5383', 'La réflexion des ondes radar terrestres sur la surface de l''exoplanète ET Le passage de la Station spatiale internationale devant le miroir de Kepler', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8eeae137-99ea-46d4-833e-2fa94b3a4e8d', 'c4364ea9-db5c-4371-9160-556bfcfb5383', 'Une binaire à éclipses en arrière-plan (background eclipsing binary) mélangée dans la même ouverture photométrique', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('db8cc0f7-733d-499a-88e0-2e210a1d22a0', '49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'Vrai ou faux : Le plan focal de Kepler était volontairement légèrement défocalisé afin d''étaler la lumière de chaque étoile sur plusieurs pixels et d''éviter la saturation des puits de potentiel CCD.', 'La défocalisation contrôlée étalait l''image d''une étoile sur plusieurs pixels (~4 secondes d''arc par pixel), augmentant la capacité de collecte de photons et réduisant la sensibilité aux variations intra-pixel.', 5)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e4cd9607-bd83-4238-a5ab-29d54e04961b', 'db8cc0f7-733d-499a-88e0-2e210a1d22a0', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('288a96cc-1928-4701-a2d4-6b357de73f28', 'db8cc0f7-733d-499a-88e0-2e210a1d22a0', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('9256286b-9311-477e-b15d-934b2a9e8698', '49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'Quel phénomène statistique majeur concernant la distribution des tailles des exoplanètes a été mis en évidence grâce aux données de Kepler (écart de Fulton) ?', 'L''écart de Fulton (~1,5–2,0 R⊕) s''explique par la photo-évaporation ou la perte de masse induite par le noyau qui dépouille les petites planètes de leur atmosphère primordiale.', 6)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4bdcda0c-d873-4979-8021-3c652ddf6039', '9256286b-9311-477e-b15d-934b2a9e8698', 'Une bimodalité avec un déficit marqué de planètes ayant un rayon compris entre ~1,5 et 2,0 rayons terrestres', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('4bbf521e-934b-4b14-959f-10b8b8d7d6cc', '9256286b-9311-477e-b15d-934b2a9e8698', 'L''absence totale de planètes plus grandes que Jupiter dans toute la galaxie', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5b62bcf4-4b01-4bcf-a0d5-e4c96e0dd3df', '9256286b-9311-477e-b15d-934b2a9e8698', 'Une distribution parfaitement uniforme de tous les rayons entre 0,1 et 20 rayons terrestres', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3d47318f-185b-4b5f-8100-3ff154581799', '9256286b-9311-477e-b15d-934b2a9e8698', 'La disparition complète des planètes autour des étoiles riches en métaux', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('e9c5cb98-82d9-4446-b1a9-45425edaed00', '49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'Remets dans l''ordre logique les étapes du pipeline de découverte d''une exoplanète dans les données de Kepler.', 'Le pipeline extrait et corrige la photométrie, détecte les événements périodiques (TCE), teste les faux positifs puis confirme l''exoplanète.', 7)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a6b29e3d-92f5-42a7-a174-547d3584e4b8', 'e9c5cb98-82d9-4446-b1a9-45425edaed00', '1. Calibration des pixels bruts et extraction de la courbe de lumière (PDC-SAP) ➔ 2. Recherche périodique de baisses de flux (algorithme Box Least Squares / TPS) ➔ 3. Rejet des faux positifs (test d''éclipse secondaire, décalage du photocentre) ➔ 4. Validation statistique ou suivi spectroscopique par vitesses radiales depuis le sol', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('79174d72-ec38-41a6-850e-675292d7d558', 'e9c5cb98-82d9-4446-b1a9-45425edaed00', '1. Validation statistique ou suivi spectroscopique par vitesses radiales depuis le sol ➔ 2. Rejet des faux positifs (test d''éclipse secondaire, décalage du photocentre) ➔ 3. Recherche périodique de baisses de flux (algorithme Box Least Squares / TPS) ➔ 4. Calibration des pixels bruts et extraction de la courbe de lumière (PDC-SAP)', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('5f052bf9-75f2-4c20-a5a1-cb11393ef06b', 'e9c5cb98-82d9-4446-b1a9-45425edaed00', '1. Recherche périodique de baisses de flux (algorithme Box Least Squares / TPS) ➔ 2. Calibration des pixels bruts et extraction de la courbe de lumière (PDC-SAP) ➔ 3. Rejet des faux positifs (test d''éclipse secondaire, décalage du photocentre) ➔ 4. Validation statistique ou suivi spectroscopique par vitesses radiales depuis le sol', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('96700789-d5f6-4600-aa22-f60cb96911da', '49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'Quel incident critique a frappé Kepler en avril 2016 juste avant le début de la Campagne 9 de K2 ?', 'En avril 2016, Kepler est entré en Emergency Mode ; les ingénieurs ont réussi à le récupérer rapidement pour préserver ses réserves limitées d''hydrazine.', 8)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f3cb5788-40eb-4811-88a6-d9d0b7bf5909', '96700789-d5f6-4600-aa22-f60cb96911da', 'Le passage inopiné en mode de secours (Emergency Mode), le niveau d''alerte le plus critique et le plus gourmand en carburant', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('ff354ff0-29e9-4999-b98b-89cf9fb7a5cf', '96700789-d5f6-4600-aa22-f60cb96911da', 'La perte du troisième panneau solaire', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e0727c83-d70f-46ff-866c-95703266a034', '96700789-d5f6-4600-aa22-f60cb96911da', 'Une collision avec un astéroïde géocroiseur', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('c0576f9e-877d-496c-bc81-971e124cde1c', '96700789-d5f6-4600-aa22-f60cb96911da', 'L''effacement définitif de toute la mémoire de bord', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a107f715-9a5e-46f2-81d0-d6c260073292', '49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'Comment la méthode des variations de chronométrage des transits (TTV - Transit Timing Variations) a-t-elle permis à Kepler de caractériser des systèmes multiplanétaires ? (Plusieurs bonnes réponses)', 'Les TTV exploitent les interactions gravitationnelles mutuelles (notamment près des résonances orbitales) pour déterminer les masses planétaires.', 9)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('905744db-9a81-4705-836f-798a27de1405', 'a107f715-9a5e-46f2-81d0-d6c260073292', 'En mesurant les avances ou retards des instants de transit causés par les perturbations gravitationnelles entre planètes ET En permettant de déduire les masses des planètes sans recourir aux vitesses radiales ET En détectant parfois des planètes supplémentaires non transitantes dans le même système', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('443bdfd4-5932-45c7-ba10-0be5473b72a3', 'a107f715-9a5e-46f2-81d0-d6c260073292', 'En mesurant le décalage vers le rouge cosmologique des galaxies lointaines ET En pesant directement le télescope Kepler grâce aux marées lunaires', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('cadc39f9-e933-45cf-a455-cad1b5f8c9bd', 'a107f715-9a5e-46f2-81d0-d6c260073292', 'En mesurant les avances ou retards des instants de transit causés par les perturbations gravitationnelles entre planètes', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('c695da4e-4314-48bf-886f-80a244f04bca', '49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'Associe chaque paramètre technique de Kepler à sa valeur ou description.', 'Kepler combinait une large bande passante (420–900 nm) et deux cadences d''intégration (29,4 min et 58,85 s).', 10)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f5d67c2f-1f85-4896-b5ee-106e09a7614e', 'c695da4e-4314-48bf-886f-80a244f04bca', 'Cadence longue (Long Cadence) = Intégration toutes les 29,4 minutes pour la majorité des ~150 000 cibles | Cadence courte (Short Cadence) = Intégration toutes les 58,85 secondes pour l''astérosismologie et les transits fins | Précision photométrique cible = 20 parties par million (ppm) sur 6,5 heures pour une étoile de magnitude 12 | Bande spectrale = Lumière visible large bande (420 à 900 nm) sans filtre', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('9cdff4ca-2f05-4756-8c4f-9f94f5b48d3e', 'c695da4e-4314-48bf-886f-80a244f04bca', 'Cadence longue (Long Cadence) = Intégration toutes les 58,85 secondes pour l''astérosismologie et les transits fins | Cadence courte (Short Cadence) = 20 parties par million (ppm) sur 6,5 heures pour une étoile de magnitude 12 | Précision photométrique cible = Lumière visible large bande (420 à 900 nm) sans filtre | Bande spectrale = Intégration toutes les 29,4 minutes pour la majorité des ~150 000 cibles', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('a0ca6d00-5100-4ca1-b9d4-baa9c08d5951', '49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'Quel artefact électronique sur plusieurs modules CCD de Kepler créait un motif d''interférence périodique variable avec la température ?', 'Un bruit haute fréquence dans les amplificateurs de lecture produisait des bandes mobiles (rolling band) que les pipelines ont dû modéliser.', 11)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('47fa6b99-5143-4f2c-a382-106c7f2a8bdc', 'a0ca6d00-5100-4ca1-b9d4-baa9c08d5951', 'Le bruit de moiré (rolling band) dans l''électronique de lecture des CCD', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('3b40f6ec-c1da-4700-8085-d7dc5cac2e6b', 'a0ca6d00-5100-4ca1-b9d4-baa9c08d5951', 'La congélation du liquide de refroidissement cryogénique à l''hélium', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('0ec5201a-f5b0-4462-87c6-7b49c3268154', 'a0ca6d00-5100-4ca1-b9d4-baa9c08d5951', 'La perte de la moitié des 42 capteurs dès la première semaine', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('971c0a6a-2f33-4f21-a987-4dea6ac529b8', 'a0ca6d00-5100-4ca1-b9d4-baa9c08d5951', 'L''éblouissement permanent par la lumière de Jupiter', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('00c07c38-482d-452c-95d5-1b98622212e6', '49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'Vrai ou faux : L''orbite héliocentrique de Kepler ayant une période d''environ 372,5 jours (légèrement supérieure à 1 an), le télescope s''éloignait progressivement de la Terre au fil des années.', 'Avec une période de 372,5 jours, Kepler prenait environ une semaine de retard par an sur la Terre, atteignant plus de 150 millions de km en 2018.', 12)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('13c57a3f-7a97-46fe-992a-f619111d799e', '00c07c38-482d-452c-95d5-1b98622212e6', 'Vrai', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2fc58735-2cf2-4022-aa74-a989a6aab81e', '00c07c38-482d-452c-95d5-1b98622212e6', 'Faux', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('459fef0d-df4a-4cd5-bc37-85f06bb132aa', '49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'Quelle commande finale a été envoyée à Kepler le 15 novembre 2018 (date anniversaire de la mort de Johannes Kepler) pour clore définitivement la mission ?', 'Le 15 novembre 2018, l''équipe a transmis les commandes finales (« Goodnight ») pour mettre en sommeil permanent le télescope sur son orbite héliocentrique.', 13)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('1550a425-2478-49aa-9830-bdbc82240c8e', '459fef0d-df4a-4cd5-bc37-85f06bb132aa', 'La commande « Goodnight » désactivant les modes de sécurité et coupant définitivement les émetteurs radio', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('a5dd1fc5-46fa-46f7-b0d1-8b5338fbaf01', '459fef0d-df4a-4cd5-bc37-85f06bb132aa', 'L''allumage des moteurs pour précipiter le télescope dans le Soleil', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('e56d7325-5da2-47b7-ae2c-ee98c4b7df50', '459fef0d-df4a-4cd5-bc37-85f06bb132aa', 'La séparation du miroir primaire et du bus électronique', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('248cfb31-0bbb-4a43-ab6a-c618469b7a82', '459fef0d-df4a-4cd5-bc37-85f06bb132aa', 'Le retour automatique vers la Station spatiale internationale', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('cb9cd562-439c-46d1-aeb2-c0fc13f39278', '49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'Quelles conclusions majeures sur la démographie des exoplanètes dans la Voie lactée découlent de l''analyse statistique de Kepler ? (Plusieurs bonnes réponses)', 'Kepler a démontré que les petites planètes (1–4 R⊕) dominent la population galactique et que les systèmes multiplanétaires sont généralement plats.', 14)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('8573178d-1f4e-4664-bcaa-421c243b1b76', 'cb9cd562-439c-46d1-aeb2-c0fc13f39278', 'Les planètes de taille comprise entre la Terre et Neptune (1 à 4 R⊕) sont beaucoup plus fréquentes que les géantes gazeuses ET Une fraction significative des étoiles de type solaire et des naines M abrite des planètes rocheuses dans leur zone habitable ET Les systèmes multiplanétaires compacts présentent généralement une faible inclinaison mutuelle (coplanarité élevée)', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('386bd9ee-3483-436d-8d51-e28d677aa7e8', 'cb9cd562-439c-46d1-aeb2-c0fc13f39278', 'Moins de 0,01 % des étoiles de la galaxie possèdent des planètes ET Toutes les exoplanètes orbitent dans le sens rétrograde par rapport à la rotation de leur étoile', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('f7f4fe1b-99d1-4b43-9e00-a618f06d6528', 'cb9cd562-439c-46d1-aeb2-c0fc13f39278', 'Les planètes de taille comprise entre la Terre et Neptune (1 à 4 R⊕) sont beaucoup plus fréquentes que les géantes gazeuses', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO "quiz_questions" ("id", "quizId", "prompt", "explanation", "sortOrder")
VALUES ('7853459f-a35f-47fb-8172-3c5dc0f20cb2', '49a0cf5e-17d6-4a40-a56e-cc849fce1cec', 'Combien d''étoiles environ Kepler a-t-il observées au total en additionnant sa mission primaire et les 19 campagnes de la mission K2 ?', 'Au total, Kepler a observé plus de 530 506 étoiles, détecté 2 662 planètes confirmées (à la fin de la mission) et documenté 61 supernovae.', 15)
ON CONFLICT ("id") DO UPDATE SET "prompt" = EXCLUDED."prompt", "explanation" = EXCLUDED."explanation", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('2bcb8b6e-a6e5-4062-98b7-b9258a6295e5', '7853459f-a35f-47fb-8172-3c5dc0f20cb2', 'Plus de 530 000 étoiles', true, 1)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('b15492eb-b4e2-49a1-b962-d3a7e2ddb792', '7853459f-a35f-47fb-8172-3c5dc0f20cb2', 'Environ 15 000 étoiles', false, 2)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('957057fc-2e68-4eef-a0c8-dc5ac5db3f8d', '7853459f-a35f-47fb-8172-3c5dc0f20cb2', 'Environ 50 000 étoiles', false, 3)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "quiz_options" ("id", "questionId", "label", "isCorrect", "sortOrder")
VALUES ('fc8b0964-4cc7-457d-8b23-f2e6d1fd8ecc', '7853459f-a35f-47fb-8172-3c5dc0f20cb2', 'Plus de 100 millions d''étoiles', false, 4)
ON CONFLICT ("id") DO UPDATE SET "label" = EXCLUDED."label", "isCorrect" = EXCLUDED."isCorrect", "sortOrder" = EXCLUDED."sortOrder";

COMMIT;

-- Summary: 24 quizzes, 354 questions, 1178 options generated.