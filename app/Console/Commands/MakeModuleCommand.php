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
                            {--q|request : Create form request}';

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

        $model = "App\\Models\\{$name}";
        $content = <<<PHP
<?php

namespace App\Repositories;

use {$model};

class {$name}Repository
{
    public function all()
    {
        return {$name}::all();
    }

    public function find(\$id)
    {
        return {$name}::findOrFail(\$id);
    }

    public function create(array \$data)
    {
        return {$name}::create(\$data);
    }

    public function update(\$id, array \$data)
    {
        \$record = {$name}::findOrFail(\$id);
        \$record->update(\$data);
        return \$record;
    }

    public function delete(\$id)
    {
        \$record = {$name}::findOrFail(\$id);
        return \$record->delete();
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

class {$name}Service
{
    protected \${$camel}Repository;

    public function __construct({$name}Repository \${$camel}Repository)
    {
        \$this->{$camel}Repository = \${$camel}Repository;
    }

    public function getAll()
    {
        return \$this->{$camel}Repository->all();
    }

    public function getById(\$id)
    {
        return \$this->{$camel}Repository->find(\$id);
    }

    public function create(array \$data)
    {
        return \$this->{$camel}Repository->create(\$data);
    }

    public function update(\$id, array \$data)
    {
        return \$this->{$camel}Repository->update(\$id, \$data);
    }

    public function delete(\$id)
    {
        return \$this->{$camel}Repository->delete(\$id);
    }
}
PHP;
        file_put_contents($path, $content);
        $this->info("🧩 Service created: {$path}");
    }
}
