<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentMethodRequest;
use App\Http\Requests\UpdatePaymentMethodRequest;
use App\Http\Resources\PaymentMethodResource;
use App\Models\PaymentMethod;
use App\Services\PaymentMethodService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\ResponseFactory;

class PaymentMethodController extends Controller
{
    protected PaymentMethodService $paymentMethodService;

    public function __construct(PaymentMethodService $paymentMethodService)
    {
        $this->paymentMethodService = $paymentMethodService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|ResponseFactory
    {
        $perPage = $request->input('per_page', 10);
        $filters = $request->only(['description', 'is_one_time_payment']);

        $paymentMethods = $this->paymentMethodService->paginate($perPage, $filters);

        return inertia('payment-methods/index', [
            'paymentMethods' => PaymentMethodResource::collection($paymentMethods),
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response|ResponseFactory
    {
        return inertia('payment-methods/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentMethodRequest $request): RedirectResponse
    {
        try {
            $paymentMethod = $this->paymentMethodService->create($request->validated());
            return redirect()->route('payment-methods.index')->with('success', "Payment Method With ID " . $paymentMethod->getAttribute('id') . " created successfully.");
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->withInput()->with('error', 'Failed to create payment method: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentMethod $paymentMethod): Response|ResponseFactory
    {
        return inertia('payment-methods/show', [
            'paymentMethod' => (new PaymentMethodResource($paymentMethod))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentMethod $paymentMethod): Response|ResponseFactory
    {
        return inertia('payment-methods/edit', [
            'paymentMethod' => (new PaymentMethodResource($paymentMethod))->resolve(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentMethodRequest $request, PaymentMethod $paymentMethod): RedirectResponse
    {
        try {
            $updatedPaymentMethod = $this->paymentMethodService->update($paymentMethod->getAttribute("id"), $request->validated());
            return redirect()->route('payment-methods.show', $updatedPaymentMethod->getAttribute("id"))->with('success', 'Payment Method updated successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->withInput()->with('error', 'Failed to update payment method: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentMethod $paymentMethod): RedirectResponse
    {
        try {
            $this->paymentMethodService->delete($paymentMethod->getAttribute("id"));
            return redirect()->route('payment-methods.index')->with('success', 'Payment Method deleted successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->with('error', 'Failed to delete payment method: ' . $e->getMessage());
        }
    }
}
