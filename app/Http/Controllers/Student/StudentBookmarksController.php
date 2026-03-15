<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentBookmarksController extends Controller
{
    public function index(Request $request): Response
    {
        $student = $request->user()->studentProfile;

        $savedOffers = $student
            ? $student->savedOffers()->with(['company', 'skills'])->latest('saved_offers.created_at')->paginate(15)
            : collect();

        return Inertia::render('student/bookmarks', [
            'offers' => $savedOffers,
        ]);
    }
}
