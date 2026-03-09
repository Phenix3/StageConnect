<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<h1>Thank you for your subscription!</h1>
<p>Hello {{ $subscription->company->name }},</p>
<p>Your <strong>{{ ucfirst($subscription->plan) }}</strong> plan is now active.</p>
<p>Valid until: {{ $subscription->ends_at?->format('d/m/Y') }}</p>
<p>Please find your receipt attached.</p>
</body>
</html>
