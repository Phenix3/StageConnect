<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfferResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'duration' => $this->duration,
            'city' => $this->city,
            'remote' => $this->remote,
            'type' => $this->type,
            'level_required' => $this->level_required,
            'languages' => $this->languages,
            'status' => $this->status,
            'is_premium' => $this->is_premium,
            'expires_at' => $this->expires_at,
            'created_at' => $this->created_at,
            'company' => new CompanyProfileResource($this->whenLoaded('company')),
            'skills' => SkillResource::collection($this->whenLoaded('skills')),
        ];
    }
}
