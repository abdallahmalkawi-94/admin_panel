<?php

namespace App\Http\Controllers;

use App\Http\Resources\PayerProfileResource;
use App\Models\PayerProfile;
use App\Services\PayerProfileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Response;
use Inertia\ResponseFactory;

class PayerProfileController extends Controller
{
    protected PayerProfileService $payerProfileService;

    public function __construct(PayerProfileService $payerProfileService)
    {
        $this->payerProfileService = $payerProfileService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|ResponseFactory
    {
        $perPage = $request->input('per_page', 10);
        $filters = $request->only([
            'name',
            'username',
            'email',
            'mobile_number',
            'status',
            'product_id',
            'merchant_id',
        ]);

        $cacheVersion = Cache::get('payer_profiles.index.version', 1);
        $cacheKey = 'payer_profiles.index.v' . $cacheVersion . '.' . md5(json_encode($request->query()));
        $cacheTtlSeconds = 300;

        $payload = Cache::remember($cacheKey, $cacheTtlSeconds, function () use ($perPage, $filters) {
            return [
                'payerProfiles' => $this->payerProfileService->paginate($perPage, $filters),
                'products' => ProductsDropDown(),
                'merchants' => MerchantsDropDown(),
            ];
        });

        $payload['payerProfiles']->load(['product', 'merchant']);

        return inertia('payer-profiles/index', [
            'payerProfiles' => PayerProfileResource::collection($payload['payerProfiles']),
            'filters' => $filters,
            'products' => $payload['products'],
            'merchants' => $payload['merchants'],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PayerProfile $payerProfile): Response|ResponseFactory
    {
        $payerProfile->load(['product', 'merchant']);

        return inertia('payer-profiles/show', [
            'payerProfile' => (new PayerProfileResource($payerProfile))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PayerProfile $payerProfile)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PayerProfile $payerProfile)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PayerProfile $payerProfile)
    {
        //
    }
}
