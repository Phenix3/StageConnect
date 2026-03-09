<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'cover_letter' => $this->cover_letter,
            'matching_score' => $this->matching_score,
            'applied_at' => $this->applied_at,
            'offer' => new OfferResource($this->whenLoaded('offer')),
            'student' => new StudentProfileResource($this->whenLoaded('student')),
        ];
    }
}
