<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOfferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isCompany() ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'duration' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:255'],
            'remote' => ['boolean'],
            'type' => ['required', 'in:stage,alternance,emploi'],
            'level_required' => ['nullable', 'in:bac,bac+1,bac+2,bac+3,bac+4,bac+5,bac+8'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:50'],
            'expires_at' => ['nullable', 'date', 'after:today'],
            'skill_ids' => ['nullable', 'array'],
            'skill_ids.*' => ['integer', 'exists:skills,id'],
            'is_required' => ['nullable', 'array'],
            'is_required.*' => ['boolean'],
        ];
    }
}
