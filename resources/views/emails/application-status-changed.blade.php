<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<h1>Application Status Updated</h1>
<p>Your application for <strong>{{ $application->offer->title }}</strong> has been updated.</p>
<p>New status: <strong>{{ ucfirst($application->status) }}</strong></p>
</body>
</html>
