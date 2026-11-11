<?php

namespace App\Console\Commands;

use App\Services\BMS\OpportunityAlertService;
use Illuminate\Console\Command;

class GenerateBmsAlerts extends Command
{
    protected $signature = 'bms:generate-alerts';
    protected $description = 'Generate, re-notify and resolve opportunity follow-up alerts';

    public function handle(OpportunityAlertService $alerts): int
    {
        $count = $alerts->generate();
        $this->info("BMS opportunity notifications sent: {$count}");

        return self::SUCCESS;
    }
}
