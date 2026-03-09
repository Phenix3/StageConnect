<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Subscription Receipt</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">
    <div style="background:#1d4ed8;padding:24px 32px">
      <h1 style="margin:0;color:#fff;font-size:20px">StageConnect</h1>
    </div>
    <div style="padding:32px">
      <h2 style="margin-top:0;font-size:18px">Subscription Confirmed 🎉</h2>
      <p style="color:#374151">Thank you, <strong>{{ $subscription->company->name }}</strong>!</p>
      <p style="color:#374151">Your <strong style="text-transform:capitalize">{{ $subscription->plan }}</strong> plan is now active.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr style="border-bottom:1px solid #f3f4f6">
          <td style="padding:8px 0;color:#6b7280">Plan</td>
          <td style="padding:8px 0;font-weight:600;text-transform:capitalize">{{ $subscription->plan }}</td>
        </tr>
        <tr style="border-bottom:1px solid #f3f4f6">
          <td style="padding:8px 0;color:#6b7280">Amount</td>
          <td style="padding:8px 0;font-weight:600">€{{ number_format($subscription->price, 2) }}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280">Valid until</td>
          <td style="padding:8px 0">{{ $subscription->ends_at?->format('d/m/Y') ?? 'N/A' }}</td>
        </tr>
      </table>
      <p style="color:#6b7280;font-size:14px">The PDF receipt is attached to this email.</p>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #e5e7eb;text-align:center">
      <p style="margin:0;color:#9ca3af;font-size:12px">StageConnect · Internship Matching Platform</p>
    </div>
  </div>
</body>
</html>
