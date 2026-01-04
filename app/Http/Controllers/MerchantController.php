<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMerchantRequest;
use App\Http\Requests\UpdateMerchantRequest;
use App\Http\Resources\MerchantResource;
use App\Models\Merchant;
use App\Models\MerchantStatus;
use App\Services\MerchantService;
use App\Services\ProductService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\ResponseFactory;

class MerchantController extends Controller
{
    protected MerchantService $merchantService;
    protected ProductService $productService;

    public function __construct(
        MerchantService $merchantService,
        ProductService $productService
    ) {
        $this->merchantService = $merchantService;
        $this->productService = $productService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|ResponseFactory
    {
        $perPage = $request->input('per_page', 10);
        $filters = $request->only(['name', 'status_id', 'product_id', 'is_live']);

        $merchants = $this->merchantService->paginate($perPage, $filters);
        $statuses = MerchantStatusesDropDown();
        $products = ProductsDropDown();
        return inertia('merchants/index', [
            'merchants' => MerchantResource::collection($merchants),
            'filters' => $filters,
            'statuses' => $statuses,
            'products' => $products,
        ]);
    }

    /**
     * Get parent merchants by product ID
     */
    public function getParentMerchantsByProduct(Request $request): JsonResponse
    {
        // Validate the request
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
        ]);

        $productId = (int) $validated['product_id'];

        $merchants = $this->merchantService->getParentMerchantsByProduct($productId);

        return response()->json([
            'merchants' => $merchants->map(fn($merchant) => [
                'id' => $merchant->id,
                'en_name' => $merchant->en_name,
                'ar_name' => $merchant->ar_name,
            ])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response|ResponseFactory
    {
        $products = ProductsDropDown();
        $statuses = MerchantStatusesDropDown();
        $banks = BanksDropDown();
        $termsAndConditions = TermsAndConditionsDropDown();
        $merchants = MerchantsDropDown();
        $countries = CountriesDropDown();
        $currencies = CurrenciesDropDown();
        $invoiceTypes = InvoiceTypesDropDown();

        return inertia('merchants/create', [
            'products' => $products,
            'statuses' => $statuses,
            'banks' => $banks,
            'termsAndConditions' => $termsAndConditions,
            'merchants' => $merchants,
            'countries' => $countries,
            'currencies' => $currencies,
            'invoiceTypes' => $invoiceTypes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMerchantRequest $request): RedirectResponse
    {
        try {
            $this->merchantService->create($request->validated());
            return redirect()->route('merchants.index')->with('success', 'Merchant created successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->withInput()->with('error', 'Failed to create merchant: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Merchant $merchant): Response|ResponseFactory
    {
        $merchant->load(['status', 'product', 'parentMerchant', 'settings.bank', 'settings.termsAndCondition', 'settings.currency', 'settings.country', 'invoiceTypes']);

        return inertia('merchants/show', [
            'merchant' => (new MerchantResource($merchant))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Merchant $merchant): Response|ResponseFactory
    {
        $merchant->load(['status', 'product', 'parentMerchant', 'settings.bank', 'settings.termsAndCondition', 'settings.currency', 'settings.country', 'invoiceTypes']);

        $products = ProductsDropDown();
        $statuses = MerchantStatusesDropDown();
        $banks = BanksDropDown();
        $termsAndConditions = TermsAndConditionsDropDown();
        $merchants = MerchantsDropDown();
        $countries = CountriesDropDown();
        $currencies = CurrenciesDropDown();
        $invoiceTypes = InvoiceTypesDropDown();

        return inertia('merchants/edit', [
            'merchant' => (new MerchantResource($merchant))->resolve(),
            'products' => $products,
            'statuses' => $statuses,
            'banks' => $banks,
            'termsAndConditions' => $termsAndConditions,
            'merchants' => $merchants,
            'countries' => $countries,
            'currencies' => $currencies,
            'invoiceTypes' => $invoiceTypes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMerchantRequest $request, Merchant $merchant): RedirectResponse
    {
        try {
            $this->merchantService->update($merchant->id, $request->validated());

            return redirect()->route('merchants.show', $merchant->getAttribute('id'))->with('success', 'Merchant updated successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()
                ->withInput()
                ->with('error', 'Failed to update merchant: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Merchant $merchant): RedirectResponse
    {
        try {
            $this->merchantService->delete($merchant->id);

            return redirect()->route('merchants.index')
                ->with('success', 'Merchant deleted successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->with('error', 'Failed to delete merchant: ' . $e->getMessage());
        }
    }
}

