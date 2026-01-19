<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePspRequest;
use App\Http\Requests\UpdatePspRequest;
use App\Http\Resources\PspResource;
use App\Models\Psp;
use App\Services\PspService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Response;
use Inertia\ResponseFactory;

class PspController extends Controller
{
    protected PspService $pspService;

    public function __construct(PspService $pspService)
    {
        $this->pspService = $pspService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|ResponseFactory
    {
        $perPage = $request->input('per_page', 10);
        $filters = $request->only(['name', 'code', 'country_id', 'psp_status_id']);

        $cacheVersion = Cache::get('psps.index.version', 1);
        $cacheKey = 'psps.index.v' . $cacheVersion . '.' . md5(json_encode($request->query()));
        $cacheTtlSeconds = 300;

        $payload = Cache::remember($cacheKey, $cacheTtlSeconds, function () use ($perPage, $filters) {
            return [
                'psps' => $this->pspService->paginate($perPage, $filters),
                'statuses' => PspStatusesDropDown(),
                'countries' => CountriesDropDown(),
            ];
        });

        return inertia('psps/index', [
            'psps' => PspResource::collection($payload['psps']),
            'filters' => $filters,
            'statuses' => $payload['statuses'],
            'countries' => $payload['countries'],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response|ResponseFactory
    {
        $countries = CountriesDropDown();
        $currencies = CurrenciesDropDown();
        $statuses = PspStatusesDropDown();
        $banks = BanksDropDown();

        return inertia('psps/create', [
            'countries' => $countries,
            'currencies' => $currencies,
            'statuses' => $statuses,
            'banks' => $banks,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePspRequest $request): RedirectResponse
    {
        try {
            $this->pspService->create($request->validated());
            return redirect()->route('psps.index')->with('success', 'PSP created successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->withInput()->with('error', 'Failed to create PSP: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Psp $psp): Response|ResponseFactory
    {
        $psp->load(['status', 'country', 'settlementCurrency', 'bank']);

        return inertia('psps/show', [
            'psp' => (new PspResource($psp))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Psp $psp): Response|ResponseFactory
    {
        $psp->load(['status', 'country', 'settlementCurrency']);

        $countries = CountriesDropDown();
        $currencies = CurrenciesDropDown();
        $statuses = PspStatusesDropDown();
        $banks = BanksDropDown();

        return inertia('psps/edit', [
            'psp' => (new PspResource($psp))->resolve(),
            'countries' => $countries,
            'currencies' => $currencies,
            'statuses' => $statuses,
            'banks' => $banks,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePspRequest $request, Psp $psp): RedirectResponse
    {
        try {
            $this->pspService->update($psp->id, $request->validated());
            return redirect()->route('psps.show', $psp->id)->with('success', 'PSP updated successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()
                ->withInput()
                ->with('error', 'Failed to update PSP: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Psp $psp): RedirectResponse
    {
        try {
            $this->pspService->delete($psp->id);
            return redirect()->route('psps.index')
                ->with('success', 'PSP deleted successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->with('error', 'Failed to delete PSP: ' . $e->getMessage());
        }
    }
}
