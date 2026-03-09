<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Skill extends Model
{
    protected $fillable = ['name', 'slug'];

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(StudentProfile::class, 'student_skill');
    }

    public function offers(): BelongsToMany
    {
        return $this->belongsToMany(Offer::class, 'offer_skill')->withPivot('is_required');
    }
}
