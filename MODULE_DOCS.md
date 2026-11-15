# SPACE LEGACY — Guide Fonctionnel des Modules

> **À propos de ce document :**  
> Ce guide présente chaque brique (module) de l'application **SPACE LEGACY** sous un angle fonctionnel et concret. Vous n'y trouverez pas de jargon informatique ou de détails de code, mais une explication simple de **ce que chaque module permet de faire dans la vie de l'application**, accompagnée d'**exemples de cas d'usage situationnels** vécus par les élèves, passionnés d'astronomie, enseignants, rédacteurs et administrateurs.

---

## 🌌 Vision du Projet

**SPACE LEGACY** est une plateforme éducative dédiée aux engins spatiaux et artefacts que l'humanité (en particulier la NASA) a déposés sur la Lune, sur Mars et dans le reste du Système solaire (*thème NASA Space Apps : Abandoned but Not Forgotten*).  
L'objectif est de transformer ces machines silencieuses en ambassadrices vivantes de la science et de l'histoire, en garantissant une rigueur scientifique absolue et une traçabilité totale vers les archives de la NASA.

---

## 🧭 Sommaire des Modules

| Module | Fonction Usuelle | Destinataires Principaux |
|---|---|---|
| [1. Équipements (`equipment`)](#1-équipements-equipment) | Fiches complètes des engins spatiaux et de leurs composants | Grand public, Élèves, Rédacteurs |
| [2. Missions Spatiales (`missions`)](#2-missions-spatiales-missions) | Contexte historique et programmes d'exploration | Grand public, Enseignants |
| [3. Événements & Chronologie (`events`)](#3-événements--chronologie-events) | Moments historiques clés (atterrissages, exploits, fin de mission) | Grand public, Élèves |
| [4. Destinations & Corps Célestes (`celestial_bodies`)](#4-destinations--corps-célestes-celestial_bodies) | Découverte des astres où reposent les artefacts | Grand public, Élèves |
| [5. Lieux d'Atterrissage (`locations`)](#5-lieux-datterrissage-locations) | Localisation précise sur les cartes planétaires | Grand public, Passionnés |
| [6. Personnes & Équipages (`people`)](#6-personnes--équipages-people) | Hommage aux pionniers, astronautes et scientifiques | Grand public, Élèves |
| [7. Récits & Histoires (`stories`)](#7-récits--histoires-stories) | Articles vulgarisés et aventures narratives de ces machines | Grand public, Équipe éditoriale |
| [8. Médias & Photographies (`media`)](#8-médias--photographies-media) | Galerie d'images réelles, schémas et transparence IA | Grand public, Équipe éditoriale |
| [9. Données & Mesures (`measurements`)](#9-données--mesures-measurements) | Chiffres précis et relevés scientifiques | Lycéens, Étudiants, Enseignants |
| [10. Sources & Références (`sources`)](#10-sources--références-sources) | Vérification académique et liens officiels de la NASA | Chercheurs, Enseignants, Rédacteurs |
| [11. Sauvegarde & Archives (`archives`)](#11-sauvegarde--archives-archives) | Copie brute de sécurité des documents officiels d'origine | Rédacteurs, Historiens |
| [12. Catalogue & Exploration (`catalog`)](#12-catalogue--exploration-catalog) | Page d'accueil, moteur de recherche et vitrine globale | Tous les visiteurs |
| [13. Tableau de Bord (`dashboard`)](#13-tableau-de-bord-dashboard) | Vue d'ensemble et statistiques de gestion du site | Administrateurs, Rédacteurs en chef |
| [14. Sécurité & Comptes Rédacteurs (`auth`)](#14-sécurité--comptes-rédacteurs-auth) | Connexion, gestion des profils et protection contre les attaques | Équipe interne |
| [15. Journal d'Audit (`audit`)](#15-journal-daudit-audit) | Traçabilité des modifications et historique des décisions | Administrateurs |
| [16. Intégration de Données (`ingestion`)](#16-intégration-de-données-ingestion) | Chargement automatisé des catalogues d'engins spatiaux | Équipe technique & Gestionnaires |
| [17. Surveillance & Santé (`health`)](#17-surveillance--santé-health) | Contrôle continu de la disponibilité du service | Équipe d'exploitation |

---

## 1. Équipements (`equipment`)

### Ce que permet ce module (sens usuel)
C'est le **cœur vivant de SPACE LEGACY**. Ce module gère la carte d'identité complète de chaque engin, sonde, rover, atterrisseur ou instrument abandonné.  
Il permet de comprendre :
- Ce qu'est la machine (ses dimensions, son rôle premier, son statut actuel : *inactif*, *détruit*, *perdu*, etc.).
- Comment elle est construite grâce à une organisation "parent-enfant" (un rover principal et les instruments scientifiques qui y sont fixés).
- Tout ce qui lui est rattaché : où elle se trouve, qui l'a conçue, quelle mission l'a emportée et quelles photos en témoignent.

### Cas d'usage situationnels dans l'application
- **Le collégien curieux :** Thomas cherche la fiche du rover *Opportunity*. Il apprend qu'après 15 ans d'exploration martienne, le rover est devenu silencieux en 2018 suite à une tempête de poussière planétaire. En faisant défiler la fiche, il peut déplier les sous-équipements pour examiner la caméra panoramique *Pancam* ou le spectromètre miniature *Mini-TES*.
- **La recherche par statut :** Un passionné filtre l'application pour afficher uniquement les « engins qui ont fonctionné plus de 10 ans au-delà de leur durée prévue ». Le module lui présente immédiatement *Opportunity* et les sondes *Voyager*.

---

## 2. Missions Spatiales (`missions`)

### Ce que permet ce module (sens usuel)
Une machine ne part jamais seule dans l'espace : elle est le fruit d'un **programme spatial global**. Ce module raconte l'épopée de chaque mission, depuis le tir de la fusée jusqu'au terme officiel des opérations, en identifiant les agences spatiales participantes (NASA, ESA, etc.) et les objectifs fixés au départ.

### Cas d'usage situationnels dans l'application
- **L'enseignant d'histoire-géographie :** Mme Leroy prépare un cours sur la course à l'espace. Elle ouvre la page de la mission *Apollo 11*. Elle y trouve un résumé clair du contexte politique de 1969, la date de lancement, la date de retour, ainsi que la liste exhaustive de tout le matériel resté sur la surface lunaire (le module de descente *Eagle*, mais aussi le sismomètre passif et le réflecteur laser).
- **Le saut transversal :** Depuis la fiche de la mission *Mars Exploration Rover*, un visiteur clique sur un bouton pour voir simultanément les deux rovers jumeaux envoyés par cette expédition (*Spirit* et *Opportunity*).

---

## 3. Événements & Chronologie (`events`)

### Ce que permet ce module (sens usuel)
L'exploration spatiale est jalonnée d'instants palpitants : un atterrissage périlleux à suspense, un premier tour de roue, une découverte scientifique inattendue, une avarie technique ou un dernier message radio déchirant.  
Ce module offre une **frise chronologique vivante** de tous ces temps forts.

### Cas d'usage situationnels dans l'application
- **La découverte d'un exploit :** En consultant l'histoire de l'hélicoptère martien *Ingenuity*, une élève découvre la date magique du 19 avril 2021 : le tout premier vol motorisé et contrôlé de l'humanité dans l'atmosphère d'une autre planète.
- **La reconstitution d'un sauvetage :** Un passionné revit pas à pas l'incident d'*Apollo 13* grâce à une succession d'événements horodatés, reliant chaque problème survenu aux décisions prises par l'équipage et le centre de contrôle de Houston.

---

## 4. Destinations & Corps Célestes (`celestial_bodies`)

### Ce que permet ce module (sens usuel)
Ce module propose un **voyage géographique à travers notre Système solaire**. Il regroupe les artefacts par destination (la Lune, Mars, Vénus, Mercure, Titan, ou l'espace interplanétaire) et fournit la carte d'identité physique de chaque astre (sa gravité comparée à la Terre, sa composition de surface, son atmosphère, sa distance).

### Cas d'usage situationnels dans l'application
- **Le choix de destination :** Dès l'ouverture de l'application, un jeune internaute clique sur la planète rouge (Mars). La page s'ouvre sur un panorama de Mars avec son atmosphère raréfiée et affiche un compteur : *"14 engins répertoriés sur cette planète"*.
- **L'apprentissage comparatif :** Un élève apprend pourquoi les atterrisseurs lunaires n'avaient pas de parachute (absence d'atmosphère) contrairement aux atterrisseurs martiens, simplement en consultant la fiche du corps céleste "Lune" puis celle de "Mars".

---

## 5. Lieux d'Atterrissage (`locations`)

### Ce que permet ce module (sens usuel)
Ce module donne une **adresse précise** à chaque équipement abandonné. Il enregistre le nom des sites géographiques réels (cratères, vallées, plaines lunaires comme *la Mer de la Tranquillité*) ainsi que leurs coordonnées planétaires réelles (latitude et longitude martiennes ou sélénographiques).

### Cas d'usage situationnels dans l'application
- **Localiser un voisin sur Mars :** Un internaute explore le cratère *Jezero*. Il constate immédiatement que ce lieu abrite à la fois le rover *Perseverance* et son éclaireur ailé *Ingenuity*, tombés à quelques centaines de mètres l'un de l'autre.
- **Vérification cartographique :** Un astronome amateur pointant son télescope vers la plaine lunaire *Oceanus Procellarum* consulte SPACE LEGACY pour savoir exactement où s'est posée la sonde *Surveyor 3*, rejointe plus tard par les astronautes d'*Apollo 12*.

---

## 6. Personnes & Équipages (`people`)

### Ce que permet ce module (sens usuel)
Derrière chaque bout de métal posé sur un sol extraterrestre se cachent des femmes et des hommes d'exception. Ce module met en valeur :
- Les **astronautes** qui ont marché sur la Lune ou piloté les modules.
- Les **ingénieurs et concepteurs** qui ont inventé ces robots.
- Les **scientifiques et directeurs de vol** qui les ont guidés depuis la Terre.

### Cas d'usage situationnels dans l'application
- **Mettre un visage sur l'histoire :** Une collégienne lit la fiche de Margaret Hamilton et découvre comment ses programmes informatiques ont permis à l'atterrisseur *Apollo 11* de se poser sans encombre malgré une alerte radar.
- **Retrouver toutes les traces d'un astronaute :** En visitant le profil de Buzz Aldrin, un utilisateur voit tous les équipements qu'il a personnellement manipulés ou déployés sur la Lune lors de son expédition historique.

---

## 7. Récits & Histoires (`stories`)

### Ce que permet ce module (sens usuel)
Une fiche technique ne suffit pas à faire naître l'émotion. Ce module est la **revue éditoriale** de SPACE LEGACY : il permet à l'équipe de rédaction de publier des articles vivants, vulgarisés et passionnants.  
Il intègre un système de contrôle de qualité strict : un article est d'abord rédigé sous forme de *Brouillon*, soumis à la *Relecture*, puis *Publié* pour le grand public.

### Cas d'usage situationnels dans l'application
- **Une lecture au coin du feu :** Un passionné ouvre l'article à la une : *"Les derniers murmures d'Opportunity : l'histoire d'une machine devenue vivante"*. L'article est chapitré, enrichi de photographies d'époque et d'encadrés scientifiques vulgarisés.
- **Le travail d'équipe éditoriale :** Sarah, rédactrice bénévole, écrit un nouvel article sur la découverte des couches d'argile par *Curiosity*. Elle le passe en statut "En révision". Le rédacteur en chef le relit, valide l'exactitude des propos et le publie en un clic sur l'application.

---

## 8. Médias & Photographies (`media`)

### Ce que permet ce module (sens usuel)
L'espace doit se contempler. Ce module organise l'ensemble des **photographies d'archives, vidéos, schémas techniques et vues 3D**.  
Point capital d'éthique éducative : ce module assure une **transparence absolue sur la provenance des images**. Si une image est une vraie photo de la NASA, sa source officielle est mentionnée. S'il s'agit d'une reconstitution moderne ou générée par Intelligence Artificielle, un macaron visible prévient le lecteur : *"Reconstitution numérique / IA"*.

### Cas d'usage situationnels dans l'application
- **Le contrôle de l'authenticité :** Un élève regarde une image spectaculaire du rover *Opportunity* au bord d'un gouffre martien. L'étiquette de l'image lui confirme qu'il s'agit d'un cliché réel pris par la caméra d'*Opportunity*, daté de 2011.
- **La pédagogie visuelle :** Pour un engin posé avant l'ère des caméras numériques (comme *Surveyor 3*), une vue 3D éducative permet d'inspecter l'engin sous tous les angles sans tromper l'élève sur la nature du document.

---

## 9. Données & Mesures (`measurements`)

### Ce que permet ce module (sens usuel)
Pour les passionnés de science et les lycéens, ce module fournit les **chiffres exacts et mesurables** récoltés par les instruments spatiaux (températures extrêmes, composition atmosphérique, distance parcourue, masse de l'engin, vitesse de pénétration dans l'atmosphère).  
Ces données sont conservées avec une précision chirurgicale (jusqu'à 8 décimales) sans aucun arrondi trompeur.

### Cas d'usage situationnels dans l'application
- **L'exercice de physique-chimie :** Un lycéen prépare un exposé sur la mobilité martienne. Il consulte la distance totale officielle mesurée parcourue par *Opportunity* : **45,16 kilomètres**. Il peut la comparer précisément aux 28 kilomètres parcourus par *Curiosity*.
- **L'analyse environnementale :** Un étudiant consulte les relevés de pression atmosphérique enregistrés à la surface de Mars par les atterrisseurs *Viking 1* et *Viking 2* à la fin des années 1970.

---

## 10. Sources & Références (`sources`)

### Ce que permet ce module (sens usuel)
Dans une époque où circulent de fausses informations, SPACE LEGACY fait le choix d'une **transparence scientifique totale**. Chaque affirmation, date, coordonnée ou chiffre est relié à une publication officielle, un document d'archive de la NASA (JPL, NSSDCA) ou un rapport scientifique international.

### Cas d'usage situationnels dans l'application
- **La vérification par un journaliste ou un enseignant :** Un journaliste rédigeant un article sur les déchets lunaires consulte la fiche de l'atterrisseur *Surveyor 3*. Au bas de la page, un lien direct vers le catalogue officiel de la NASA (*NSSDCA Master Catalog*) lui permet de vérifier les données à la source en un clic.
- **La confiance des apprenants :** Les élèves apprennent la démarche scientifique en consultant directement les bulletins officiels de mission originaux.

---

## 11. Sauvegarde & Archives (`archives`)

### Ce que permet ce module (sens usuel)
Les pages web et documents d'origine sur internet peuvent être déplacés, modifiés ou disparaître avec le temps.  
Ce module agit comme un **coffre-fort patrimonial interne** : il stocke une copie exacte et inaltérable des pages et documents originaux de la NASA scrapés lors du lancement du projet. Si un site officiel devient indisponible, SPACE LEGACY conserve la trace intacte.

### Cas d'usage situationnels dans l'application
- **La résolution d'un doute historique :** Un rédacteur constate qu'un vieux lien du site de la NASA vers le journal de bord d'*Apollo 11* renvoie une erreur 404 (page introuvable). Il ouvre le module d'archives internes et retrouve le texte d'origine conservé mot à mot dans la base du projet.

---

## 12. Catalogue & Exploration (`catalog`)

### Ce que permet ce module (sens usuel)
Ce module est le **chef d'orchestre de l'expérience visiteur**. Il rassemble toutes les données de tous les modules pour fabriquer des pages fluides, spectaculaires et instantanées pour le grand public :
- La **page d'accueil** avec les découvertes du moment et les chiffres marquants.
- L'**explorateur de recherche** permettant de combiner plusieurs critères (par exemple : *"Montre-moi les rovers sur Mars lancés entre 2000 et 2010"*).
- La **galerie des destinations** pour naviguer planète par planète.

### Cas d'usage situationnels dans l'application
- **L'arrivée d'un nouvel internaute :** Lucas arrive sur SPACE LEGACY. En quelques secondes sur la page d'accueil, il voit le décompte des engins abandonnés, lit l'histoire du jour et clique sur l'explorateur pour filtrer les équipements par type (*Atterrisseur*, *Rover*, *Instrument*).
- **L'exploration thématique :** Une internaute souhaite préparer un exposé rapide sur "Tout ce que nous avons laissé sur la Lune". Elle sélectionne le filtre "Lune" dans le catalogue et obtient immédiatement une sélection ordonnée et illustrée.

---

## 13. Tableau de Bord (`dashboard`)

### Ce que permet ce module (sens usuel)
Ce module est la **tour de contrôle de l'équipe éditoriale et administrative**.  
Il offre une vue synthétique de l'état de la plateforme :
- Nombre d'équipements, de missions et d'histoires actuellement en ligne.
- Alertes sur le contenu (par exemple : articles en attente de relecture, fiches d'équipements sans photo ou sans source reliée).

### Cas d'usage situationnels dans l'application
- **Le rituel du matin du rédacteur en chef :** Marc se connecte à son espace d'administration. Il consulte ses indicateurs clés : *3 articles en attente de relecture*, *2 nouveaux équipements en cours de rédaction*, *100 % des fiches publiées disposent d'au moins une source officielle vérifiée*.

---

## 14. Sécurité & Comptes Rédacteurs (`auth`)

### Ce que permet ce module (sens usuel)
Ce module est le **gardien des portes de SPACE LEGACY**. Il gère la sécurité des personnes qui alimentent et gèrent la plateforme :
- Création et gestion des comptes de l'équipe avec des rôles précis (*Administrateur* avec tous les droits, ou *Rédacteur* concentré sur l'écriture).
- Mots de passe ultra-sécurisés et chiffrés.
- Protection contre les attaques de pirates (si quelqu'un tente de deviner un mot de passe en boucle, le système bloque automatiquement les tentatives).

### Cas d'usage situationnels dans l'application
- **L'intégration d'un nouveau rédacteur :** L'administrateur crée un compte pour Léa avec le rôle "Rédacteur". Léa se connecte en toute sécurité pour commencer à rédiger sans risquer de déconfigurer les paramètres système réservés à l'administrateur.
- **La protection contre les intrusions :** Un robot malveillant tente des centaines de mots de passe sur le compte d'un administrateur. Le module détecte immédiatement l'anomalie, verrouille temporairement l'accès et alerte l'équipe.

---

## 15. Journal d'Audit (`audit`)

### Ce que permet ce module (sens usuel)
Dans un projet à vocation éducative et scientifique, l'intégrité de l'information est sacrée. Ce module est le **registre officiel de toutes les actions effectuées** en coulisse :
- Qui a créé, modifié ou supprimé une fiche ?
- À quelle heure et quel jour ?
- Quelles étaient les données avant et après la modification ?

### Cas d'usage situationnels dans l'application
- **Le sauvetage d'une mauvaise manipulation :** Un rédacteur supprime par inadvertance un paragraphe crucial sur la fiche de *Viking 1*. L'administrateur consulte le journal d'audit, identifie la modification faite 10 minutes plus tôt et rétablit l'information d'origine sans perte.
- **La sérénité d'équipe :** Savoir que chaque modification est enregistrée permet à plusieurs rédacteurs de collaborer en toute confiance sans craindre d'écraser le travail des autres.

---

## 16. Intégration de Données (`ingestion`)

### Ce que permet ce module (sens usuel)
Au lieu de saisir manuellement des milliers d'engins, ce module est l'**aspirateur intelligent de l'application**. Il prend les gros dossiers de données brutes préparés par l'équipe scientifique (les catalogues JSON de la NASA) et les injecte automatiquement dans la base de données.  
Il vérifie que chaque information est valide, évite les doublons et consigne un rapport d'exécution complet.

### Cas d'usage situationnels dans l'application
- **Le chargement initial des sondes historiques :** L'équipe technique importe en une seule fois les données de 5 équipements mythiques (*Opportunity, Surveyor 3, Apollo 11, Ingenuity, Viking 1*). Le module traite les milliers de points de données en quelques secondes et confirme que chaque équipement est prêt à être enrichi par les rédacteurs.

---

## 17. Surveillance & Santé (`health`)

### Ce que permet ce module (sens usuel)
C'est le **médecin de garde de SPACE LEGACY**. Fonctionnant 24h/24 et 7j/7, ce module répond aux robots de surveillance pour garantir que le serveur est bien réveillé, que les pages se chargent rapidement et que la base de données répond au quart de tour.

### Cas d'usage situationnels dans l'application
- **La détection avant les utilisateurs :** Si un incident survient sur la base de données au milieu de la nuit, le module de santé déclenche une alerte automatique. L'incident peut être résolu avant même que les premiers écoliers ne se connectent le matin.

---

## 🗃️ Fonctionnalités gardées en réserve (`legacy/`)

Pour garantir que la version actuelle soit d'une fiabilité et d'une simplicité irréprochables, certaines idées passionnantes ont été soigneusement **mises de côté dans un espace dédié** (`legacy/`) pour de futures évolutions, sans encombrer la version en cours :
- **Quiz et défis éducatifs :** Des jeux de questions-réponses pour tester les connaissances des élèves.
- **Espace communautaire et commentaires :** Forums de discussion entre passionnés et retours des visiteurs.
- **Cartographie 3D interactive en temps réel :** Navigation en globe 3D virtuel sur les planètes.
- **Agent d'assistance par Intelligence Artificielle :** Outils d'aide à la génération automatique d'ébauches d'articles.

---

## 📋 Tableau Récapitulatif : Les Parcours Utilisateurs

| Je souhaite... | Modules qui travaillent ensemble pour moi |
|---|---|
| **Découvrir l'histoire émouvante d'un rover abandonné** | `catalog` (Recherche) ➔ `equipment` (Fiche) ➔ `stories` (Récit) ➔ `media` (Photos) |
| **Comprendre où et comment s'est posée une sonde** | `locations` (Coordonnées) ➔ `celestial_bodies` (Astre) ➔ `events` (Atterrissage) |
| **Vérifier un chiffre pour un exposé ou un article** | `measurements` (Données brutes) ➔ `sources` (Lien officiel NASA) ➔ `archives` (Preuve originelle) |
| **Découvrir les héros et héroïnes qui ont fait la mission** | `people` (Biographies) ➔ `missions` (Programme global) ➔ `equipment` (Machines conçues) |
| **Rédiger, relire et valider un nouvel article** | `auth` (Connexion) ➔ `stories` (Édition & Statut) ➔ `dashboard` (Vue globale) ➔ `audit` (Historique) |
| **Assurer la disponibilité et la sécurité du site** | `health` (Surveillance) ➔ `auth` (Protection anti-intrusion) ➔ `audit` (Journalisation) |

---
*Document maintenu par l'équipe d'ingénierie SPACE LEGACY — Dernière mise à jour : Novembre 2026.*
