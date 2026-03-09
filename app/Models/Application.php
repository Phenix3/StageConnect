<?php

namespace App\Models;

use App\Jobs\SendApplicationNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'offer_id', 'student_id', 'cover_letter', 'status',
        'matching_score', 'applied_at',
    ];

    protected function casts(): array
    {
        return [
            'matching_score' => 'decimal:2',
            'applied_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Application $application) {
            if ($application->matching_score === null) {
                $student = $application->student ?? StudentProfile::find($application->student_id);
                $offer = $application->offer ?? Offer::with('skills')->find($application->offer_id);
                if ($student && $offer) {
                    $student->loadMissing('skills');
                    $application->matching_score = app(\App\Services\MatchingService::class)->calculateScore($student, $offer);
                }
            }
        });

        static::created(function (Application $application) {
            dispatch(new SendApplicationNotification($application));
        });
    }

    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(StudentProfile::class, 'student_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
