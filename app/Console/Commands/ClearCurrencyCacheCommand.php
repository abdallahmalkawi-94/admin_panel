<?php

namespace App\Console\Commands;

use App\Services\CurrencyService;
use Illuminate\Console\Command;

class ClearCurrencyCacheCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:clear-currencies';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all cached currency data';

    /**
     * Execute the console command.
     */
    public function handle(CurrencyService $currencyService): int
    {
        $this->info('Clearing currency caches...');
        
        $currencyService->clearCache();
        
        $this->info('Currency caches cleared successfully!');
        
        return Command::SUCCESS;
    }
}

