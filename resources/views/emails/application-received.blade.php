<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<h1>New Application Received</h1>
<p>You have received a new application for: <strong>{{ $application->offer->title }}</strong></p>
<p>Applicant: {{ $application->student->user->name }}</p>
<p>Applied at: {{ $application->applied_at->format('d/m/Y H:i') }}</p>
@if($application->cover_letter)
<h2>Cover Letter</h2>
<p>{{ $application->cover_letter }}</p>
@endif
</body>
</html>
