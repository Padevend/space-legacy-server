# Perspectives & Évolutions Futures (PERSPECTIVES.md)

Ce document consigne les fonctionnalités et extensions architecturales **explicitement exclues du périmètre MVP** (conformément à la règle normative **N1**), afin de préserver la simplicité, la stabilité et l'exactitude du produit initial.

---

## 1. Destinations et Données Célestes
- **Autres corps célestes :** Extension de l'exploration au-delà de la Lune et de Mars : Vénus (programme Venera), Mercure (MESSENGER, BepiColombo), les lunes de Jupiter et Saturne (Titan, Europe, Encelade), les astéroïdes (Bennu, Ryugu, Éros) et les sondes de l'espace lointain (Voyager 1 & 2, Pioneer 10 & 11, New Horizons).
- **Cartographie 3D interactive temps réel :** Rendu WebGL de globes planétaires avec survol des sites d'atterrissage et trajectoires orbitales.
- **Visualisation des débris spatiaux en orbite :** Module de suivi des étages supérieurs et satellites hors service en orbite terrestre basse et géostationnaire.

## 2. Identité & Engagement Communautaire
- **Vérification d'e-mail :** Envoi de courriels transactionnels de confirmation d'adresse à l'inscription.
- **Réinitialisation de mot de passe autonome :** Flux de réinitialisation sécurisé par lien temporaire avec jeton à usage unique.
- **Commentaires et espace d'échange :** Espace de discussion modéré sous les fiches de machines et les articles de journal de bord.
- **Classements publics & concours :** Tableaux d'honneur des badges et quiz, concours inter-écoles ou défis mensuels.
- **Connexion sociale :** Authentification tierce (OAuth2 Google, GitHub, Apple).

## 3. Éducation & Ludification Avancée
- **Défis éducatifs guidés :** Parcours d'apprentissage thématiques pour les enseignants avec fiches de travaux pratiques imprimables.
- **Mini-jeux immersifs :** Simulateur simplifié d'alunissage ou de pilotage de bras robotique de rover martien.
- **Exportation de diplômes / attestations :** Certificat PDF personnalisé attestant des badges obtenus lors du parcours.

## 4. Internationalisation & Accessibilité
- **Traduction multilingue :** Support complet de l'anglais, de l'espagnol et d'autres langues pour l'ensemble des données, fiches et quiz.
- **Accessibilité avancée (RGAA / WCAG AAA) :** Narration audio intégrée des articles et descriptions textuelles enrichies pour déficients visuels.
- **Application mobile native :** Déclinaison sur iOS et Android avec mode hors-ligne pour les visites de musées et de centres spatiaux.

## 5. Infrastructure & Sécurité Étendue
- **Analyse antivirus ClamAV :** Implémentation du `MalwareScanner` connecté à un démon ClamAV pour l'analyse des fichiers ZIP et médias téléversés.
- **Stockage objet distribué S3 / Cloud Storage :** Remplacement du stockage d'images local par des buckets S3 avec CDN dédié et signatures d'URL.
- **Cache distribué Redis :** Remplacement du stockage en mémoire du rate-limiter par une grappe Redis pour les déploiements multi-instances.
- **Intégration d'un agent de génération IA local :** Capacité d'exécuter localement des modèles de transcription audio et de synthèse d'articles sans dépendance vers le service Python externe.
