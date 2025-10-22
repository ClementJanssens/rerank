export const PROMPTS = {
    generatePlanFromMarkdown: (markdown: string) => `
Je vais te fournir le contenu Markdown d'une page web/article : 

\`\`\`markdown
${markdown}
\`\`\`

Analyse la page web et a partir de son contenu,genere moi le plan d'un article optimisé pour le SEO.

**Important:** Retourne le plan et **uniquement** le plan.
`,

    generateFinalPlan: (mainKeyword: string, intention: string, aggregatedPlans: string) => `
Tu es un expert en Content Strategy SEO niveau entreprise, spécialisé dans l'analyse concurrentielle avancée et la création de contenus dominants sur SERP.

MISSION : Créer un plan de contenu SEO ADAPTATIF qui surpassera tous les concurrents pour le mot clef : ${mainKeyword} basé sur une étude la SERP et des concurrents.

PHASE 1 - DÉTECTION AUTOMATIQUE DU FORMAT OPTIMAL

Tu détectes le format idéal du plan en te basant sur l'intention de recherche : "${intention}" :

"Comment/How-to" → Format guide pratique étape-par-étape
"Meilleurs/Top/Best" → Format listicle comparatif
"Qu'est-ce que/What is" → Format informatif/définition
"Pourquoi/Why" → Format argumentaire/bénéfices
"Choisir/Vs/Comparison" → Format comparatif/guide achat
"Exemples/Examples" → Format case studies/illustrations

PHASE 2 - ANALYSE CONCURRENTIELLE STRATIFIÉE
Pour chaque concurrent du top 5, identifie :

Structure H2/H3 complète utilisée
Format adopté (guide/listicle/comparatif/informatif)
Angle d'approche unique
Longueur approximative et profondeur de traitement
Points forts à surpasser
Lacunes de contenu exploitables
Éléments différenciants entre eux

Meta-analyse des patterns :

Format dominant : Quel type de structure performe le mieux ?
H2 récurrents : Quels sujets sont systématiquement couverts ?
Angles manqués : Quelles perspectives ne sont pas explorées ?
Opportunités de différenciation : Comment se démarquer structurellement ?

PHASE 3 - INTENTION DE RECHERCHE MULTIDIMENSIONNELLE
Déconstruction de l'intention primaire :

Besoin explicite : Que demande littéralement l'utilisateur ?
Niveau d'expertise : Débutant/Intermédiaire/Avancé ?
Résultat attendu : Information/Action/Décision ?
Contexte d'usage : Quand/Comment sera utilisée cette info ?

Intentions secondaires cachées :

Questions connexes non exprimées mais nécessaires
Préoccupations sous-jacentes (coût, temps, difficulté, risques)
Étapes suivantes logiques dans le parcours utilisateur
Objections potentielles à anticiper et traiter

PHASE 4 - CRÉATION DE LA STRUCTURE ADAPTATIVE SUPÉRIEURE
Template adapté au format optimal détecté :
SI FORMAT GUIDE PRATIQUE :
H1: [Action] en [délai/étapes] : Guide [niveau] 2025
Introduction → Prérequis/Outils → Étapes détaillées → Conseils avancés → Erreurs courantes → Résultats attendus → Conclusion
SI FORMAT LISTICLE :
H1: Top X [éléments] pour [objectif] en 2025 [+ bénéfice]
Introduction → Méthodologie de sélection → Liste numérotée (avec sous-sections) → Comparaison synthèse → Recommandation finale → Conclusion
SI FORMAT INFORMATIF :
H1: [Concept] : Tout savoir en 2025 [Guide complet]
Introduction → Définition claire → Fonctionnement → Types/Catégories → Avantages/Inconvénients → Applications pratiques → Tendances 2025 → Conclusion
SI FORMAT COMPARATIF :
H1: [Option A] vs [Option B] : Comparatif complet 2025
Introduction → Critères de comparaison → Analyse détaillée → Cas d'usage recommandés → Verdict final → Conclusion
Optimisations transversales intégrées :

Featured Snippet : Premier H2 avec réponse directe en 40-50 mots
People Also Ask : H3 formulés comme questions connexes
Semantic richness : Vocabulaire sectoriel naturellement distribué
Long-tail coverage : Variations du mot-clé dans les sous-titres
User journey progression : Structure logique débutant → expert

PHASE 5 - DIFFÉRENCIATION CONCURRENTIELLE
Éléments uniques à intégrer :

Section exclusive non couverte par les concurrents
Angle innovant sur un sujet classique
Ressources complémentaires (outils, templates, checklists)
Perspective 2024/2025 sur les évolutions du domaine
Exemples concrets et études de cas récentes

Stratégies de surpassement :
✅ Comprehensive : 15-25% plus complet que le concurrent le plus long
✅ Deeper : Chaque section 20% plus détaillée que la moyenne concurrentielle
✅ Actionable : Éléments pratiques immédiatement applicables
✅ Current : Intégration perspectives actuelles et futures
✅ Authoritative : Signaux d'expertise et citations sources
✅ User-centric : Répond aux questions non résolues par la concurrence

PHASE 6 - GENERATION DU PLAN
Basé sur tous les éléments recueillis lors des étapes précédente, génère une structure d'article (plan) qui répond aux criteres suivants : 

✅ Format parfaitement adapté à l'intention de recherche
✅ Structure surpasse tous les concurrents du top 5
✅ Couverture complète + éléments différenciants uniques
✅ Optimisation Featured Snippet et PAA intégrée
✅ Progression logique et expérience utilisateur optimale
✅ Signaux d'autorité et de fraîcheur maximisés

Profondeur : 4 H2 principaux (équilibre exhaustivité/lisibilité)
Granularité : 2-3 H3 maximum par H2 selon la complexité
Value density : Information actionnable dans chaque section
Différenciation : Au minimum 2 angles uniques vs concurrence

En suivant cette méthode, tu génères le plan complet d'un article SEO optimisé pour le mot clef : ${mainKeyword}

Important: Tu répondras uniquement avec le plan au format markdown, rien d'autre.

Voici les structures des 5 premiers resultats de la SERP pour le mot clef ${mainKeyword} :
 ${aggregatedPlans}
`,

    generateBaseArticle: (topic: string, mainKeyword: string, langue: string, remarque: string, plan: string) => {
        const now = new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })

        return `Tu es un expert en rédaction d'articles de blog SEO pour le B2B (SaaS, startups, PME).

Attention : je ne veux PAS un article au style robotisé typique des IA.

Je veux un article de blog :

- De 2500 mots environ
- Optimisé pour le mot-clé suivant : ${mainKeyword}
- Structuré pour le SEO (avec titres H2 et sous-parties claires)
- MAIS surtout écrit de manière **vivante, naturelle, humaine**, comme si un professionnel passionné expliquait à son lecteur.

**Ton style doit respecter scrupuleusement ces consignes :**

- Utilise des phrases parlées, parfois commencées par "Et", "Mais", "Bref", "Franchement".
- Varie la longueur des paragraphes : certains doivent être courts (1-2 lignes), d'autres plus longs (6-8 lignes).
- Ajoute des anecdotes personnelles, du vécu, des exemples de clients, des expériences terrain.
- Donne ton opinion personnelle à plusieurs reprises : "Je pense que", "À mon avis", "Honnêtement, je trouve que".
- Utilise des contractions pour rendre le ton naturel : "c'est", "j'suis", "faut pas", "y'a", "t'as", etc.
- Ajoute de l'émotion : enthousiasme, frustration, humour léger, sans être lourd.
- Évite d'être trop scolaire ou "parfait" : accepte les répétitions légères, les digressions, les tournures imparfaites.
- Ne fais pas des listes "propres" et rigides : casse parfois le rythme.
- Vouvoie l'audience composée de dirigeants et C-levels, mais parle-leur comme à des humains.

**Structure de l'article :**
1. Introduction accrocheuse (histoire, situation vécue ou observation terrain)
2. Problématisation : pourquoi c'est important aujourd'hui (exposer la difficulté)
3. Solutions pratiques ou piliers clés (3-4 grandes idées détaillées)
4. Pièges / erreurs fréquentes
5. Conclusion inspirante, vivante, qui pousse à l'action


Ces informations doivent absolument apparaître dans ton article : 
${remarque}

**Important** :
- Garde un style professionnel mais jamais "corporate chiant".
- L'objectif est que l'article semble écrit par un expert B2B qui parle franchement à d'autres professionnels, pas par une machine.

**Information à prendre en compte**
Date du jour: $now

**EXEMPLE DE STYLE ATTENDU :** 
Voici un article qui illustre exactement le ton, le rythme et l'approche attendus :

---

# Sales Enablement : comment vraiment aider vos commerciaux (et pas juste leur filer des slides)

L'autre jour, je discutais avec un pote qui bosse en sales. Il me sort : "Franchement, parfois, on a l'impression qu'on nous balance du contenu juste pour cocher une case, mais sur le terrain, ça sert à rien." Et il n'avait pas tort.

Parce que le Sales Enablement, c'est pas juste faire joli. C'est pas imprimer trois fiches produits en mode "allez, débrouillez-vous". Non. Le vrai Sales Enablement, c'est donner à vos commerciaux les bonnes armes, au bon moment, pour qu'ils puissent claquer des deals même quand le prospect est sur la défensive.

Et aujourd'hui, vu le niveau des acheteurs B2B, si vous ne faites pas ça, bonne chance.

## Pourquoi aujourd'hui, ça ne pardonne plus

Je me souviens d'une époque pas si lointaine où vendre, c'était presque un art de l'impro.

Un bon sourire, deux trois punchlines, une petite réduc à la fin, et bim, c'était plié.

Mais aujourd'hui ? Vos prospects arrivent ultra-préparés. Ils ont :
- lu 8 comparatifs SaaS,
- écouté des webinars,
- demandé à leur réseau LinkedIn,
- et testé 3 solutions avant même de vous parler.

Bref, ils savent déjà ce qu'ils veulent (ou pensent savoir).

Donc si vos commerciaux n'ont pas les bons arguments, les bons contenus, et la bonne stratégie, ils sont grillés d'avance.

## Les vrais piliers du Sales Enablement (pas les théories bullshit)

On va aller droit au but. Pour moi, un Sales Enablement qui cartonne, ça repose sur trois trucs :

### 1. Du contenu vraiment utile (pas juste "beau")

Et je parle pas de présentations PowerPoint pleines de buzzwords.

Non, je parle de :
- scripts d'appels qui décapent,
- fiches produits claires et pas chiantes,
- cas clients qui donnent envie,
- arguments pour éclater la concurrence.

Et surtout, tout doit être **facile à trouver**. Un commercial qui galère à chercher son contenu, c'est un commercial qui perd du temps. Et à la fin, qui perd des deals.

### 2. De la formation, mais en mode "terrain"

Soyons honnêtes : personne n'a envie de passer 3h en formation PowerPoint.

Ce qu'il faut, c'est des sessions courtes, punchy, actionnables. Genre : "Comment gérer un prospect qui veut négocier à mort ?" ou "Top 5 des objections de cette semaine, et comment les exploser".

Une fois, j'ai bossé avec une équipe qui faisait des "battle objections" tous les vendredis. C'était fun, compétitif, super efficace. Les résultats ? En 2 mois, +22% de taux de closing. Pas mal, non ?

### 3. Marketing et Sales main dans la main (et pas chacun dans son coin)

Si votre marketing crée du contenu sans parler aux sales, autant jeter des billets par la fenêtre.

Le Sales Enablement, c'est quand :
- le marketing produit CE DONT les sales ont besoin (et pas ce qu'ils trouvent joli).
- les sales remontent les vraies galères du terrain.
- tout le monde travaille ensemble pour affiner, ajuster, améliorer.

Simple en théorie. Rare en pratique.

## Les outils qui changent vraiment la donne

Pas besoin d'une usine à gaz. Mais quelques outils bien choisis peuvent tout changer :
- Un CRM qui fait pas mal au crâne (Hubspot, Salesforce)
- Une plateforme de Sales Enablement (Showpad, Highspot)
- Un bon outil d'enregistrement d'appels (Gong.io)

Petite histoire vraie : un client a utilisé Gong pour analyser ses appels. Ils se sont rendu compte qu'ils parlaient 70% du temps, au lieu d'écouter. Changement de méthode : écoute active, questions ouvertes, 2 mois plus tard, le CA avait pris +15%.

Comme quoi, parfois, juste écouter plus, ça rapporte.

## Les erreurs à éviter absolument (sinon, autant rien faire)

- Créer du contenu qui finit au fond d'un Google Drive oublié.

- Former une fois et dire "c'est bon, ils savent".

- Ignorer les feedbacks terrain.

- Boucler l'onboarding des nouveaux commerciaux. (Là, c'est vraiment un crime.)

## En conclusion (rapide, promis)

Le Sales Enablement, ce n'est pas un projet sympa à faire "quand on aura le temps".

C'est un game changer.

C'est ce qui fait la différence entre une équipe qui rame pour signer, et une équipe qui aligne les contrats.

Alors ouais, ça demande un peu de taf, de l'organisation, de l'écoute, et pas mal d'humilité.

Mais franchement, quand vous verrez vos commerciaux enchainer les wins avec le sourire, vous vous direz juste : "Mais pourquoi on ne l'a pas fait avant ?".

Bref. Vous savez ce qu'il vous reste à faire.

---

=> Prêt ? Écris-moi l'article pour le sujet : **${topic}**

Répond avec le format JSON suivant: {
title: <titre de l'article>,
content: <contenu de l'article>,
meta_description: <meta description optimisé SEO de l'article>
}


Voici le plan exact de l'article a respecter : 
${plan}

**Important** : Répond uniquement avec le JSON sans rien d'autre
Ne répond **jamais** dans un bloc de code`
    },

    improveIntro: (mainKeyword: string, articleContent: string) => `
Tu es un expert en copywriting SEO, spécialisé dans la création d'introductions haute conversion pour 2025.
MISSION : Transformer l'introduction en un hook puissant qui maximise l'engagement, optimise le SEO et guide naturellement vers le contenu principal.

ANALYSE PRÉALABLE DE L'ARTICLE :

Audit de l'intention de recherche

Identifier le problème/besoin principal que résout l'article
Définir la promesse de valeur unique
Mapper l'intention (informationnelle/commerciale/navigationnelle)


STRUCTURE D'INTRODUCTION OPTIMISÉE (150-200 mots)


Paragraphe 1 (40-60 mots) - HOOK + Mot-clé :
Techniques d'accroche prioritaires :

Statistique choc : "En 2024, 73% des entreprises qui négligent [mot-clé] perdent..."
Question provocante : "Pourquoi [mot-clé] est-il devenu l'obsession des experts en..."
Déclaration contre-intuitive : "Contrairement aux idées reçues sur [mot-clé]..."
Tendance émergente : "Depuis 2025, [mot-clé] révolutionne..."

Règle absolue : Mot-clé principal intégré NATURELLEMENT dans les 50 premiers mots.
Paragraphe 2 (60-80 mots) - PROBLÈME + CONSÉQUENCES :

Identifier le pain point principal du lecteur
Quantifier l'impact du problème (si possible avec data)
Créer l'urgence sans être alarmiste
Connecter émotionnellement avec l'audience

Paragraphe 3 (40-60 mots) - SOLUTION + TRANSITION :

Présenter la valeur/solution que l'article apporte
Teaser le contenu à venir sans tout révéler
Transition fluide vers H2 suivant
Call-to-action implicite de lecture


OPTIMISATIONS SEO AVANCÉES

Intégration sémantique naturelle :

Mot-clé principal : 1 occurrence exacte dans les 50 premiers mots
Variantes LSI : 2-3 termes connexes intégrés naturellement
Entités nommées : Mentionner secteur/industrie si pertinent
Temporalité : Intégrer 2025 pour la fraîcheur

Optimisation Featured Snippet :

Répondre partiellement à la question principale
Structure qui peut être extraite facilement
Définition claire du concept principal si applicable


TECHNIQUES PSYCHOLOGIQUES

Déclencheurs d'engagement :

Curiosity gap : "Découvrez pourquoi cette méthode..." (sans révéler)
Social proof : "Des milliers d'experts utilisent..." (si applicable)
Urgence temporelle : "En cette période de..." (contextualiser 2024/2025)
Bénéfice personnel : "Vous pourrez enfin..."

Crédibilité instantanée :

Mentionner données récentes/tendances
Références subtiles à l'expertise
Contextualisation professionnelle


STRUCTURE NARRATIVE OPTIMISÉE

Template AIDA adapté :
[ATTENTION] : Hook statistique/question/déclaration + mot-clé
[INTÉRÊT] : Développement du problème + impact concret
[DÉSIR] : Promesse de solution + bénéfices attendus
[ACTION] : Transition naturelle vers le contenu
Exemple de flow :
"En 2024, [statistique choc sur mot-clé principal]. [Développement du problème et impact]. Pourtant, [solution existe/méthode émergente]. Dans ce guide complet, découvrez [promesse de valeur spécifique]. Commençons par [transition vers H2]..."

CONNECTEURS ET TRANSITIONS

Vers la première section H2 :

"Pour bien comprendre, commençons par..."
"Avant de détailler les stratégies, il est essentiel de..."
"La première étape consiste à..."
"Pour maximiser vos résultats, découvrons d'abord..."

Éviter : "Dans cet article, nous verrons..." / "Nous allons aborder..." (ton trop académique)

VALIDATION TECHNIQUE

Checklist introduction optimisée :
✅ Mot-clé principal dans les 50 premiers mots
✅ Hook engageant dès la première phrase
✅ Problème clairement identifié et quantifié
✅ Solution/valeur promise explicite
✅ Transition naturelle vers H2 suivant
✅ Longueur 150-200 mots (ni trop courte, ni bavarde)
✅ Ton cohérent avec le reste de l'article
✅ Optimisation Featured Snippet potentielle
✅ Signaux de fraîcheur (année courante)

OPTIMISATIONS PAR TYPE D'ARTICLE

Guide pratique : Focus sur le résultat obtenu
Article informatif : Accent sur l'apprentissage/compréhension
Comparatif : Mise en avant du choix éclairé
Actualité : Urgence et impact de l'information

Important: Répond avec l'article en entier en gardant la même structure, ton & style mais avec l'introduction améliorée selon cette méthodologie.

Répond uniquement avec le texte, sans rien d'autre
Important: Travaille toujours dans la langue de l'article


Voici le texte de l'article :

${articleContent}
`,

    optimizeSEO: (mainKeyword: string, articleContent: string) => `
Objectif : enrichir l'article et améliorer l'UX selon les standards SEO 2025
Contexte :
Tu es un expert SEO technique et éditorial, spécialisé dans l'optimisation pour Google MUM, PaLM 2, et AI Overviews 2025. Ton objectif est d'améliorer cet article existant en :

Enrichissant son champ sémantique avec une approche topic clustering
Optimisant sa lisibilité et son potentiel de featured snippets
Préparant le contenu pour la recherche vocale et l'IA

DIRECTIVES STRICTES

Enrichissement Sémantique Avancé (Obligatoire)

Ajouter :
Entités contextuelles : 5-7 entités liées au mot-clé principal ${mainKeyword}

Inclure des termes techniques, marques, certifications
Exemple : "vélo électrique" → "batterie lithium-ion", "assistance au pédalage", "norme EN 15194", "Bosch Performance Line", "autonomie réelle"

Synonymes intentionnels : 3 synonymes basés sur l'intention de recherche

Variantes long-tail, termes conversationnels, expressions vocales
Exemple : "comment choisir" → "guide d'achat", "conseils pour sélectionner"

Questions People Also Ask : 1-2 questions avec réponses optimisées (30-50 mots)

Format H3 + réponse concise pour featured snippets
Inclure des chiffres, dates, listes quand pertinent

Topic clusters : Mention de 2-3 sujets connexes pour renforcer l'autorité topique

Exemple : vélo électrique → maintenance, accessoires, réglementation


Mise en Gras Stratégique 2025

À mettre en gras (pour UX et snippets) :

Définitions clés (format "Terme : définition")
Étapes numérotées et alertes visuelles
Réponses directes aux questions (format snippet)
Éléments de navigation et call-to-action

Nouvelles règles :

Optimiser pour la lecture rapide (scan-friendly)
Privilégier les formats snippet (listes, tableaux conceptuels)
Ratio gras : 0.5-0.7% du texte total maximum

Interdictions renforcées :
❌ Keyword stuffing en gras
❌ Gras dans l'introduction (impact LCP)
❌ Plus de 2 éléments gras par phrase

Optimisations 2025 Supplémentaires

Suggestions de données structurées : Mentionner dans un commentaire HTML discret les schema.org applicables
Optimisation vocale : Inclure 1 phrase de réponse directe par section principale
AI Overview ready : Structurer les informations factuelles en format liste/tableau quand pertinent
Répond avec l'article enrichi en gardant la structure, ton et style originaux.
Important : Travaille dans la langue de l'article source.
Format : Markdown uniquement, sans commentaires additionnels.

Le texte de l'article : ${articleContent}
`,

    optimizeKeywordOccurrence: (mainKeyword: string, intention: string, articleContent: string) => `
Objectif : Optimiser la distribution sémantique et éviter le keyword stuffing selon les standards 2025

Tu es un expert en optimisation sémantique SEO, spécialisé dans l'analyse de pertinence thématique pour Google 2025.

ANALYSE REQUISE AVANT OPTIMISATION :

1. **Audit sémantique actuel**
- Compter les occurrences exactes du mot-clé principal : **${mainKeyword}**
- Identifier les variantes et synonymes déjà présents
- Évaluer la distribution dans les éléments structurels (H1, H2, H3, corps)

2. **Optimisation intelligente**

**Pour les titres :**
- H1 : Mot-clé principal NATURELLEMENT intégré (jamais forcé)
- H2/H3 : Maximum 2 sous-titres avec variantes/synonymes
- Privilégier les **long-tail variations** dans les sous-titres
- Éviter la répétition exacte entre H1 et H2

**Pour le corps :**
- **Densité sémantique** : 0.4-0.8% (variable selon longueur)
  * Articles <1000 mots : 0.6-0.8%
  * Articles >2000 mots : 0.4-0.6%
- **Ratio variantes/exact** : 70% variantes, 30% mot-clé exact
- **Distribution équilibrée** : Éviter les clusters de mots-clés

3. **Règles de naturalité 2025**

**Priorités absolues :**
✅ Lisibilité et fluidité avant SEO
✅ Variantes contextuelles pertinentes
✅ Co-occurrences naturelles avec entities liées
✅ Respect de l'intention de recherche

**Interdictions strictes :**
❌ Répétitions dans la même phrase
❌ Variations forcées non naturelles  
❌ Concentration >3 occurrences par paragraphe
❌ Mot-clé dans chaque phrase d'introduction

4. **Méthode d'optimisation**

**Si sous-optimisé :**
- Ajouter 2-3 variantes naturelles
- Intégrer dans les transitions entre paragraphes
- Utiliser les synonymes contextuel (pas mécaniques)

**Si sur-optimisé :**
- Remplacer par des synonymes élégants
- Utiliser des pronoms de reprise ("cette solution", "ce processus")
- Reformuler pour privilégier la valeur utilisateur

5. **Validation finale**
- Lecture à voix haute : le texte doit sonner naturel
- Vérification mobile : lisibilité sur petit écran
- Test intention : répond-il parfaitement à la requête ?

**Important :** Adapte l'optimisation selon le type d'intention :
- **Informationnelle** : Focus sur les variantes éducatives
- **Commerciale** : Intégrer les termes d'achat naturellement 
- **Navigationnelle** : Privilégier les termes de marque/service

Pour cet article l'intention est : ${intention}

Réponds avec l'article optimisé en conservant sa structure, ton et style naturels de l'article de base.
**Important** : Travaille dans la langue de l'article source.
Format : Texte final uniquement, sans commentaires.


Réponds **uniquement** avec le texte, sans rien d'autre.

Le contenu de l'article:
${articleContent}
`,

    addInternalLinks: (mainKeyword: string, sitemap: string, articleContent: string) => `
Tu es un expert en linking interne SEO, spécialisé dans l'optimisation topic cluster et link equity pour 2025.

Objectif : Créer un maillage interne stratégique basé sur la pertinence thématique et l'intention utilisateur.

ANALYSE PRÉALABLE REQUISE :

1. **Identification du topic cluster**
- Définir le cluster thématique principal de l'article
- Identifier les sous-topics connexes
- Mapper l'intention de recherche (informationnelle/commerciale/navigationnelle)

2. **RÈGLES DE SÉLECTION AVANCÉES**

**Priorité 1 - Pertinence thématique (80% des liens) :**
- Articles du même cluster semantic
- Contenu complémentaire (pas concurrent)
- Progression logique d'approfondissement
- Correspondance d'intention utilisateur

**Priorité 2 - Architecture SEO (20% des liens) :**
- Pages piliers du site
- Content hubs stratégiques
- Articles haute autorité (si pertinents)

3. **QUANTITÉ OPTIMISÉE 2025**
- Articles 1000-1500 mots : **4-6 liens** (focus qualité)
- Articles 1500-2500 mots : **6-9 liens** (distribution équilibrée)
- Articles 2500+ mots : **8-15 liens** (maillage dense mais naturel)

4. **STRATÉGIE D'ANCRES AVANCÉE**

**Mix d'ancres optimal :**
- 40% : **Exact match sémantique** ([optimisation SEO WordPress])
- 30% : **Partial match** ([guide WordPress complet])
- 20% : **Branded/contextuel** ([notre méthode d'optimisation])
- 10% : **Natural flow** ([cette approche] / [ces techniques])

**Exemples d'ancres 2025 :**
✅ **EXCELLENTES** (semantic + intent) :
[stratégies de contenu B2B efficaces](lien)
[optimiser Core Web Vitals WordPress](lien)
[guide complet SEO technique 2025](lien)
[améliorer le taux de conversion e-commerce](lien)

✅ **BONNES** (contextuel naturel) :
[cette méthode d'optimisation](lien)
[les techniques que nous recommandons](lien)
[approche détaillée ici](lien)

❌ **À ÉVITER ABSOLUMENT** :
[cliquez ici] / [en savoir plus] / [lire la suite]

5. **PLACEMENT STRATÉGIQUE 2025**

**Distribution optimale :**
- **Introduction** : 0-1 lien (seulement si très pertinent)
- **Corps** : 70% des liens (répartis naturellement)
- **Conclusion** : 1-2 liens d'approfondissement
- **Sections H2** : 1 lien max par section principale

**Règles de placement :**
- Intégration dans le **flow naturel** de lecture
- Liens **contextuellement justifiés**
- Éviter les **link clusters** (max 2 liens/paragraphe)
- Position **mid-sentence** quand possible pour la naturalité

6. **VALIDATION QUALITÉ**

**Checklist finale :**
✅ Chaque lien apporte une valeur ajoutée réelle
✅ Progression logique dans le customer journey
✅ Ancres variées et naturelles
✅ Distribution équilibrée dans l'article
✅ Respect de la langue cible
✅ Pas de liens vers du contenu concurrent direct

**Filtrage automatique :**
- Langue : Correspond à celle de l'article
- Fraîcheur : Privilégier contenu récent si disponible
- Autorité : Prioriser pages bien positionnées

7. **OPTIMISATIONS TECHNIQUES**

**Format markdown :**
[ancre optimisée](URL-relative-propre)

**Attributs implicites :**
- Tous liens internes = follow par défaut
- Ouverture même onglet (UX interne)
- URL relatives quand possible

Analyse le sitemap fourni selon ces critères et intègre les liens les plus pertinents.


Voici le sitemap : 
${sitemap}

Répond avec l'article optimisé, même structure et style naturel.


**Important:** Travaille toujours dans la langue de l'article
Répond **uniquement** avec le texte, sans rien d'autre

Le texte de l'article : 
${articleContent}
`,

    searchStatsPrompt: (mainKeyword: string, region: string) => `
MISSION : Recherche de statistiques et sources premium pour optimisation SEO 2025

Contexte : Je développe un article SEO stratégique sur **${mainKeyword}** et ai besoin de données statistiques récentes provenant de sources d'autorité maximale.

CRITÈRES DE SOURCES OBLIGATOIRES :

1. **Autorité & Crédibilité (Priorité absolue)**
   - Domain Authority >70 (Moz) ou équivalent
   - Sources institutionnelles : .gov, .edu, organisations officielles
   - Think tanks reconnus, instituts de recherche
   - Publications académiques peer-reviewed
   - Entreprises Fortune 500 (pour données sectorielles)

2. **Types de sources à prioriser par ordre :**
   - **Tier 1** : Instituts statistiques nationaux, études gouvernementales
   - **Tier 2** : Rapports de grandes firmes (McKinsey, Deloitte, PwC)
   - **Tier 3** : Études de plateformes établies (HubSpot, Salesforce, etc.)
   - **Tier 4** : Recherches universitaires récentes
   - **Tier 5** : Publications spécialisées renommées

3. **Fraîcheur des données**
   - Données publiées : 2023/2024/2025
   - Études longitudinales acceptées si actualisées récemment
   - Éviter : données >24 mois sauf références historiques

4. **Types de statistiques recherchées**
   - **Métriques de marché** : taille, croissance, projections
   - **Données comportementales** : usage, adoption, tendances
   - **Benchmarks sectoriels** : performances, comparatifs
   - **Insights démographiques** : répartitions, évolutions
   - **ROI/Performance** : efficacité, résultats mesurés

LIVRABLES ATTENDUS :

Pour chacune des **7 meilleures sources** (pas 5), fournis :

**Format standardisé :**

[Numéro]. [Titre de l'étude/article]

Source : [Nom de l'organisation/publication]
URL complète : [Lien direct vers la page]
Authority Score : [DA/DR si disponible]
Date de publication : [Mois Année]
Statistique clé : "[Citation exacte avec chiffre]"
Intégration suggérée : "[Comment intégrer naturellement dans l'article]"
Anchor text recommandé : "[selon l'étude de XYZ]" ou "[données récentes montrent que]"
5. **CRITÈRES DE VALIDATION SUPPLÉMENTAIRES**

   **Géographie : **
   - Global : Priorité aux études internationales
    - Local : Inclure 2-3 sources de ${region}

   **Diversité sectorielle :**
   - Mix : sources académiques + corporate + institutionnelles
   - Éviter : +2 sources du même domaine

   **Vérification qualité :**
   - Méthodologie clairement expliquée
   - Taille d'échantillon significative
   - Pas de biais commercial évident

6. **BONUS RECHERCHÉS**
   - ✅ Statistiques comparatives (évolution temporelle)
   - ✅ Données segmentées (par démographie, région, etc.)
   - ✅ Projections futures crédibles
   - ✅ Infographies/visualisations disponibles
   - ✅ Études citées par d'autres sources premium

**CONTRAINTES ABSOLUES :**
❌ Pas de sources payantes inaccessibles
❌ Éviter les communiqués de presse purs
❌ Bannir les "studies" auto-promotionnelles
❌ Rejeter les données non-sourcées ou floues

**LANGUE :** Recherche dans la langue de l'article, mais accepte les sources EN de référence si traduites.

**Important:** Travaille toujours dans la langue de l'article
Retourne moi les sources, le titre et une description cohérente pour l'intégrer à l'article
`,

    insertStats: (stats: string, articleContent: string) => `
Tu es un expert en content optimization SEO, spécialisé dans l'intégration stratégique de données statistiques pour maximiser l'autorité topique et les signaux EEAT.

MISSION : Intégrer intelligemment les statistiques fournies pour renforcer la crédibilité, l'autorité et le potentiel de ranking de l'article.

ANALYSE PRÉALABLE REQUISE :

1. **Audit de pertinence contextuelle**
   - Mapper chaque statistique aux sections les plus pertinentes
   - Identifier les arguments nécessitant un renforcement par la data
   - Prioriser les stats selon leur impact sur l'intention de recherche

2. **STRATÉGIE D'INTÉGRATION AVANCÉE**

**Hiérarchisation des statistiques :**
- **Tier 1** : Stats directement liées au mot-clé principal (intégration prioritaire)
- **Tier 2** : Données de contexte sectoriel (support argumentaire)
- **Tier 3** : Statistiques comparatives/évolutives (enrichissement)

**Méthodes d'intégration par priorité :**

**A. Introduction de section (Impact fort) :**
"Selon une étude récente de [Source], 73% des entreprises..."

**B. Renforcement d'argument (Impact moyen) :**
"Cette approche s'avère particulièrement efficace, les données de McKinsey révélant une amélioration de 45%..."

**C. Transition entre idées (Impact contextuel) :**
"Pour comprendre l'ampleur du phénomène, les recherches de l'institut XYZ montrent que..."

3. **OPTIMISATION DES ANCRES EXTERNES**

**Mix d'ancres stratégique (éviter la répétition) :**
- 25% : **Source branded** ([selon l'étude McKinsey], [d'après les données HubSpot])
- 25% : **Descriptif méthodologique** ([une recherche récente], [cette analyse approfondie])
- 25% : **Contextuel naturel** ([ces données montrent], [les chiffres révèlent])
- 25% : **Authority indicators** ([selon les experts], [d'après cette étude de référence])

**Exemples d'ancres optimisées :**
✅ [selon l'étude Salesforce 2024](lien)
✅ [d'après les recherches de Stanford](lien)
✅ [cette analyse de Deloitte](lien)
✅ [les données officielles montrent](lien)
✅ [une étude récente révèle](lien)

❌ [source](lien) / [étude](lien) / [ici](lien) / [lien](lien)

4. **TECHNIQUES DE PRÉSENTATION AVANCÉES**

**Intégration narrative fluide :**
- Introduire la stat comme **support naturel** d'un argument
- Utiliser des **transitions logiques** ("Ces résultats confirment que...", "Pour illustrer cette tendance...")
- Créer de la **perspective** ("Comparativement aux années précédentes...")

**Optimisation de la lisibilité :**
- **Chiffres en gras** pour la scanabilité : **73%**, **2,5 milliards**
- **Contextualisation immédiate** : éviter les chiffres "nus"
- **Unités claires** : préciser les références temporelles/géographiques

**Signaux de crédibilité :**
- Mentionner la **méthodologie** si pertinente ("sur un échantillon de 10 000 entreprises")
- Préciser la **date** quand c'est un argument ("en 2024", "cette année")
- Ajouter le **contexte géographique** si nécessaire ("aux États-Unis", "à l'échelle mondiale")

5. **RÈGLES DE DISTRIBUTION**

**Placement stratégique :**
- **Maximum 2-3 statistiques par section H2** (éviter la surcharge)
- **Espacement régulier** : éviter les clusters de données
- **Position privilégiée** : début de paragraphe pour maximum d'impact
- **Équilibrage** : alterner stats + insights personnels

**Validation d'intégration :**
✅ Chaque statistique renforce un point clé
✅ Progression logique dans l'argumentation
✅ Ancres variées et naturelles
✅ Sources d'autorité mises en valeur
✅ Lisibilité préservée

6. **OPTIMISATIONS TECHNIQUES**

**Format markdown optimisé :**
Les dernières recherches de McKinsey révèlent que 85% des entreprises qui adoptent cette stratégie observent une croissance significative dans les 6 premiers mois.

**Attributs implicites :**
- Liens externes = "rel="noopener" automatique
- Ouverture nouvel onglet pour sources externes
- Ancres descriptives pour l'accessibilité

7. **VALIDATION FINALE**

**Checklist qualité :**
✅ Intégration contextuellement pertinente
✅ Renforcement de l'autorité topique
✅ Variété dans les ancres de liens
✅ Préservation du flow de lecture naturel
✅ Signaux EEAT maximisés
✅ Chiffres formatés pour la scanabilité


**Important:** Travaille toujours dans la langue de l'article

Répond **uniquement** avec le texte, sans rien d'autre

Statistiques à intégrer:
${stats}

Article:
${articleContent}

    `,

    generateMetadata: (mainKeyword: string, articleContent: string) => `
Tu es en charge d'optimiser l'article pour le SEO.

Ton objectif est de générer une balise title & metadescription optimisée pour l'article que je vais te fournir

Pour la balise title: 50-60 caractère incluant le mot clé **${mainKeyword}**, idéalement au début

Pour la meta description: 150-160 caractères résumant l'article et incitant au clic, incluant le mot clé principal **${mainKeyword}** et des variantes

Pour le slug: Fait quelque chose de court & avec les mots les plus pertinents

Répond **uniquement** en JSON avec le format suivant:
{
"title": "titre",
"meta_description": "description"
"slug": "slug"
}

**Important:** Travaille toujours dans la langue de l'article
**Important** Répond uniquement avec le JSON sans rien d'autre
Ne répond **jamais** dans un bloc de code commme \`\`\`json...\`\`\`

Article:
${articleContent}
`,
}
