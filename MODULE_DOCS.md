# SPACE LEGACY — Guide Fonctionnel des Modules du MVP

> **À propos de ce document :**  
> Ce guide présente chaque module de l'application **SPACE LEGACY** sous un angle fonctionnel, accessible et concret. Vous n'y trouverez ni jargon technique ni détails de code, mais une explication claire et vivante de **ce que chaque brique permet d'accomplir dans l'expérience utilisateur**, accompagnée d'**exemples de cas d'usage situationnels** vécus par les élèves, passionnés d'astronomie, enseignants et médiateurs scientifiques.

---

## 🌌 Vision du Projet

Dans le cadre du défi **NASA Space Apps Challenge 2026** (*Abandoned but Not Forgotten*), **SPACE LEGACY** est une plateforme éducative dédiée aux artefacts, engins et instruments scientifiques laissés par l'humanité sur la Lune et sur Mars.  
Le projet donne une voix à ce patrimoine spatial immobile à travers des fiches historiques vérifiées, des récits passionnants en journal de bord, des vidéos immersives et des quiz éducatifs récompensés par des badges.

---

## 🧭 Sommaire des Modules

| Module | Rôle Fonctionnel Usuel | Destinataires Principaux |
|---|---|---|
| [1. Destinations Célestes (`celestial_bodies`)](#1-destinations-célestes-celestial_bodies) | Choix de l'astre à explorer (Lune ou Mars) | Tous les visiteurs, Élèves |
| [2. Explorateur d'Engins (`machines`)](#2-explorateur-dengins-machines) | Catalogue des machines, recherche, facettes et fiches complètes | Élèves, Enseignants, Passionnés |
| [3. Journal de Bord (`logbook`)](#3-journal-de-bord-logbook) | Récits d'aventures spatiales, articles détaillés et vidéos immersives | Grand public, Jeunes curieux |
| [4. Espace Ludique & Défis (`games`)](#4-espace-ludique--défis-games) | Quiz interactifs par niveau et collection de badges de réussite | Élèves, Joueurs, Classes |
| [5. Compte & Progression (`identity`)](#5-compte--progression-identity) | Découverte anonyme immédiate, sauvegarde de progression et respect absolu de la vie privée | Tous les utilisateurs |
| [6. Intégration d'Archives (`ingestion`)](#6-intégration-darchives-ingestion) | Chargement contrôlé et sécurisé de nouveaux dossiers documentaires | Équipe éditoriale & Technique |
| [7. Studio de Création Multimédia (`generation`)](#7-studio-de-création-multimédia-generation) | Génération assistée par IA de vidéos de synthèse et de premiers jets d'articles | Médiateurs scientifiques, Rédacteurs |
| [8. Tableau de Bord d'Édition (`dashboard`)](#8-tableau-de-bord-dédition-dashboard) | Pilotage des publications, relecture humaine et suivi de la plateforme | Administrateurs, Modérateurs |
| [9. Surveillance & Disponibilité (`health`)](#9-surveillance--disponibilité-health) | Contrôle continu de la bonne santé du service | Équipe d'exploitation |

---

## 1. Destinations Célestes (`celestial_bodies`)

### Ce que permet ce module (sens usuel)
Il sert de **point de départ au voyage spatial**. Il présente les corps célestes accessibles dans le catalogue (actuellement la **Lune** et **Mars**), avec leurs caractéristiques astronomiques essentielles (distance, description vulgarisée, illustration visuelle).

### Cas d'usage situationnels
- **Le premier contact de l'élève :** En arrivant sur l'application, Léa (11 ans) choisit entre les cratères lunaires grisés et les étendues rouges de Mars. En un clic sur la Lune, elle accède directement à l'ensemble du matériel déposé sur notre satellite naturel depuis les missions Apollo et Surveyor.
- **Le filtrage géographique :** Un enseignant en sciences physiques demande à ses élèves de comparer le sort des atterrisseurs lunaires (sans atmosphère) et des rovers martiens (exposés aux tempêtes de sable). Le module fournit ce découpage naturel.

---

## 2. Explorateur d'Engins (`machines`)

### Ce que permet ce module (sens usuel)
C'est le **musée virtuel des explorateurs abandonnés**. Il permet de :
- Parcourir la collection d'engins spatiaux avec des filtres combinés (par corps céleste, par type d'engin : *rover*, *atterrisseur*, *module orbital*, par état opérationnel : *mission accomplie*, *silencieux*, *opérationnel*).
- Voir immédiatement le nombre d'engins correspondant à chaque critère grâce aux compteurs dynamiques (facettes).
- Rechercher un engin par son nom ou son surnom (ex: *Eagle*, *Curiosity*, *Perseverance*).
- Consulter une **fiche d'identité exhaustive** comprenant les faits scientifiques vérifiés, la chronologie des grands moments historiques (lancement, atterrissage, fin d'émission), une galerie photographique d'époque et les liens officiels vers les archives de la NASA.

### Cas d'usage situationnels
- **L'enquête historique :** Lucas cherche quel a été le tout premier atterrisseur américain à réussir un posé doux sur la Lune. Il applique le filtre *Lune* et *Atterrisseur*, puis trie par date : il découvre la fiche de *Surveyor 1* (1966), ses photos transmises par télévision et sa localisation dans l'Océan des Tempêtes.
- **La vérification de rigueur scientifique :** Une lycéenne prépare un exposé. Pour chaque affirmation lue sur la fiche du rover *Perseverance*, elle clique sur la source officielle (`science.nasa.gov`) affichée en bas de page pour vérifier le fait directement à la source.

---

## 3. Journal de Bord (`logbook`)

### Ce que permet ce module (sens usuel)
Le journal de bord transforme des fiches techniques en **récits d'aventure captivants**. Pour chaque machine, il propose un ou plusieurs chapitres narratifs accompagnés d'une **vidéo explicative** et d'un **article en texte riche** qui plongent le lecteur au cœur de la mission.

### Cas d'usage situationnels
- **L'immersion à suspense :** En consultant la fiche d'Apollo 11, un passionné ouvre le journal de bord *« Tranquility Base: One Giant Leap »*. Il lit le récit minute par minute des alarmes informatiques 1202 et de la recherche manuelle d'une zone plane par Neil Armstrong, puis lance la vidéo d'archive synchronisée pour revivre l'alunissage.
- **La découverte des rovers martiens :** Un élève regarde la capsule vidéo de 3 minutes sur les célèbres *« 7 minutes de terreur »* de l'atterrissage de *Curiosity*, expliquant comment la grue spatiale (Sky Crane) a déposé le robot sur Mars.

---

## 4. Espace Ludique & Défis (`games`)

### Ce que permet ce module (sens usuel)
Il transforme la visite en une **aventure ludique et motivante**. Il offre :
- Des **quiz thématiques** classés par difficulté (*Découverte* pour les plus jeunes, *Expert* pour les passionnés chevronnés), reliés aux astres ou à des engins précis.
- Un système de notation équitable qui calcule le score et fournit des explications scientifiques pour chaque question après validation.
- L'attribution automatique de **badges de réussite illustrés** récompensant l'assiduité, les premiers pas et les sans-fautes.

### Cas d'usage situationnels
- **Le défi en classe :** À la fin d'un atelier d'astronomie, l'animateur lance le quiz *« Premiers pas lunaires »*. Les élèves répondent aux questions depuis leur tablette. Ceux qui obtiennent un score parfait débloquent immédiatement le badge doré *« Premier Pas »*.
- **La collection personnelle :** Un jeune joueur consulte son tableau de progression : il voit qu'il a déjà décroché le badge *« Explorateur Martien »* et tente un nouveau quiz difficile pour remporter le badge *« Maître du Système Solaire »*.

---

## 5. Compte & Progression (`identity`)

### Ce que permet ce module (sens usuel)
Ce module garantit une expérience fluide, **sans barrière à l'entrée et respectueuse de la vie privée** :
- **Accueil sans inscription :** Tout nouvel arrivant peut immédiatement explorer, jouer aux quiz et accumuler des badges sans formulaire ni mot de passe (session anonyme).
- **Sauvegarde et fusion transparente :** Si le visiteur décide plus tard de créer un compte (ou de se connecter à son compte existant), **tous ses badges et scores obtenus en mode anonyme sont automatiquement fusionnés et conservés**.
- **Droit à l'oubli réel :** L'utilisateur peut à tout instant supprimer son compte en tapant son mot de passe et le mot « DELETE » ; toutes ses données personnelles, sessions et historiques sont alors physiquement et définitivement effacés.

### Cas d'usage situationnels
- **La transition sans friction :** Maxime découvre l'application sur son smartphone dans le train. Il réussit deux quiz et gagne un badge. Arrivé chez lui, il clique sur « Sauvegarder ma progression », renseigne son e-mail et son mot de passe : son compte est créé et ses exploits sont immédiatement rattachés sans rien recommencer.
- **La sérénité d'un parent ou d'une école :** Un professeur fait utiliser la plateforme à sa classe sans demander d'adresses e-mail aux élèves : les sessions anonymes permettent un usage éducatif complet conforme aux normes de protection de l'enfance.

---

## 6. Intégration d'Archives (`ingestion`)

### Ce que permet ce module (sens usuel)
Il permet d'enrichir la base de connaissances en **important des dossiers d'archives complets (fichiers ZIP)** préparés par les scientifiques ou les équipes documentaires.  
Il inspecte scrupuleusement le contenu du fichier (textes, images, sources, quiz) pour garantir qu'aucune donnée malveillante, fausse ou corrompue ne pénètre dans l'application.

### Cas d'usage situationnels
- **L'ajout d'une nouvelle expédition :** La documentaliste prépare un lot documentaire contenant les fiches, photos haute définition et sources officielles du rover *Viking 2*. Elle dépose le fichier ZIP dans l'espace d'importation : le système vérifie chaque source NASA et chaque photo, puis intègre l'ensemble de façon propre et instantanée.
- **Le filet de sécurité :** Si un contributeur tente par erreur d'importer une photo au format non autorisé ou une fiche dont les affirmations ne citent aucune source officielle, le système bloque l'opération et affiche un rapport limpide signalant exactement la ligne à corriger.

---

## 7. Studio de Création Multimédia (`generation`)

### Ce que permet ce module (sens usuel)
Il fait le pont avec un service d'intelligence artificielle spécialisé afin d'**aider les médiateurs scientifiques à vulgariser le contenu** :
- Génération d'une ébauche d'article à partir des faits officiels de la machine.
- Montage d'une vidéo de synthèse illustrative.
- **Transparence et contrôle humain absolu :** Tout contenu généré porte la mention claire « Généré » et reste en brouillon invisible pour le public tant qu'un relecteur humain ne l'a pas relu, corrigé et explicitement validé.

### Cas d'usage situationnels
- **Le coup de pouce à la rédaction :** Un médiateur souhaite créer un chapitre du journal de bord sur le robot martien *Ingenuity*. Il clique sur « Générer une ébauche ». En quelques secondes, le studio synthétise les faits techniques en un premier récit fluide. Le médiateur affine les phrases, ajuste le ton et valide la publication.
- **Le suivi des tâches longues :** La génération vidéo prenant quelques minutes, le rédacteur peut suivre la progression en temps réel (en attente, en cours, terminé) sans bloquer sa navigation.

---

## 8. Tableau de Bord d'Édition (`dashboard`)

### Ce que permet ce module (sens usuel)
C'est le **centre de contrôle des administrateurs et des éditeurs**. Organisé en sections thématiques et ergonomiques, il permet de :
- Consulter en un coup d'œil les indicateurs clés (nombre d'engins en ligne, quiz actifs, contenus en attente de relecture).
- Modifier n'importe quel fait, image, événement ou chapitre de journal de bord par petites retouches ciblées, sans risque d'écraser le reste du travail.
- Mettre en ligne ou retirer temporairement un contenu d'un simple basculement.

### Cas d'usage situationnels
- **La mise à jour d'un statut :** La NASA annonce une nouvelle étape pour un instrument encore actif sur Mars. L'administrateur ouvre l'onglet « Chronologie » de la machine concernée, ajoute l'événement avec sa source officielle, et sauvegarde immédiatement cette seule modification.
- **La modération avant publication :** L'équipe éditoriale examine tous les articles marqués comme brouillons, vérifie l'exactitude des informations et publie ceux qui sont prêts pour les scolaires.

---

## 9. Surveillance & Disponibilité (`health`)

### Ce que permet ce module (sens usuel)
C'est la **vigie technique silencieuse**. Il vérifie à chaque seconde que la base de données répond correctement et que l'application est prête à servir les élèves et les enseignants dans le monde entier sans interruption.

### Cas d'usage situationnels
- **La reprise automatique après maintenance :** Lors d'un redémarrage ou d'une mise à jour de l'infrastructure, le module s'assure que toutes les connexions sont parfaitement opérationnelles avant d'autoriser l'arrivée des visiteurs.
