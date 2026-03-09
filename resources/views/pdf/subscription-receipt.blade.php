<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 14px; color: #333; }
        .header { text-align: center; padding: 30px 0; border-bottom: 2px solid #e5e7eb; }
        .header h1 { margin: 0; font-size: 24px; color: #1d4ed8; }
        .content { padding: 30px; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
        .label { color: #6b7280; }
        .value { font-weight: bold; }
        .total { font-size: 18px; color: #1d4ed8; }
        .footer { text-align: center; margin-top: 40px; color: #9ca3af; font-size: 12px; }
    </style>
</head>
<body>
<div class="header">
    <h1>StageConnect</h1>
    <p>Subscription Receipt</p>
</div>
<div class="content">
    <p><strong>Company:</strong> {{ $company->name }}</p>
    <p><strong>Receipt #:</strong> {{ $subscription->transaction_id }}</p>
    <p><strong>Date:</strong> {{ $subscription->starts_at?->format('d/m/Y') ?? now()->format('d/m/Y') }}</p>

    <div class="row">
        <span class="label">Plan</span>
        <span class="value">{{ ucfirst($subscription->plan) }}</span>
    </div>
    <div class="row">
        <span class="label">Status</span>
        <span class="value">{{ ucfirst($subscription->status) }}</span>
    </div>
    <div class="row">
        <span class="label">Valid Until</span>
        <span class="value">{{ $subscription->ends_at?->format('d/m/Y') ?? 'N/A' }}</span>
    </div>
    <div class="row">
        <span class="label total">Total Paid</span>
        <span class="value total">€{{ number_format($subscription->price, 2) }}</span>
    </div>
</div>
<div class="footer">
    <p>Thank you for choosing StageConnect. This document serves as your official receipt.</p>
</div>
</body>
</html>
