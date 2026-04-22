<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMerchantPaymentMethodsRequest;
use App\Http\Requests\StorePspPaymentMethodRequest;
use App\Http\Requests\UpdatePspPaymentMethodRequest;
use App\Http\Resources\InvoiceTypeResource;
use App\Http\Resources\MerchantResource;
use App\Http\Resources\PspPaymentMethodResource;
use App\Models\Merchant;
use App\Models\PspPaymentMethod;
use App\Services\PspPaymentMethodService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Response;
use Inertia\ResponseFactory;

class PspPaymentMethodController extends Controller
{
    protected PspPaymentMethodService $pspPaymentMethodService;

    public function __construct(PspPaymentMethodService $pspPaymentMethodService)
    {
        $this->pspPaymentMethodService = $pspPaymentMethodService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|ResponseFactory
    {
        $perPage = $request->input('per_page', 10);
        $filters = $request->only(['psp_id', 'payment_method_id', 'is_active']);

        $pspPaymentMethods = $this->pspPaymentMethodService->paginate($perPage, $filters);

        return inertia('psp-payment-methods/index', [
            'pspPaymentMethods' => PspPaymentMethodResource::collection($pspPaymentMethods),
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response|ResponseFactory
    {
        $psps = PspsDropDown();
        $refundOptions = RefundOptionsDropDown();
        $payoutModels = PayoutModelsDropDown();

        return inertia('psp-payment-methods/create', [
            'psps' => $psps,
            'refundOptions' => $refundOptions,
            'payoutModels' => $payoutModels,
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePspPaymentMethodRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();
            $count = count($validated['payment_methods_config'] ?? []);
            $this->pspPaymentMethodService->create($validated);
            return redirect()->route('psp-payment-methods.index')->with('success', "{$count} PSP Payment Method(s) created successfully.");
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->withInput()->with('error', 'Failed to create PSP Payment Method: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PspPaymentMethod $pspPaymentMethod): Response|ResponseFactory
    {
        $pspPaymentMethod->load(['psp', 'paymentMethod', 'merchant', 'invoiceType']);
        return inertia('psp-payment-methods/show', [
            'pspPaymentMethod' => (new PspPaymentMethodResource($pspPaymentMethod))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PspPaymentMethod $pspPaymentMethod): Response|ResponseFactory
    {
        $pspPaymentMethod->load(['psp', 'paymentMethod', 'merchant', 'invoiceType']);
        $refundOptions = RefundOptionsDropDown();
        $payoutModels = PayoutModelsDropDown();

        return inertia('psp-payment-methods/edit', [
            'pspPaymentMethod' => (new PspPaymentMethodResource($pspPaymentMethod))->resolve(),
            'refundOptions' => $refundOptions,
            'payoutModels' => $payoutModels,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePspPaymentMethodRequest $request, PspPaymentMethod $pspPaymentMethod): RedirectResponse
    {
        try {
            $updatedPspPaymentMethod = $this->pspPaymentMethodService->update($pspPaymentMethod->getAttribute("id"), $request->validated());
            return redirect()->route('psp-payment-methods.show', $updatedPspPaymentMethod->getAttribute("id"))->with('success', 'PSP Payment Method updated successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->withInput()->with('error', 'Failed to update PSP Payment Method: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PspPaymentMethod $pspPaymentMethod): RedirectResponse
    {
        try {
            $this->pspPaymentMethodService->delete($pspPaymentMethod->getAttribute("id"));
            return redirect()->route('psp-payment-methods.index')->with('success', 'PSP Payment Method deleted successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->with('error', 'Failed to delete PSP Payment Method: ' . $e->getMessage());
        }
    }

    public function getPaymentMethod(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'psp_id' => 'required|integer|exists:psps,id',
        ]);

        $pspId = (int) $validated['psp_id'];

        $assignPaymentMethods = $this->pspPaymentMethodService->where([
            ['psp_id', $pspId],
        ], ["payment_method_id"])->pluck("payment_method_id")->toArray();

        $paymentMethods = PaymentMethodsDropDown();

        if (!empty($assignPaymentMethods)) {
            $collection = collect($paymentMethods);
            $paymentMethods = $collection->whereNotIn("id", $assignPaymentMethods)
                ->values()
                ->toArray();
        }

        return response()->json([
            "PaymentMethods" => $paymentMethods,
        ]);
    }

    public function createMerchantPaymentMethod(Merchant $merchant): Response|RedirectResponse {
        $invoiceTypes = $merchant->invoiceTypes()->get();
        $childMerchants = $merchant->childMerchants()->get(["id", "en_name", "ar_name"]);

        $supportedPaymentMethods = $this->pspPaymentMethodService->getSupportedPaymentMethods($merchant)->toArray();

        return inertia('merchants/payment-method/create', [
            'invoiceTypes' => InvoiceTypeResource::collection($invoiceTypes)->resolve(),
            'childMerchants' => MerchantResource::collection($childMerchants)->resolve(),
            'supportedPaymentMethods' => $supportedPaymentMethods,
            'merchant' => (new MerchantResource($merchant))->resolve(),
        ]);
    }

    /**
     * @throws ValidationException
     */
    public function storeMerchantPaymentMethods(StoreMerchantPaymentMethodsRequest $request, Merchant $merchant): RedirectResponse
    {
        try {
            $count = $this->pspPaymentMethodService->storeMerchantPaymentMethods(
                $merchant,
                $request->validated(),
            );

            return redirect()
                ->route('merchants.show', $merchant->id)
                ->with('success', "{$count} merchant payment method assignment(s) saved successfully.");
        } catch (ValidationException $e) {
            throw $e;
        } catch (Exception $e) {
            logger($e->getMessage());

            return back()
                ->withInput()
                ->with('error', 'Failed to save merchant payment methods: ' . $e->getMessage());
        }
    }
}
