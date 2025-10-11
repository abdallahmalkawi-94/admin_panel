<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MakeModuleCommand extends Command
{
    protected $signature = 'make:module {name}
                            {--m|model : Create model and migration}
                            {--c|controller : Create controller}
                            {--r|repository : Create repository}
                            {--s|service : Create service}
                            {--p|policy : Create policy}
                            {--R|resource : Create resource}
                            {--rq|request : Create form request}';

    protected $description = 'Generate optional module components (model, controller, repository, service, policy, resource, request)';

    public function handle()
    {
        $name = Str::studly($this->argument('name'));

        $this->info("🚀 Generating module for: {$name}");

        if ($this->option('model')) {
            $this->call('make:model', ['name' => $name, '-m' => true]);
        }

        if ($this->option('controller')) {
            $this->call('make:controller', [
                'name' => "{$name}Controller",
                '--model' => $name,
                '--resource' => true
            ]);
        }

        if ($this->option('policy')) {
            $this->call('make:policy', ['name' => "{$name}Policy", '--model' => $name]);
        }

        if ($this->option('request')) {
            $this->call('make:request', ['name' => "Store{$name}Request"]);
            $this->call('make:request', ['name' => "Update{$name}Request"]);
        }

        if ($this->option('resource')) {
            $this->call('make:resource', ['name' => "{$name}Resource"]);
        }

        if ($this->option('repository')) {
            $this->createRepository($name);
        }

        if ($this->option('service')) {
            $this->createService($name);
        }

        $this->info("✅ Module for {$name} created successfully!");
    }

    protected function createRepository(string $name)
    {
        $dir = app_path('Repositories');
        if (!is_dir($dir)) mkdir($dir, 0755, true);

        $path = "{$dir}/{$name}Repository.php";
        if (file_exists($path)) {
            $this->warn("⚠️ Repository already exists: {$path}");
            return;
        }

        $content = <<<PHP
<?php

namespace App\Repositories;

use App\\Models\\{$name};
use Illuminate\Database\Eloquent\Model;

class {$name}Repository extends BaseRepository
{
    protected Model \$model;

    public function __construct($name \$model) {
        parent::__construct(\$model);
    }
}
PHP;
        file_put_contents($path, $content);
        $this->info("🗂 Repository created: {$path}");
    }

    protected function createService(string $name)
    {
        $dir = app_path('Services');
        if (!is_dir($dir)) mkdir($dir, 0755, true);

        $path = "{$dir}/{$name}Service.php";
        if (file_exists($path)) {
            $this->warn("⚠️ Service already exists: {$path}");
            return;
        }

        $repository = "App\\Repositories\\{$name}Repository";
        $camel = Str::camel($name);
        $content = <<<PHP
<?php

namespace App\Services;

use {$repository};
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class {$name}Service
{
    protected {$name}Repository \${$camel}Repository;

    public function __construct({$name}Repository \${$camel}Repository)
    {
        \$this->{$camel}Repository = \${$camel}Repository;
    }

    public function paginate(\$perPage = 10): Collection|LengthAwarePaginator
    {
        return \$this->{$camel}Repository->paginate(\$perPage);
    }

    public function find(\$id): ?Model
    {
        return \$this->{$camel}Repository->findById(\$id);
    }

    /**
     * @throws Exception
     */
    public function create(array \$data): Model
    {
        return \$this->{$camel}Repository->create(\$data);
    }

    /**
     * @throws Exception
     */
    public function update(\$id, array \$data): ?Model
    {
        return \$this->{$camel}Repository->update(\$data, \$id);
    }

    public function delete(\$id, \$force = false): bool
    {
        return \$this->{$camel}Repository->delete(\$id, \$force);
    }
}
PHP;
        file_put_contents($path, $content);
        $this->info("🧩 Service created: {$path}");
    }
}
