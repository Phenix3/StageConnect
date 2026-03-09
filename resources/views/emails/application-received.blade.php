<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Application</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">
    <div style="background:#1d4ed8;padding:24px 32px">
      <h1 style="margin:0;color:#fff;font-size:20px">StageConnect</h1>
    </div>
    <div style="padding:32px">
      <h2 style="margin-top:0;font-size:18px">New Application Received</h2>
      <p style="color:#374151">You have received a new application for: <strong>{{ $application->offer->title }}</strong></p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr style="border-bottom:1px solid #f3f4f6">
          <td style="padding:8px 0;color:#6b7280">Applicant</td>
          <td style="padding:8px 0;font-weight:600">{{ $application->student->user->name }}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280">Applied at</td>
          <td style="padding:8px 0">{{ $application->applied_at->format('d/m/Y H:i') }}</td>
        </tr>
      </table>
      @if($application->cover_letter)
      <div style="background:#f9fafb;border-radius:6px;padding:16px;margin-top:16px">
        <p style="margin-top:0;font-weight:600;font-size:14px">Cover Letter</p>
        <p style="margin:0;color:#374151;font-size:14px">{{ $application->cover_letter }}</p>
      </div>
      @endif
    </div>
    <div style="padding:16px 32px;border-top:1px solid #e5e7eb;text-align:center">
      <p style="margin:0;color:#9ca3af;font-size:12px">StageConnect · Internship Matching Platform</p>
    </div>
  </div>
</body>
</html>
