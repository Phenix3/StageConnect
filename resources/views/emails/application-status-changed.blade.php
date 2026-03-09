<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Application Update</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">
    <div style="background:#1d4ed8;padding:24px 32px">
      <h1 style="margin:0;color:#fff;font-size:20px">StageConnect</h1>
    </div>
    <div style="padding:32px">
      <h2 style="margin-top:0;font-size:18px">Application Status Updated</h2>
      <p style="color:#374151">Your application for <strong>{{ $application->offer->title }}</strong> has been updated.</p>
      @php $color = match($application->status) { 'accepted' => '#16a34a', 'rejected' => '#dc2626', default => '#6b7280' }; @endphp
      <div style="text-align:center;padding:24px 0">
        <span style="display:inline-block;background:{{ $color }};color:#fff;font-size:18px;font-weight:700;padding:12px 28px;border-radius:6px;text-transform:uppercase;letter-spacing:1px">
          {{ $application->status }}
        </span>
      </div>
      <p style="color:#6b7280;font-size:14px;text-align:center">Log in to StageConnect to view the details.</p>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #e5e7eb;text-align:center">
      <p style="margin:0;color:#9ca3af;font-size:12px">StageConnect · Internship Matching Platform</p>
    </div>
  </div>
</body>
</html>
