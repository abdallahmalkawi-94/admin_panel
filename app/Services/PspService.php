<?php

namespace App\Services;

use App\Repositories\PspRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PspService
{
    protected PspRepository $pspRepository;

    public function __construct(PspRepository $pspRepository)
    {
        $this->pspRepository = $pspRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->pspRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->pspRepository->findById($id);
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        try {
            DB::beginTransaction();

            // Handle attachment upload if present
            if (isset($data['attachment']) && $data['attachment']) {
                $data['attachment'] = $data['attachment']->store('psps/attachments', 'public');
            }

            $data["code"] = strtolower(str_replace(' ', '', $data['name']));
            $psp = $this->pspRepository->create($data);

            DB::commit();
            $this->bumpIndexCacheVersion();
            return $psp->load(['status', 'country', 'settlementCurrency']);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        try {
            DB::beginTransaction();

            $psp = $this->pspRepository->findById($id);

            if (!$psp) {
                throw new Exception('PSP not found');
            }

            // Handle attachment upload if present
            if (isset($data['attachment']) && $data['attachment']) {
                // Delete old attachment if exists
                if ($psp->attachment) {
                    Storage::disk('public')->delete($psp->attachment);
                }
                $data['attachment'] = $data['attachment']->store('psps/attachments', 'public');
            }

            if (is_null($data['password'])) {
                unset($data['password']);
            }

            $psp = $this->pspRepository->update($data, $id);

            DB::commit();
            $this->bumpIndexCacheVersion();
            return $psp->load(['status', 'country', 'settlementCurrency']);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function delete($id, $force = false): bool
    {
        $deleted = $this->pspRepository->delete($id, $force);
        $this->bumpIndexCacheVersion();
        return $deleted;
    }

    private function bumpIndexCacheVersion(): void
    {
        $currentVersion = Cache::get('psps.index.version', 1);
        Cache::put('psps.index.version', $currentVersion + 1);
    }
}
