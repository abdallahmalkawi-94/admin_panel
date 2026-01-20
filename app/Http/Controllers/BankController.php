<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBankRequest;
use App\Http\Requests\UpdateBankRequest;
use App\Http\Resources\BankResource;
use App\Models\Bank;
use App\Services\BankService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Response;
use Inertia\ResponseFactory;

class BankController extends Controller
{
    protected BankService $bankService;

    public function __construct(BankService $bankService)
    {
        $this->bankService = $bankService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|ResponseFactory
    {
        $perPage = $request->input('per_page', 10);
        $filters = $request->only(['name']);

        $cacheVersion = Cache::get('banks.index.version', 1);
        $cacheKey = 'banks.index.v' . $cacheVersion . '.' . md5(json_encode($request->query()));
        $cacheTtlSeconds = 300;

        $payload = Cache::remember($cacheKey, $cacheTtlSeconds, function () use ($perPage, $filters) {
            return [
                'banks' => $this->bankService->paginate($perPage, $filters),
            ];
        });

        return inertia('banks/index', [
            'banks' => BankResource::collection($payload['banks']),
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response|ResponseFactory
    {
        return inertia('banks/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBankRequest $request): RedirectResponse
    {
        try {
            $this->bankService->create($request->validated());
            return redirect()->route('banks.index')->with('success', 'Bank created successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->withInput()->with('error', 'Failed to create bank: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Bank $bank): Response|ResponseFactory
    {
        return inertia('banks/show', [
            'bank' => (new BankResource($bank))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bank $bank): Response|ResponseFactory
    {
        return inertia('banks/edit', [
            'bank' => (new BankResource($bank))->resolve(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBankRequest $request, Bank $bank): RedirectResponse
    {
        try {
            $this->bankService->update($bank->id, $request->validated());

            return redirect()->route('banks.index')
                ->with('success', 'Bank updated successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()
                ->withInput()
                ->with('error', 'Failed to update bank: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bank $bank): RedirectResponse
    {
        try {
            $this->bankService->delete($bank->id);

            return redirect()->route('banks.index')
                ->with('success', 'Bank deleted successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->with('error', 'Failed to delete bank: ' . $e->getMessage());
        }
    }
}
