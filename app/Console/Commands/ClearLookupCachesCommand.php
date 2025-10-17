<?php

namespace App\Console\Commands;

use App\Services\CountryService;
use App\Services\CurrencyService;
use App\Services\LanguageService;
use Illuminate\Console\Command;

class ClearLookupCachesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:clear-lookups';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all lookup caches (countries, currencies, languages)';

    /**
     * Execute the console command.
     */
    public function handle(
        CountryService $countryService,
        CurrencyService $currencyService,
        LanguageService $languageService
    ): int {
        $this->info('Clearing all lookup caches...');
        
        $this->line('- Clearing country caches...');
        $countryService->clearCache();
        
        $this->line('- Clearing currency caches...');
        $currencyService->clearCache();
        
        $this->line('- Clearing language caches...');
        $languageService->clearCache();
        
        $this->info('All lookup caches cleared successfully!');
        
        return Command::SUCCESS;
    }
}

