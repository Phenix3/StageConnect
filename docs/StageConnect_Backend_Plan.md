# StageConnect — Plan Backend

> **API REST Laravel 11 · PHP 8.3 · PostgreSQL 16**
> Rôle : servir les clients Web (React) et Mobile (React Native)
> Convention : RESTful · Sanctum Auth · Queue async · TDD

---

## Table des matières

1. [Stack & Dépendances](#1-stack--dépendances)
2. [Structure du Projet](#2-structure-du-projet)
3. [Environnement de Développement](#3-environnement-de-développement)
4. [Schéma de Base de Données](#4-schéma-de-base-de-données)
5. [Migrations & Modèles](#5-migrations--modèles)
6. [Routes API](#6-routes-api)
7. [Modules à Implémenter](#7-modules-à-implémenter)
8. [Système de Matching](#8-système-de-matching)
9. [Notifications & Queue](#9-notifications--queue)
10. [Tests](#10-tests)
11. [Documentation API](#11-documentation-api)
12. [Monétisation & Abonnements](#12-monétisation--abonnements)
13. [Déploiement Backend](#13-déploiement-backend)
14. [Checklist par Phase](#14-checklist-par-phase)

---

## 1. Stack & Dépendances

### Core

| Package | Version | Usage |
|---------|---------|-------|
| `laravel/framework` | ^11.0 | Framework principal |
| `laravel/sanctum` | ^4.0 | Auth API par token |
| `laravel/horizon` | ^5.0 | Dashboard monitoring des queues |
| `laravel/scout` | ^10.0 | Intégration Meilisearch |
| `meilisearch/meilisearch-php` | ^1.0 | Driver Meilisearch pour Scout |

### Utilitaires

| Package | Usage |
|---------|-------|
| `darkaonline/l5-swagger` | Documentation Swagger/OpenAPI |
| `spatie/laravel-permission` | Gestion des rôles (student/company/admin) |
| `spatie/laravel-media-library` | Upload CV, avatars, logos |
| `intervention/image` | Redimensionnement images |
| `league/flysystem-aws-s3-v3` | Storage S3/MinIO |
| `barryvdh/laravel-dompdf` | Génération PDF (reçus, attestations) |
| `stripe/stripe-php` | Paiement Stripe |

### Dev

| Package | Usage |
|---------|-------|
| `laravel/pint` | Linting PSR-12 |
| `pestphp/pest` | Tests (alternative PHPUnit plus lisible) |
| `pestphp/pest-plugin-laravel` | Helpers Pest pour Laravel |
| `fakerphp/faker` | Seeders |

### Installation

```bash
composer create-project laravel/laravel stageconnect-api
cd stageconnect-api

# Core
composer require laravel/sanctum laravel/horizon laravel/scout
composer require meilisearch/meilisearch-php http-interop/http-factory-guzzle
composer require spatie/laravel-permission spatie/laravel-medialibrary
composer require intervention/image league/flysystem-aws-s3-v3
composer require barryvdh/laravel-dompdf stripe/stripe-php

# Dev
composer require --dev laravel/pint pestphp/pest pestphp/pest-plugin-laravel
composer require --dev darkaonline/l5-swagger

# Publier les configs
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan vendor:publish --provider="L5Swagger\L5SwaggerServiceProvider"
```

---

## 2. Structure du Projet

```
stageconnect-api/
├── app/
│   ├── Console/
│   │   └── Commands/
│   │       └── ExpireOffersCommand.php       # Scheduler : expirer les offres
│   ├── Exceptions/
│   │   └── Handler.php                       # Réponses JSON uniformes
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       └── V1/
│   │   │           ├── Auth/
│   │   │           │   ├── AuthController.php
│   │   │           │   └── SocialAuthController.php
│   │   │           ├── Student/
│   │   │           │   └── StudentProfileController.php
│   │   │           ├── Company/
│   │   │           │   └── CompanyProfileController.php
│   │   │           ├── OfferController.php
│   │   │           ├── ApplicationController.php
│   │   │           ├── MessageController.php
│   │   │           ├── ReviewController.php
│   │   │           ├── MatchingController.php
│   │   │           ├── SubscriptionController.php
│   │   │           └── Admin/
│   │   │               └── AdminController.php
│   │   ├── Middleware/
│   │   │   ├── CheckSubscriptionPlan.php
│   │   │   └── EnsureProfileComplete.php
│   │   ├── Requests/
│   │   │   ├── Auth/
│   │   │   │   ├── RegisterRequest.php
│   │   │   │   └── LoginRequest.php
│   │   │   ├── StoreOfferRequest.php
│   │   │   ├── StoreApplicationRequest.php
│   │   │   └── StoreReviewRequest.php
│   │   └── Resources/
│   │       ├── UserResource.php
│   │       ├── StudentProfileResource.php
│   │       ├── CompanyProfileResource.php
│   │       ├── OfferResource.php
│   │       ├── ApplicationResource.php
│   │       └── ReviewResource.php
│   ├── Jobs/
│   │   ├── SendApplicationNotification.php
│   │   ├── RecalculateMatchingScores.php
│   │   └── GenerateSubscriptionReceipt.php
│   ├── Mail/
│   │   ├── ApplicationReceived.php
│   │   ├── ApplicationStatusChanged.php
│   │   └── WelcomeEmail.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── StudentProfile.php
│   │   ├── CompanyProfile.php
│   │   ├── Skill.php
│   │   ├── Offer.php
│   │   ├── Application.php
│   │   ├── Message.php
│   │   ├── Review.php
│   │   └── Subscription.php
│   ├── Policies/
│   │   ├── OfferPolicy.php
│   │   └── ApplicationPolicy.php
│   ├── Repositories/
│   │   ├── Contracts/
│   │   │   └── OfferRepositoryInterface.php
│   │   └── OfferRepository.php
│   └── Services/
│       ├── MatchingService.php
│       ├── NotificationService.php
│       └── SubscriptionService.php
├── database/
│   ├── migrations/
│   │   ├── 001_create_users_table.php
│   │   ├── 002_create_skills_table.php
│   │   ├── 003_create_student_profiles_table.php
│   │   ├── 004_create_company_profiles_table.php
│   │   ├── 005_create_offers_table.php
│   │   ├── 006_create_offer_skill_table.php
│   │   ├── 007_create_student_skill_table.php
│   │   ├── 008_create_applications_table.php
│   │   ├── 009_create_messages_table.php
│   │   ├── 010_create_reviews_table.php
│   │   └── 011_create_subscriptions_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── SkillSeeder.php
│       ├── UserSeeder.php
│       └── OfferSeeder.php
├── routes/
│   └── api.php
├── tests/
│   ├── Feature/
│   │   ├── Auth/
│   │   │   └── AuthTest.php
│   │   ├── OfferTest.php
│   │   ├── ApplicationTest.php
│   │   └── MatchingTest.php
│   └── Unit/
│       └── Services/
│           └── MatchingServiceTest.php
└── docker-compose.yml
```

---

## 3. Environnement de Développement

### `docker-compose.yml`

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - .:/var/www/html
    depends_on:
      - db
      - redis
      - meilisearch
      - minio
    environment:
      APP_ENV: local
      DB_CONNECTION: pgsql
      DB_HOST: db
      DB_DATABASE: stageconnect
      DB_USERNAME: postgres
      DB_PASSWORD: secret
      REDIS_HOST: redis
      MEILISEARCH_HOST: http://meilisearch:7700
      AWS_ENDPOINT: http://minio:9000

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: stageconnect
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  meilisearch:
    image: getmeili/meilisearch:latest
    ports:
      - "7700:7700"
    environment:
      MEILI_MASTER_KEY: masterkey

  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minio
      MINIO_ROOT_PASSWORD: minio123
    command: server /data --console-address ":9001"
    volumes:
      - miniodata:/data

volumes:
  pgdata:
  miniodata:
```

### `.env` clés importantes

```ini
APP_NAME=StageConnect
APP_ENV=local
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=stageconnect
DB_USERNAME=postgres
DB_PASSWORD=secret

QUEUE_CONNECTION=redis
CACHE_DRIVER=redis
SESSION_DRIVER=redis

MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_KEY=masterkey

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=minio
AWS_SECRET_ACCESS_KEY=minio123
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=stageconnect
AWS_ENDPOINT=http://localhost:9000
AWS_USE_PATH_STYLE_ENDPOINT=true

MAIL_MAILER=mailgun
MAILGUN_DOMAIN=stageconnect.cm
MAILGUN_SECRET=key-xxxx

CINETPAY_API_KEY=xxxx
CINETPAY_SITE_ID=xxxx
STRIPE_KEY=pk_test_xxxx
STRIPE_SECRET=sk_test_xxxx

L5_SWAGGER_GENERATE_ALWAYS=true
```

---

## 4. Schéma de Base de Données

```
users
 └──< student_profiles >──< student_skill >──< skills
 └──< company_profiles  >──< offer_skill  >──< skills
                         └──< offers >──< applications >──< messages
                                          └──< reviews
 └──< subscriptions (company)

notifications (polymorphique via user_id)
```

### Diagramme des relations

```
users (1) ──── (1) student_profiles ──── (N) student_skill ──── (N) skills
users (1) ──── (1) company_profiles ──── (N) offers ──── (N) offer_skill ──── (N) skills
                                         offers (1) ──── (N) applications
                                                          applications (1) ──── (N) messages
                                                          applications (1) ──── (1) review (×2)
company_profiles (1) ──── (N) subscriptions
```

---

## 5. Migrations & Modèles

### Migration : `users`

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->enum('role', ['student', 'company', 'admin'])->default('student');
    $table->string('avatar')->nullable();
    $table->string('phone', 20)->nullable();
    $table->timestamp('email_verified_at')->nullable();
    $table->rememberToken();
    $table->timestamps();
});
```

### Migration : `student_profiles`

```php
Schema::create('student_profiles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->text('bio')->nullable();
    $table->enum('level', ['L1','L2','L3','M1','M2','Licence','Master','Doctorat']);
    $table->string('school');
    $table->string('city', 100);
    $table->json('languages')->default('[]');   // ['Français', 'Anglais']
    $table->string('cv_path')->nullable();
    $table->date('availability_from')->nullable();
    $table->date('availability_to')->nullable();
    $table->timestamps();
});
```

### Migration : `company_profiles`

```php
Schema::create('company_profiles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('name');
    $table->string('sector', 100);
    $table->enum('size', ['1-10','11-50','51-200','200+'])->default('1-10');
    $table->text('description')->nullable();
    $table->string('website')->nullable();
    $table->string('logo')->nullable();
    $table->boolean('verified')->default(false);
    $table->enum('plan', ['free','starter','pro'])->default('free');
    $table->timestamps();
});
```

### Migration : `offers`

```php
Schema::create('offers', function (Blueprint $table) {
    $table->id();
    $table->foreignId('company_id')->constrained('company_profiles')->cascadeOnDelete();
    $table->string('title');
    $table->text('description');
    $table->string('duration', 50);                         // '3 mois'
    $table->string('city', 100);
    $table->boolean('remote')->default(false);
    $table->enum('type', ['stage','alternance','emploi'])->default('stage');
    $table->enum('level_required', ['L1','L2','L3','M1','M2','Tout niveau'])->default('Tout niveau');
    $table->json('languages')->default('["Français"]');
    $table->enum('status', ['active','paused','expired','filled'])->default('active');
    $table->boolean('is_premium')->default(false);
    $table->date('expires_at');
    $table->timestamps();
});
```

### Migration : `applications`

```php
Schema::create('applications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('offer_id')->constrained()->cascadeOnDelete();
    $table->foreignId('student_id')->constrained('student_profiles')->cascadeOnDelete();
    $table->text('cover_letter')->nullable();
    $table->enum('status', ['pending','viewed','accepted','rejected','withdrawn'])->default('pending');
    $table->decimal('matching_score', 5, 2)->nullable();
    $table->timestamp('applied_at')->useCurrent();
    $table->timestamp('updated_at')->nullable();
    $table->unique(['offer_id', 'student_id']);
});
```

### Migration : `reviews`

```php
Schema::create('reviews', function (Blueprint $table) {
    $table->id();
    $table->foreignId('application_id')->constrained()->cascadeOnDelete();
    $table->foreignId('reviewer_id')->constrained('users');
    $table->foreignId('reviewee_id')->constrained('users');
    $table->enum('type', ['company_to_student', 'student_to_company']);
    $table->tinyInteger('rating');  // 1-5
    $table->text('comment')->nullable();
    $table->timestamp('created_at')->useCurrent();
    $table->unique(['application_id', 'reviewer_id']);
});
```

### Modèle `User`

```php
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = ['name', 'email', 'password', 'role', 'avatar', 'phone'];
    protected $hidden   = ['password', 'remember_token'];
    protected $casts    = ['email_verified_at' => 'datetime', 'password' => 'hashed'];

    public function studentProfile(): HasOne
    {
        return $this->hasOne(StudentProfile::class);
    }

    public function companyProfile(): HasOne
    {
        return $this->hasOne(CompanyProfile::class);
    }

    public function isStudent(): bool  { return $this->role === 'student'; }
    public function isCompany(): bool  { return $this->role === 'company'; }
    public function isAdmin(): bool    { return $this->role === 'admin'; }
}
```

### Modèle `Offer`

```php
class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id','title','description','duration','city','remote',
        'type','level_required','languages','status','is_premium','expires_at'
    ];

    protected $casts = [
        'languages'   => 'array',
        'remote'      => 'boolean',
        'is_premium'  => 'boolean',
        'expires_at'  => 'date',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(CompanyProfile::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'offer_skill')
                    ->withPivot('is_required');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active')->where('expires_at', '>=', now());
    }

    public function scopePremium(Builder $query): Builder
    {
        return $query->where('is_premium', true);
    }
}
```

### Modèle `Application`

```php
class Application extends Model
{
    use HasFactory;

    protected $fillable = ['offer_id','student_id','cover_letter','status','matching_score'];

    protected $casts = ['matching_score' => 'float', 'applied_at' => 'datetime'];

    public function offer(): BelongsTo    { return $this->belongsTo(Offer::class); }
    public function student(): BelongsTo  { return $this->belongsTo(StudentProfile::class); }
    public function messages(): HasMany   { return $this->hasMany(Message::class); }
    public function reviews(): HasMany    { return $this->hasMany(Review::class); }

    protected static function booted(): void
    {
        static::created(function (Application $app) {
            // Calculer et stocker le score de matching à la création
            $score = app(MatchingService::class)->calculateScore(
                $app->student,
                $app->offer
            );
            $app->update(['matching_score' => $score]);

            // Notifier l'entreprise
            SendApplicationNotification::dispatch($app);
        });
    }
}
```

---

## 6. Routes API

```php
// routes/api.php

Route::prefix('v1')->group(function () {

    // ── Auth (public) ──────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('/register',            [AuthController::class, 'register']);
        Route::post('/login',               [AuthController::class, 'login']);
        Route::post('/forgot-password',     [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password',      [AuthController::class, 'resetPassword']);
        Route::get('/verify-email/{token}', [AuthController::class, 'verifyEmail']);
    });

    // ── Offres (lecture publique) ───────────────────────────────────────
    Route::get('/offers',        [OfferController::class, 'index']);
    Route::get('/offers/{offer}', [OfferController::class, 'show']);
    Route::get('/companies/{company}', [CompanyProfileController::class, 'show']);

    // ── Routes authentifiées ────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me',      [AuthController::class, 'me']);

        // Profil étudiant
        Route::prefix('student')->group(function () {
            Route::get('/profile',    [StudentProfileController::class, 'show']);
            Route::post('/profile',   [StudentProfileController::class, 'store']);
            Route::put('/profile',    [StudentProfileController::class, 'update']);
            Route::post('/profile/skills', [StudentProfileController::class, 'syncSkills']);
        });

        // Profil entreprise
        Route::prefix('company')->group(function () {
            Route::get('/profile',    [CompanyProfileController::class, 'showOwn']);
            Route::post('/profile',   [CompanyProfileController::class, 'store']);
            Route::put('/profile',    [CompanyProfileController::class, 'update']);
        });

        // Offres (CRUD entreprise)
        Route::middleware('role:company')->group(function () {
            Route::post('/offers',           [OfferController::class, 'store']);
            Route::put('/offers/{offer}',    [OfferController::class, 'update']);
            Route::delete('/offers/{offer}', [OfferController::class, 'destroy']);
            Route::patch('/offers/{offer}/pause',  [OfferController::class, 'pause']);
            Route::patch('/offers/{offer}/reopen', [OfferController::class, 'reopen']);

            // Candidatures reçues
            Route::get('/company/applications',                          [ApplicationController::class, 'companyIndex']);
            Route::patch('/applications/{application}/accept',           [ApplicationController::class, 'accept']);
            Route::patch('/applications/{application}/reject',           [ApplicationController::class, 'reject']);
        });

        // Matching
        Route::get('/offers/{offer}/match', [MatchingController::class, 'score']);
        Route::get('/offers/recommended',   [MatchingController::class, 'recommended']);

        // Candidatures (étudiant)
        Route::middleware('role:student')->group(function () {
            Route::get('/applications',                    [ApplicationController::class, 'studentIndex']);
            Route::post('/applications',                   [ApplicationController::class, 'store']);
            Route::patch('/applications/{application}/withdraw', [ApplicationController::class, 'withdraw']);
        });

        // Messagerie
        Route::get('/applications/{application}/messages',  [MessageController::class, 'index']);
        Route::post('/applications/{application}/messages', [MessageController::class, 'store']);
        Route::patch('/messages/{message}/read',            [MessageController::class, 'markRead']);

        // Reviews
        Route::post('/applications/{application}/review', [ReviewController::class, 'store']);
        Route::get('/students/{student}/reviews',         [ReviewController::class, 'studentReviews']);
        Route::get('/companies/{company}/reviews',        [ReviewController::class, 'companyReviews']);

        // Abonnements
        Route::prefix('subscriptions')->middleware('role:company')->group(function () {
            Route::get('/',                      [SubscriptionController::class, 'current']);
            Route::post('/checkout',             [SubscriptionController::class, 'checkout']);
            Route::post('/cancel',               [SubscriptionController::class, 'cancel']);
        });

        // Webhooks paiement (sans auth Sanctum)
        Route::post('/webhooks/cinetpay', [WebhookController::class, 'cinetpay'])->withoutMiddleware('auth:sanctum');
        Route::post('/webhooks/stripe',   [WebhookController::class, 'stripe'])->withoutMiddleware('auth:sanctum');

        // Admin
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('/companies/pending',              [AdminController::class, 'pendingCompanies']);
            Route::patch('/companies/{company}/verify',   [AdminController::class, 'verifyCompany']);
            Route::get('/stats',                          [AdminController::class, 'platformStats']);
            Route::delete('/users/{user}',                [AdminController::class, 'deleteUser']);
        });
    });
});
```

---

## 7. Modules à Implémenter

### Module Auth

```php
// app/Http/Controllers/Api/V1/Auth/AuthController.php

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $request->password,
            'role'     => $request->role,  // student | company
        ]);

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Inscription réussie. Vérifiez votre email.',
            'user'    => new UserResource($user),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Identifiants incorrects.'], 401);
        }

        $user  = Auth::user();
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => new UserResource($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(new UserResource($request->user()->load([
            'studentProfile.skills',
            'companyProfile',
        ])));
    }
}
```

### Module Offres

```php
// app/Http/Controllers/Api/V1/OfferController.php

class OfferController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $offers = Offer::with(['company', 'skills'])
            ->active()
            ->when($request->skills, fn($q) =>
                $q->whereHas('skills', fn($q) => $q->whereIn('slug', $request->skills))
            )
            ->when($request->city,   fn($q) => $q->where('city', $request->city))
            ->when($request->type,   fn($q) => $q->where('type', $request->type))
            ->when($request->remote, fn($q) => $q->where('remote', true))
            ->when($request->level,  fn($q) => $q->where('level_required', $request->level))
            ->orderByDesc('is_premium')  // Offres premium en premier
            ->orderByDesc('created_at')
            ->paginate(15);

        return OfferResource::collection($offers);
    }

    public function store(StoreOfferRequest $request): JsonResponse
    {
        $this->authorize('create', Offer::class);

        $offer = $request->user()->companyProfile->offers()->create(
            $request->validated()
        );

        $offer->skills()->sync($request->skills ?? []);

        return response()->json(new OfferResource($offer->load('skills')), 201);
    }
}
```

### Module Candidatures

```php
// app/Http/Controllers/Api/V1/ApplicationController.php

class ApplicationController extends Controller
{
    public function store(StoreApplicationRequest $request): JsonResponse
    {
        $student = $request->user()->studentProfile;
        $offer   = Offer::findOrFail($request->offer_id);

        $this->authorize('apply', $offer);

        $application = Application::create([
            'offer_id'      => $offer->id,
            'student_id'    => $student->id,
            'cover_letter'  => $request->cover_letter,
        ]);
        // Le score matching est calculé dans Application::booted()

        return response()->json(new ApplicationResource($application), 201);
    }

    public function accept(Application $application): JsonResponse
    {
        $this->authorize('manage', $application);

        $application->update(['status' => 'accepted']);

        // Notifier l'étudiant
        $application->student->user->notify(
            new ApplicationStatusChangedNotification($application)
        );

        return response()->json(new ApplicationResource($application));
    }
}
```

### Middleware CheckSubscriptionPlan

```php
// app/Http/Middleware/CheckSubscriptionPlan.php

class CheckSubscriptionPlan
{
    private array $limits = [
        'free'    => ['max_offers' => 1,  'featured' => false],
        'starter' => ['max_offers' => 5,  'featured' => false],
        'pro'     => ['max_offers' => -1, 'featured' => true],
    ];

    public function handle(Request $request, Closure $next, string $feature): Response
    {
        $company = $request->user()->companyProfile;
        $plan    = $this->limits[$company->plan] ?? $this->limits['free'];

        if ($feature === 'publish_offer') {
            $activeCount = $company->offers()->where('status', 'active')->count();
            if ($plan['max_offers'] !== -1 && $activeCount >= $plan['max_offers']) {
                return response()->json([
                    'error'        => 'Limite d\'offres atteinte.',
                    'current_plan' => $company->plan,
                    'upgrade_url'  => '/api/v1/subscriptions/checkout',
                ], 403);
            }
        }

        return $next($request);
    }
}
```

---

## 8. Système de Matching

```php
// app/Services/MatchingService.php

class MatchingService
{
    private array $regions = [
        'Centre'   => ['Yaoundé', 'Mbalmayo', 'Bafia', 'Obala'],
        'Littoral' => ['Douala', 'Edéa', 'Nkongsamba', 'Mbanga'],
        'Ouest'    => ['Bafoussam', 'Dschang', 'Mbouda', 'Bangangté'],
        'Nord-Ouest' => ['Bamenda', 'Kumbo', 'Wum'],
        'Sud-Ouest' => ['Buea', 'Limbé', 'Kumba'],
        'Adamaoua' => ['Ngaoundéré', 'Meiganga'],
        'Nord'     => ['Garoua', 'Guider', 'Pitoa'],
        'Extrême-Nord' => ['Maroua', 'Mokolo', 'Kousseri'],
        'Est'      => ['Bertoua', 'Batouri', 'Abong-Mbang'],
        'Sud'      => ['Ebolowa', 'Sangmélima', 'Kribi'],
    ];

    private array $levelOrder = [
        'L1' => 1, 'L2' => 2, 'L3' => 3,
        'M1' => 4, 'M2' => 5,
        'Licence' => 3, 'Master' => 5, 'Doctorat' => 6,
    ];

    public function calculateScore(StudentProfile $student, Offer $offer): float
    {
        $score = 0.0;

        $score += $this->skillsScore($student, $offer)       * 40;
        $score += $this->levelScore($student, $offer)        * 25;
        $score += $this->locationScore($student, $offer)     * 20;
        $score += $this->languagesScore($student, $offer)    * 10;
        $score += $this->availabilityScore($student, $offer) * 5;

        return round(min($score, 100), 2);
    }

    private function skillsScore(StudentProfile $student, Offer $offer): float
    {
        $required = $offer->skills->pluck('id');
        $has      = $student->skills->pluck('id');
        if ($required->isEmpty()) return 1.0;

        return $required->intersect($has)->count() / $required->count();
    }

    private function levelScore(StudentProfile $student, Offer $offer): float
    {
        if ($offer->level_required === 'Tout niveau') return 1.0;

        $studentLevel  = $this->levelOrder[$student->level] ?? 0;
        $requiredLevel = $this->levelOrder[$offer->level_required] ?? 0;

        if ($studentLevel >= $requiredLevel) return 1.0;
        if ($studentLevel === $requiredLevel - 1) return 0.5;

        return 0.0;
    }

    private function locationScore(StudentProfile $student, Offer $offer): float
    {
        if ($offer->remote) return 1.0;

        $s = strtolower(trim($student->city));
        $o = strtolower(trim($offer->city));

        if ($s === $o) return 1.0;
        if ($this->sameRegion($student->city, $offer->city)) return 0.5;

        return 0.0;
    }

    private function languagesScore(StudentProfile $student, Offer $offer): float
    {
        $required = collect($offer->languages);
        $has      = collect($student->languages);
        if ($required->isEmpty()) return 1.0;

        return $required->intersect($has)->count() / $required->count();
    }

    private function availabilityScore(StudentProfile $student, Offer $offer): float
    {
        if (!$student->availability_from) return 1.0;
        return $student->availability_from <= $offer->expires_at ? 1.0 : 0.0;
    }

    private function sameRegion(string $city1, string $city2): bool
    {
        foreach ($this->regions as $cities) {
            if (in_array($city1, $cities) && in_array($city2, $cities)) {
                return true;
            }
        }
        return false;
    }

    public function getRecommendedOffers(StudentProfile $student, int $limit = 10): Collection
    {
        return Offer::with(['skills', 'company'])
            ->active()
            ->get()
            ->map(fn(Offer $offer) => [
                'offer' => $offer,
                'score' => $this->calculateScore($student, $offer),
            ])
            ->sortByDesc('score')
            ->take($limit)
            ->pluck('offer');
    }
}
```

### Job de recalcul asynchrone

```php
// app/Jobs/RecalculateMatchingScores.php

class RecalculateMatchingScores implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public function __construct(private StudentProfile $student) {}

    public function handle(MatchingService $matching): void
    {
        // Recalculer le score de toutes les candidatures en attente
        $this->student->applications()
            ->where('status', 'pending')
            ->with('offer.skills')
            ->each(function (Application $app) use ($matching) {
                $app->update([
                    'matching_score' => $matching->calculateScore($this->student, $app->offer)
                ]);
            });
    }
}

// Déclencher quand le profil est mis à jour :
// Dans StudentProfileController::update()
RecalculateMatchingScores::dispatch($studentProfile);
```

---

## 9. Notifications & Queue

### Notification email

```php
// app/Notifications/ApplicationStatusChangedNotification.php

class ApplicationStatusChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private Application $application) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $status  = $this->application->status;
        $company = $this->application->offer->company->name;
        $offer   = $this->application->offer->title;

        return (new MailMessage)
            ->subject("Candidature {$status} — {$offer}")
            ->greeting("Bonjour {$notifiable->name},")
            ->line("Votre candidature pour \"{$offer}\" chez {$company} a été **{$status}**.")
            ->action('Voir ma candidature', url("/applications/{$this->application->id}"))
            ->salutation('L\'équipe StageConnect');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'application_id' => $this->application->id,
            'offer_title'    => $this->application->offer->title,
            'status'         => $this->application->status,
        ];
    }
}
```

### Scheduler

```php
// app/Console/Commands/ExpireOffersCommand.php

class ExpireOffersCommand extends Command
{
    protected $signature   = 'offers:expire';
    protected $description = 'Marquer les offres expirées';

    public function handle(): void
    {
        $count = Offer::active()
            ->where('expires_at', '<', now())
            ->update(['status' => 'expired']);

        $this->info("{$count} offre(s) expirée(s).");
    }
}

// routes/console.php
Schedule::command('offers:expire')->daily();
```

---

## 10. Tests

### Test Auth (Pest)

```php
// tests/Feature/Auth/AuthTest.php

it('can register a student', function () {
    $response = $this->postJson('/api/v1/auth/register', [
        'name'                  => 'Jean Dupont',
        'email'                 => 'jean@test.cm',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
        'role'                  => 'student',
    ]);

    $response->assertStatus(201)
             ->assertJsonStructure(['user' => ['id', 'name', 'email', 'role']]);

    $this->assertDatabaseHas('users', ['email' => 'jean@test.cm']);
});

it('cannot login with wrong credentials', function () {
    $this->postJson('/api/v1/auth/login', [
        'email'    => 'nobody@test.cm',
        'password' => 'wrong',
    ])->assertStatus(401);
});
```

### Test Matching (Pest Unit)

```php
// tests/Unit/Services/MatchingServiceTest.php

it('returns 100% when all criteria match perfectly', function () {
    $student = StudentProfile::factory()->create([
        'level'             => 'M1',
        'city'              => 'Yaoundé',
        'languages'         => ['Français', 'Anglais'],
        'availability_from' => now(),
    ]);

    $offer = Offer::factory()->create([
        'level_required' => 'M1',
        'city'           => 'Yaoundé',
        'remote'         => false,
        'languages'      => ['Français'],
        'expires_at'     => now()->addMonths(3),
    ]);

    $skill = Skill::factory()->create();
    $student->skills()->attach($skill);
    $offer->skills()->attach($skill);

    $score = app(MatchingService::class)->calculateScore($student, $offer);

    expect($score)->toBe(100.0);
});

it('gives full location score when offer is remote', function () {
    $student = StudentProfile::factory()->create(['city' => 'Bertoua']);
    $offer   = Offer::factory()->create(['remote' => true, 'city' => 'Douala']);

    $service = app(MatchingService::class);
    $score   = $service->calculateScore($student, $offer);

    // Le score de localisation doit être maximal (20 pts)
    expect($score)->toBeGreaterThanOrEqual(20);
});
```

### Test Candidature (Pest Feature)

```php
it('student can apply to an offer', function () {
    $student = User::factory()->student()->create();
    StudentProfile::factory()->for($student)->create();

    $offer = Offer::factory()->active()->create();

    $response = $this->actingAs($student)
        ->postJson('/api/v1/applications', [
            'offer_id'     => $offer->id,
            'cover_letter' => 'Je suis très motivé par cette offre.',
        ]);

    $response->assertStatus(201)
             ->assertJsonPath('data.status', 'pending');
});

it('student cannot apply twice to the same offer', function () {
    $student = User::factory()->student()->create();
    $profile = StudentProfile::factory()->for($student)->create();
    $offer   = Offer::factory()->active()->create();

    Application::factory()->create(['offer_id' => $offer->id, 'student_id' => $profile->id]);

    $this->actingAs($student)
        ->postJson('/api/v1/applications', ['offer_id' => $offer->id])
        ->assertStatus(422);
});
```

---

## 11. Documentation API

### Annotation Swagger exemple

```php
/**
 * @OA\Post(
 *   path="/api/v1/applications",
 *   tags={"Applications"},
 *   summary="Postuler à une offre",
 *   security={{"sanctum": {}}},
 *   @OA\RequestBody(
 *     required=true,
 *     @OA\JsonContent(
 *       required={"offer_id"},
 *       @OA\Property(property="offer_id",     type="integer", example=42),
 *       @OA\Property(property="cover_letter", type="string",  example="Je suis motivé...")
 *     )
 *   ),
 *   @OA\Response(response=201, description="Candidature créée"),
 *   @OA\Response(response=403, description="Profil incomplet ou offre fermée"),
 *   @OA\Response(response=422, description="Déjà candidaté")
 * )
 */
public function store(StoreApplicationRequest $request): JsonResponse { ... }
```

```bash
# Générer la doc
php artisan l5-swagger:generate
# Accessible sur : http://localhost:8000/api/documentation
```

---

## 12. Monétisation & Abonnements

```php
// app/Services/SubscriptionService.php

class SubscriptionService
{
    public function initiateCinetPayCheckout(CompanyProfile $company, string $plan): array
    {
        $prices = ['starter' => 15000, 'pro' => 45000];
        $transactionId = uniqid('SC_');

        $payload = [
            'apikey'         => config('services.cinetpay.api_key'),
            'site_id'        => config('services.cinetpay.site_id'),
            'transaction_id' => $transactionId,
            'amount'         => $prices[$plan],
            'currency'       => 'XAF',
            'description'    => "Abonnement {$plan} StageConnect",
            'notify_url'     => route('webhooks.cinetpay'),
            'return_url'     => config('app.frontend_url') . '/company/subscription/success',
            'customer_name'  => $company->name,
            'customer_email' => $company->user->email,
        ];

        $response = Http::post('https://api-checkout.cinetpay.com/v2/payment', $payload);

        // Stocker la transaction en attente
        Subscription::create([
            'company_id'     => $company->id,
            'plan'           => $plan,
            'price'          => $prices[$plan],
            'transaction_id' => $transactionId,
            'status'         => 'pending',
            'starts_at'      => now(),
            'ends_at'        => now()->addMonth(),
        ]);

        return $response->json();
    }

    public function handleCinetPayWebhook(array $data): void
    {
        $subscription = Subscription::where('transaction_id', $data['cpm_trans_id'])->firstOrFail();

        if ($data['cpm_result'] === '00') {  // Paiement validé
            $subscription->update(['status' => 'active']);
            $subscription->company->update(['plan' => $subscription->plan]);

            GenerateSubscriptionReceipt::dispatch($subscription);
        }
    }
}
```

---

## 13. Déploiement Backend

### `Dockerfile`

```dockerfile
FROM php:8.3-fpm-alpine

RUN apk add --no-cache postgresql-dev libpng-dev zip unzip
RUN docker-php-ext-install pdo_pgsql gd
RUN pecl install redis && docker-php-ext-enable redis

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --optimize-autoloader
RUN php artisan config:cache && php artisan route:cache

EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
```

### Script de déploiement production

```bash
#!/bin/bash
# deploy.sh

set -e

echo "→ Pull latest code"
git pull origin main

echo "→ Install dependencies"
composer install --no-dev --optimize-autoloader

echo "→ Run migrations"
php artisan migrate --force

echo "→ Clear & rebuild cache"
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "→ Restart queue workers"
php artisan queue:restart

echo "✅ Déploiement terminé"
```

### Supervisor (queue workers)

```ini
; /etc/supervisor/conf.d/stageconnect.conf

[program:stageconnect-worker]
command=php /var/www/stageconnect/artisan queue:work redis --sleep=3 --tries=3
autostart=true
autorestart=true
numprocs=2
user=www-data
stderr_logfile=/var/log/stageconnect-worker.err.log
stdout_logfile=/var/log/stageconnect-worker.out.log
```

---

## 14. Checklist par Phase

### Phase 1 — Auth & Profils
- [ ] Migration users + profils (student, company)
- [ ] `AuthController` : register, login, logout, me
- [ ] Vérification email (notification + route)
- [ ] `StudentProfileController` : CRUD + upload CV
- [ ] `CompanyProfileController` : CRUD + upload logo
- [ ] Policies (un étudiant ne peut pas éditer le profil d'un autre)
- [ ] Tests Feature : AuthTest, StudentProfileTest
- [ ] `UserResource`, `StudentProfileResource`, `CompanyProfileResource`

### Phase 2 — Offres & Candidatures
- [ ] Migration offers + offer_skill + skills
- [ ] `OfferController` : index (filtres), store, update, destroy
- [ ] Seeder skills (PHP, React, Marketing, Comptabilité...)
- [ ] `OfferPolicy` (seul l'owner peut modifier)
- [ ] Migration applications
- [ ] `ApplicationController` : store, index (student + company), accept, reject, withdraw
- [ ] `Application::booted()` : calcul score + dispatch notification job
- [ ] `SendApplicationNotification` job + mail template
- [ ] `CheckSubscriptionPlan` middleware
- [ ] Tests Feature : OfferTest, ApplicationTest

### Phase 3 — Matching & Messagerie
- [ ] `MatchingService` complet (5 critères)
- [ ] `MatchingController` : score par offre, offres recommandées
- [ ] `RecalculateMatchingScores` job (déclenché au update profil)
- [ ] Migration messages
- [ ] `MessageController` : index, store, markRead
- [ ] Migration reviews + `ReviewController`
- [ ] Tests Unit : MatchingServiceTest

### Phase 4 — Monétisation
- [ ] Migration subscriptions
- [ ] `SubscriptionService` : CinetPay + Stripe checkout
- [ ] `WebhookController` : cinetpay, stripe
- [ ] `GenerateSubscriptionReceipt` job (PDF)
- [ ] Tests : SubscriptionTest (sandbox)

### Phase 5 — Production
- [ ] `Dockerfile` + variables `.env.production`
- [ ] Script `deploy.sh`
- [ ] Supervisor configuré
- [ ] Scheduler (`offers:expire`) dans crontab
- [ ] Sentry DSN configuré
- [ ] Backup PostgreSQL automatique
- [ ] SSL Let's Encrypt
- [ ] `php artisan optimize` en production

---

*StageConnect Backend — Version 1.0 · Mars 2026*
