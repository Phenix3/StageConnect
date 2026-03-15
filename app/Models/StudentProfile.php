<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudentProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'bio', 'level', 'school', 'city',
        'languages', 'cv_path', 'availability_from', 'availability_to',
    ];

    protected function casts(): array
    {
        return [
            'languages' => 'array',
            'availability_from' => 'date',
            'availability_to' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'student_skill');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'student_id');
    }

    public function savedOffers(): BelongsToMany
    {
        return $this->belongsToMany(Offer::class, 'saved_offers', 'student_id', 'offer_id')
            ->withPivot('created_at');
    }
}
