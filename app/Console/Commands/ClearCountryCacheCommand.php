<?php

namespace App\Console\Commands;

use App\Services\CountryService;
use Illuminate\Console\Command;

class ClearCountryCacheCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:clear-countries';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all cached country data';

    /**
     * Execute the console command.
     */
    public function handle(CountryService $countryService): int
    {
        $this->info('Clearing country caches...');
        
        $countryService->clearCache();
        
        $this->info('Country caches cleared successfully!');
        
        return Command::SUCCESS;
    }
}

