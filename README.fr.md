# SPACE LEGACY

> **« Chaque objet a une histoire. Chaque mission laisse un héritage. »**

---

## 1. Le Défi et la Problématique

L'exploration spatiale humaine a laissé des empreintes extraordinaires à travers le système solaire. Des atterrisseurs pionniers aux rovers automatisés, des dizaines d'engins historiques reposent aujourd'hui silencieusement dans la poussière lunaire et le régolithe martien — abandonnés mais porteurs du génie scientifique de l'humanité.

Pour les jeunes passionnés d'astronomie et d'espace, cette mémoire technique reste trop souvent méconnue, dispersée dans des archives denses et des catalogues scientifiques austères.

**SPACE LEGACY** fait revivre cet héritage : traduire des données historiques et scientifiques complexes en un récit captivant, accessible et pédagogique pour la prochaine génération d'explorateurs.

---

## 2. Notre Solution

SPACE LEGACY redonne vie aux missions abandonnées sur la Lune et Mars :
- **Exactitude et Traçabilité :** Chaque fait, coordonnée, date et découverte est relié à des sources officielles vérifiées de la NASA et du JPL.
- **Transparence et Étiquetage de l'IA :** Lorsque l'intelligence artificielle est sollicitée pour reconstituer des séquences vidéo ou des chroniques narratives, elle est explicitement identifiée avec un label `AI-GEN`. Les photographies historiques authentiques de la NASA sont valorisées et préservées.
- **Récit Immersif :** Revivez les étapes clés de la mission, les découvertes scientifiques majeures et le repos silencieux de ces ambassadeurs de la Terre sur la Lune et sur Mars.

---

## 3. Parcours Utilisateur

1. **Explorer la Lune et Mars :** Parcourez le catalogue planétaire et filtrez les engins par statut opérationnel, décennie d'arrivée ou type de véhicule.
2. **Consulter la Fiche de l'Engin :** Découvrez les caractéristiques techniques détaillées, la mission historique, les chiffres clés et la chronologie des événements.
3. **Lire le Journal de Bord :** Suivez les récits de mission immersifs et les vidéos documentant la trajectoire de l'engin jusqu'à sa dernière transmission.
4. **Jouer aux Quiz et Débloquer des Badges :** Testez vos connaissances scientifiques, obtenez des distinctions (*Pionnier Lunaire*, *Expert Curiosity*) et mesurez votre progression.
5. **Sauvegarder Votre Progression :** Commencez instantanément en visiteur anonyme, puis associez votre historique à un compte permanent à tout moment sans perte de données.

---

## 4. Démarrage Rapide

### Prérequis
- Node.js (v20 ou supérieur)
- pnpm (v9 ou supérieur)
- PostgreSQL (v16)

### Commandes Essentielles
```bash
# 1. Installation des dépendances
pnpm install

# 2. Configuration de l'environnement
cp .env.example .env

# 3. Initialisation de la base de données et chargement des données authentiques NASA
pnpm db:migrate
pnpm db:seed

# 4. Lancement de la plateforme
pnpm dev
```

Une fois démarrée, l'application est disponible :
- **API Publique :** `http://localhost:3333/api/v1`
- **Dashboard Mission Control (Admin) :** `http://localhost:3333/admin`
- **Sonde de Disponibilité :** `http://localhost:3333/health/live`

### Déploiement Cloud (Vercel & Neon PostgreSQL)
Le backend est prêt pour le cloud et déployable directement sur **Vercel** en Serverless avec **Neon PostgreSQL**.
- Convertissez vos certificats SSL pour le runtime serverless avec `node scripts/convert_ca_to_string.js ca.pem`.
- Définissez `DATABASE_URL` et `CA_STRING` dans les variables d'environnement Vercel.
- Consultez [docs/RUNBOOK.md](file:///home/pavel/Documents/Dev/NASA/SPACE%20LEGACY/Apps/server/docs/RUNBOOK.md) pour les instructions complètes.

---

## 5. Perspectives d'Évolution

- **Au-delà de la Lune et de Mars :** Élargissement du catalogue à Vénus, Titan, aux comètes et aux sondes de l'espace lointain (Voyager, New Horizons).
- **Enrichissement du Matériel :** Intégration des étages de descente, des réflecteurs laser et du matériel des partenaires internationaux.
- **Accessibilité Globale :** Traduction multilingue complète de l'interface et des fiches engins.
- **Télémétrie 3D Interactive :** Reconstitution des trajectoires d'atterrissage et visualisation cartographique 3D des sites d'exploration.

---

## 6. Transparence et Déclarations

- **Sources des Données :** Les informations scientifiques et chronologiques proviennent directement des dépôts documentaires de la NASA et du JPL (`nasa.gov`, `jpl.nasa.gov`).
- **Déclaration d'Usage de l'IA :** Space Legacy utilise l'IA uniquement pour la génération de récits narratifs et de vidéos pédagogiques illustratives. Tout contenu généré porte la mention claire `AI-GEN`.
- **Indépendance :** Projet réalisé dans le cadre du défi NASA Space Apps Challenge 2026 (*Abandoned but Not Forgotten*). Initiative éducative indépendante non affiliée institutionnellement à la NASA.
