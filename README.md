# StageConnect

> **Plateforme de mise en relation stages · Laravel 12 + React (Inertia.js)**

StageConnect est une plateforme complète de matching qui connecte les étudiants avec les entreprises pour des opportunités de stage. C'est un monolithe Laravel 12 + React (Inertia.js) servant de frontend web.

## 🎯 Fonctionnalités

- **3 rôles utilisateurs** : Étudiant, Entreprise, Administrateur
- **Matching intelligent** : Algorithme de recommandation basé sur les compétences
- **Gestion des offres** : Publication, modification, pause et suppression d'offres de stage
- **Candidatures** : Système complet de candidature avec suivi
- **Messagerie** : Communication entre étudiants et entreprises
- **Évaluations** : Système de reviews après les stages
- **Bookmarks** : Sauvegarde des offres favorites
- **Abonnements** : Plans Free, Starter et Pro pour les entreprises (Stripe & CinetPay)
- **Authentification sécurisée** : Laravel Fortify avec 2FA, vérification email, réinitialisation mot de passe
- **Tableau de bord admin** : Gestion des utilisateurs et validation des entreprises
- **Notifications** : Notifications en temps réel
- **Téléchargement CV** : Génération et téléchargement de CV au format PDF

## 🚀 Stack Technique

### Backend
- **Framework** : Laravel 12
- **Auth** : Laravel Fortify (2FA, email verification, password reset)
- **API Tokens** : Laravel Sanctum
- **Base de données** : PostgreSQL 16
- **Cache/Queue** : Redis 7
- **Recherche** : Meilisearch (via Laravel Scout)
- **Permissions** : Spatie Laravel Permission
- **Médias** : Spatie Laravel Media Library
- **Paiement** : Stripe & CinetPay
- **PDF** : DomPDF

### Frontend
- **Framework** : React 19
- **SSR** : Inertia.js
- **Langage** : TypeScript
- **CSS** : Tailwind CSS v4
- **Composants UI** : shadcn/ui (Radix UI primitives)
- **Icônes** : Lucide React
- **Build** : Vite 7
- **React Compiler** : babel-plugin-react-compiler (optimisations automatiques)

### DevOps
- **Conteneurisation** : Docker & Docker Compose
- **Serveur Web** : Nginx
- **CI/CD** : GitHub Actions

## 📦 Installation

### Prérequis

- PHP 8.3+
- Composer
- Node.js 20+
- npm ou bun
- PostgreSQL 16
- Redis 7
- Meilisearch (optionnel pour la recherche)

### Installation locale

1. **Cloner le dépôt**
```bash
git clone https://github.com/votre-org/stageconnect.git
cd stageconnect
```

2. **Copier le fichier d'environnement**
```bash
cp .env.example .env
```

3. **Installer les dépendances PHP**
```bash
composer install
```

4. **Générer la clé d'application**
```bash
php artisan key:generate
```

5. **Configurer la base de données**

Modifier `.env` avec vos credentials PostgreSQL :
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=stageconnect
DB_USERNAME=stageconnect
DB_PASSWORD=votre_mot_de_passe
```

6. **Exécuter les migrations**
```bash
php artisan migrate
```

7. **Installer les dépendances JavaScript**
```bash
npm install
```

8. **Compiler les assets**
```bash
npm run build
```

9. **Lancer le serveur de développement**
```bash
composer dev
```

L'application sera disponible sur `http://localhost:8000`

### Installation avec Docker

1. **Démarrer les services**
```bash
docker-compose up -d
```

2. **Installer les dépendances dans le conteneur**
```bash
docker-compose exec app composer install
docker-compose exec app npm install
docker-compose exec app npm run build
```

3. **Exécuter les migrations**
```bash
docker-compose exec app php artisan migrate
```

## 🔧 Commandes disponibles

### Développement

```bash
composer dev          # Démarre tous les processus : serveur PHP, queue listener, Vite
composer dev:ssr      # Développement avec SSR activé
```

### Build

```bash
npm run build         # Build de production
npm run build:ssr     # Build de production avec SSR
```

### Tests

```bash
php artisan test                             # Exécute tous les tests
php artisan test --filter TestName           # Exécute un test spécifique
php artisan test tests/Feature/Auth/         # Exécute un dossier de tests
composer test                                # Alias pour les tests
```

Les tests utilisent Pest avec `RefreshDatabase`. L'environnement de test utilise SQLite en mémoire.

### Linting & Formatage

```bash
composer lint           # PHP: pint --parallel (auto-fix)
composer lint:check     # PHP: pint --parallel --test (mode CI)
npm run lint            # JS/TS: eslint --fix
npm run lint:check      # JS/TS: eslint (no fix)
npm run format          # Prettier write
npm run format:check    # Prettier check
npm run types:check     # tsc --noEmit
```

### Vérification complète CI

```bash
composer ci:check     # lint:check + format:check + types:check + tests
```

### Setup automatique

```bash
composer setup        # Installe tout : composer, .env, migrations, npm, build
```

## 🏗️ Architecture du Projet

```
stageconnect/
├── app/
│   ├── Actions/              # Actions Fortify
│   ├── Concerns/             # Traits réutilisables
│   ├── Console/              # Commands Artisan
│   ├── Http/
│   │   ├── Controllers/      # Contrôleurs
│   │   ├── Middleware/       # Middleware
│   │   └── Requests/         # Form Requests
│   ├── Jobs/                 # Jobs queue
│   ├── Mail/                 # Mailable classes
│   ├── Models/               # Modèles Eloquent
│   ├── Notifications/        # Notifications
│   ├── Policies/             # Authorization policies
│   ├── Providers/            # Service providers
│   └── Services/             # Services métier
├── bootstrap/
├── config/
├── database/
│   ├── factories/            # Model factories
│   ├── migrations/           # Migrations
│   └── seeders/              # Seeders
├── docker/                   # Configurations Docker
├── docs/                     # Documentation
├── public/
├── resources/
│   ├── css/
│   ├── js/
│   │   ├── components/       # Composants React
│   │   ├── hooks/            # Hooks personnalisés
│   │   ├── layouts/          # Layouts
│   │   ├── pages/            # Pages Inertia
│   │   ├── types/            # Types TypeScript
│   │   └── wayfinder/        # Helpers de routes (auto-généré)
│   └── views/
├── routes/
│   ├── web.php               # Routes web
│   └── settings.php          # Routes settings
├── storage/
├── tests/
│   ├── Feature/
│   └── Unit/
└── vite.config.ts
```

## 🗄️ Modèle de Données

```
users ──── student_profiles ──── student_skill ──── skills
users ──── company_profiles ──── offers ──── offer_skill ──── skills
                                 offers ──── applications ──── messages
                                             applications ──── reviews
company_profiles ──── subscriptions (free / starter / pro)
```

### Principales entités

- **User** : Utilisateurs authentifiés (students, companies, admins)
- **StudentProfile** : Profil étudiant avec CV, bio, compétences
- **CompanyProfile** : Profil entreprise avec logo, description
- **Offer** : Offres de stage avec titre, description, localisation, type
- **Skill** : Compétences techniques
- **Application** : Candidatures aux offres
- **Message** : Messages entre étudiants et entreprises
- **Review** : Évaluations après stage
- **Subscription** : Abonnements des entreprises
- **SavedOffer** : Offres sauvegardées (bookmarks)

## 🔐 Rôles et Permissions

Le système utilise **Spatie Laravel Permission** pour gérer les rôles :

- **student** : Peut consulter les offres, postuler, sauvegarder, recevoir des notifications
- **company** : Peut publier des offres, gérer les candidatures, envoyer des messages (selon abonnement)
- **admin** : Accès au dashboard admin, gestion des utilisateurs, validation des entreprises

## 💳 Monétisation

### Plans disponibles

| Plan | Prix | Fonctionnalités |
|------|------|-----------------|
| **Free** | Gratuit | 1 offre active, fonctionnalités de base |
| **Starter** | Payant | 5 offres actives, statistiques basiques |
| **Pro** | Payant | Offres illimitées, statistiques avancées, mise en avant |

### Méthodes de paiement

- **Stripe** : Cartes bancaires internationales
- **CinetPay** : Mobile money (Afrique francophone)

## 📡 API REST (Planifié)

Une API REST séparée est prévue avec :

- Laravel 11 + Sanctum
- Authentification par tokens
- Clients Web (React) et Mobile (React Native)
- Documentation Swagger/OpenAPI

Voir `docs/StageConnect_Backend_Plan.md` pour plus de détails.

## 🚀 Déploiement

### Script de déploiement

```bash
./deploy.sh
```

Le script effectue :
- Pull du code depuis `main`
- Installation des dépendances PHP et JS
- Build des assets
- Migrations de la base de données
- Cache des configurations
- Redémarrage des workers

### Production avec Docker

```bash
docker-compose -f docker-compose.prod.yml up -d
```

Configuration requise :
- Variables d'environnement dans `.env`
- Certificats SSL pour HTTPS
- Configuration Nginx dans `docker/nginx/default.conf`

## 🧪 Tests

```bash
# Tous les tests
php artisan test

# Tests feature
php artisan test tests/Feature/

# Tests unitaires
php artisan test tests/Unit/

# Test spécifique
php artisan test --filter TestName

# Avec coverage
php artisan test --coverage
```

## 📝 Conventions de Code

- **PHP** : PSR-12 enforced by Pint (preset Laravel)
- **TypeScript** : Mode strict, alias `@/` → `resources/js/`
- **React** : React Compiler activé (éviter `useMemo`/`useCallback` manuels)
- **Routes** : Utiliser les helpers Wayfinder (`resources/js/wayfinder/`)
- **Inertia** : Props typés via `resources/js/types/`

## 🛠️ Outils de Développement

- **Laravel Pail** : Logs en temps réel
- **Laravel Horizon** : Dashboard des queues (Redis)
- **L5-Swagger** : Documentation API
- **Pest** : Framework de testing moderne
- **Laravel Pint** : Auto-formatter PHP

## 📚 Documentation

- [Plan Backend API](docs/StageConnect_Backend_Plan.md) - Documentation détaillée de l'architecture API
- [CLAUDE.md](CLAUDE.md) - Guide pour Claude Code

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

Développé avec ❤️ par l'équipe StageConnect

---

**Stack** : Laravel 12 · React 19 · Inertia.js · TypeScript · Tailwind CSS v4 · PostgreSQL · Redis · Meilisearch
