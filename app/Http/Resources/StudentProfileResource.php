<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'bio' => $this->bio,
            'level' => $this->level,
            'school' => $this->school,
            'city' => $this->city,
            'languages' => $this->languages,
            'availability_from' => $this->availability_from,
            'availability_to' => $this->availability_to,
            'cv_path' => $this->cv_path,
            'user' => new UserResource($this->whenLoaded('user')),
            'skills' => SkillResource::collection($this->whenLoaded('skills')),
        ];
    }
}
