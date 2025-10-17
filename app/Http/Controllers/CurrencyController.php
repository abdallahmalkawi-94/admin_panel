<?php

namespace App\Http\Controllers;

use App\Http\Resources\CurrencyResource;
use App\Models\Currency;
use App\Services\CurrencyService;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\ResponseFactory;

class CurrencyController extends Controller
{
    protected CurrencyService $currencyService;

    public function __construct(CurrencyService $currencyService)
    {
        $this->currencyService = $currencyService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|ResponseFactory
    {
        $perPage = $request->input('per_page', 10);

        $filters = $request->only(['name', 'code']);

        $currencies = $this->currencyService->paginate($perPage, $filters);

        return inertia('currencies/index', [
            'currencies' => CurrencyResource::collection($currencies),
            'filters' => $filters,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Currency $currency): Response|ResponseFactory
    {
        $currency->load(['country']);

        return inertia('currencies/show', [
            'currency' => (new CurrencyResource($currency))->resolve(),
        ]);
    }
}

