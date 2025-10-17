<?php

namespace App\Console\Commands;

use App\Services\LanguageService;
use Illuminate\Console\Command;

class ClearLanguageCacheCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:clear-languages';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all cached language data';

    /**
     * Execute the console command.
     */
    public function handle(LanguageService $languageService): int
    {
        $this->info('Clearing language caches...');
        
        $languageService->clearCache();
        
        $this->info('Language caches cleared successfully!');
        
        return Command::SUCCESS;
    }
}

