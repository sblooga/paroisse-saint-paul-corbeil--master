# 🏛️ Parish Template - Master 1

> Template réutilisable pour sites de paroisses - Version 1.0

## 📋 Description

Ce projet est un **template Master** conçu pour être déployé sur plusieurs paroisses avec des personnalisations mineures (images, nom de domaine, coordonnées). Il sert de site pilote pour un diocèse comptant 100+ paroisses.

## 🛠️ Technologies utilisées

| Catégorie | Technologie |
|-----------|-------------|
| Frontend | React 18, TypeScript, Vite |
| UI | Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | Lovable Cloud (Supabase) |
| Base de données | PostgreSQL (via Supabase) |
| Stockage médias | Supabase Storage |
| Authentification | Supabase Auth |
| Internationalisation | i18next (FR/PL) |

## 🚀 Installation locale

```sh
# Cloner le dépôt
git clone <YOUR_GIT_URL>

# Accéder au dossier
cd <YOUR_PROJECT_NAME>

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## 📁 Structure du projet

```
src/
├── assets/          # Images et ressources statiques
├── components/      # Composants React réutilisables
│   ├── admin/       # Composants du panneau d'administration
│   └── ui/          # Composants UI (shadcn/ui)
├── hooks/           # Hooks React personnalisés
├── integrations/    # Configuration Supabase (auto-généré)
├── lib/             # Utilitaires (sanitize, utils)
├── locales/         # Fichiers de traduction (fr.json, pl.json)
├── pages/           # Pages de l'application
supabase/
├── functions/       # Edge Functions (delete-user, list-users)
└── config.toml      # Configuration Supabase
```

## 🔧 Variables à personnaliser par paroisse

Pour déployer ce template sur une nouvelle paroisse, modifier :

1. **Informations de contact** : Adresse, téléphone, email
2. **Images** : Logo, photos de l'église, équipe pastorale
3. **Nom de domaine** : Configuration DNS
4. **Contenu** : Articles, horaires de messes, équipe
5. **Traductions** : Adapter les fichiers `locales/*.json` si nécessaire

## 🔐 Rôles utilisateurs

| Rôle | Permissions |
|------|-------------|
| Admin | Gestion complète + utilisateurs |
| Éditeur | Gestion du contenu (articles, pages, équipe) |

---

# 📦 Plan de Migration - Master 2

## Objectif

Migrer le template Master 1 (Lovable Cloud/Supabase) vers une architecture autonome :
- **Base de données** : Neon (PostgreSQL serverless)
- **Stockage médias** : Cloudinary
- **Hébergement** : Render.com
- **Dépôt** : GitHub

## ✅ Ce qui sera conservé sans modification

- Tout le code React/TypeScript du frontend
- Les composants UI (shadcn/ui, Tailwind)
- La structure des pages et la navigation
- Les animations Framer Motion
- Le système i18next (traductions FR/PL)
- Les hooks personnalisés (hors auth)

## ⚠️ Éléments nécessitant une adaptation

| Composant | Effort | Description |
|-----------|--------|-------------|
| Client Supabase → Neon | Moyen | Remplacer `@supabase/supabase-js` par un client PostgreSQL (Drizzle ORM ou Prisma) |
| Supabase Storage → Cloudinary | Moyen | Adapter l'upload d'images vers l'API Cloudinary |
| Supabase Auth → Clerk/Auth0 | Important | Implémenter un nouveau système d'authentification |
| Edge Functions → API Routes | Moyen | Convertir les fonctions Deno en routes Express/Hono sur Render.com |
| RLS Policies → Middleware | Moyen | Implémenter les règles de sécurité côté serveur |

## 📋 Étapes de migration

### Phase 1 : Préparation (1 session)
1. Créer un nouveau projet Lovable (remix de Master 1)
2. **Ne pas activer Lovable Cloud**
3. Connecter à un nouveau dépôt GitHub

### Phase 2 : Base de données (1-2 sessions)
1. Créer un projet Neon et récupérer la connection string
2. Installer Drizzle ORM ou Prisma
3. Migrer le schéma de tables
4. Adapter les requêtes Supabase → ORM

### Phase 3 : Authentification (1-2 sessions)
1. Créer un compte Clerk ou Auth0
2. Configurer les providers (email/password)
3. Remplacer `useAuth` hook
4. Adapter les pages `/auth` et `/admin`

### Phase 4 : Stockage médias (1 session)
1. Créer un compte Cloudinary
2. Configurer l'upload widget ou l'API
3. Adapter les composants `ImageUpload`

### Phase 5 : Déploiement (1 session)
1. Créer un Web Service sur Render.com
2. Configurer les variables d'environnement
3. Déployer depuis GitHub
4. Configurer le domaine personnalisé

## 🎯 Résultat attendu

Un template **100% autonome** sans dépendance à Lovable Cloud, déployable à l'infini pour chaque paroisse du diocèse avec :
- Versionnage (V1.0, V1.1, V2.0...)
- Coûts maîtrisés (Neon free tier, Cloudinary free tier)
- Maintenance centralisée via GitHub

## 📞 Support

Pour toute question sur la migration, consulter :
- [Documentation Neon](https://neon.tech/docs)
- [Documentation Cloudinary](https://cloudinary.com/documentation)
- [Documentation Clerk](https://clerk.com/docs)
- [Documentation Render](https://render.com/docs)

---

## 📝 Déploiement Lovable (Master 1)

Pour publier le site : [Lovable](https://lovable.dev) → Share → Publish

## 🌐 Domaine personnalisé

Project > Settings > Domains > Connect Domain

Documentation : [Custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
