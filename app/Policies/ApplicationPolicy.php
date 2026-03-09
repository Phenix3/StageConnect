<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    public function accept(User $user, Application $application): bool
    {
        return $user->isCompany()
            && $user->companyProfile?->id === $application->offer->company_id;
    }

    public function reject(User $user, Application $application): bool
    {
        return $this->accept($user, $application);
    }

    public function withdraw(User $user, Application $application): bool
    {
        return $user->isStudent()
            && $user->studentProfile?->id === $application->student_id;
    }
}
