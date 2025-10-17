<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCountryRequest;
use App\Http\Requests\UpdateCountryRequest;
use App\Http\Resources\CountryResource;
use App\Models\Country;
use App\Services\CountryService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\ResponseFactory;

class CountryController extends Controller
{
    protected CountryService $countryService;

    public function __construct(CountryService $countryService)
    {
        $this->countryService = $countryService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|ResponseFactory
    {
        $perPage = $request->input('per_page', 10);

        $filters = $request->only(['name', 'region', 'iso2', 'status']);

        $countries = $this->countryService->paginate($perPage, $filters);
        $regions = Country::regions(); // Direct static call - cached

        return inertia('countries/index', [
            'countries' => CountryResource::collection($countries),
            'filters' => $filters,
            'regions' => $regions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response|ResponseFactory
    {
        $regions = Country::regions(); // Direct static call - cached

        return inertia('countries/create', [
            'regions' => $regions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCountryRequest $request): RedirectResponse
    {
        try {
            $country = $this->countryService->create($request->validated());
            return redirect()->route('countries.index')
                ->with('success', "Country '{$country->name}' created successfully.");
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->withInput()->with('error', 'Failed to create country: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Country $country): Response|ResponseFactory
    {
        return inertia('countries/show', [
            'country' => (new CountryResource($country))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Country $country): Response|ResponseFactory
    {
        $regions = Country::regions(); // Direct static call - cached

        return inertia('countries/edit', [
            'country' => (new CountryResource($country))->resolve(),
            'regions' => $regions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCountryRequest $request, Country $country): RedirectResponse
    {
        try {
            $this->countryService->update($country->id, $request->validated());

            return redirect()->route('countries.index')
                ->with('success', 'Country updated successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()
                ->withInput()
                ->with('error', 'Failed to update country: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Country $country): RedirectResponse
    {
        try {
            $this->countryService->delete($country->id);

            return redirect()->route('countries.index')
                ->with('success', 'Country deleted successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->with('error', 'Failed to delete country: ' . $e->getMessage());
        }
    }
}

