<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'sector' => $this->sector,
            'size' => $this->size,
            'description' => $this->description,
            'website' => $this->website,
            'logo' => $this->logo,
            'verified' => $this->verified,
            'plan' => $this->plan,
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
