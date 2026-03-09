<?php

namespace App\Console\Commands;

use App\Models\Offer;
use Illuminate\Console\Command;

class ExpireOffersCommand extends Command
{
    protected $signature = 'offers:expire';

    protected $description = 'Mark offers with past expiry date as expired';

    public function handle(): int
    {
        $count = Offer::where('status', 'active')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now()->toDateString())
            ->update(['status' => 'expired']);

        $this->info("Expired {$count} offer(s).");

        return Command::SUCCESS;
    }
}
