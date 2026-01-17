<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentNetworkRequest;
use App\Http\Requests\UpdatePaymentNetworkRequest;
use App\Http\Resources\PaymentNetworkResource;
use App\Models\PaymentNetwork;
use App\Services\PaymentNetworkService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\ResponseFactory;

class PaymentNetworkController extends Controller
{
    protected PaymentNetworkService $paymentNetworkService;

    public function __construct(PaymentNetworkService $paymentNetworkService)
    {
        $this->paymentNetworkService = $paymentNetworkService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|ResponseFactory
    {
        $perPage = $request->input('per_page', 10);
        $filters = $request->only(['name']);

        $paymentNetworks = $this->paymentNetworkService->paginate($perPage, $filters);

        return inertia('payment-networks/index', [
            'paymentNetworks' => PaymentNetworkResource::collection($paymentNetworks),
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response|ResponseFactory
    {
        return inertia('payment-networks/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentNetworkRequest $request): RedirectResponse
    {
        try {
            $paymentNetwork = $this->paymentNetworkService->create($request->validated());
            return redirect()->route('payment-networks.index')->with('success', "Payment Network With ID " . $paymentNetwork->getAttribute('id') . " created successfully.");
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->withInput()->with('error', 'Failed to create payment network: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentNetwork $paymentNetwork): Response|ResponseFactory
    {
        return inertia('payment-networks/show', [
            'paymentNetwork' => (new PaymentNetworkResource($paymentNetwork))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentNetwork $paymentNetwork): Response|ResponseFactory
    {
        return inertia('payment-networks/edit', [
            'paymentNetwork' => (new PaymentNetworkResource($paymentNetwork))->resolve(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentNetworkRequest $request, PaymentNetwork $paymentNetwork): RedirectResponse
    {
        try {
            $updatedPaymentNetwork = $this->paymentNetworkService->update($paymentNetwork->getAttribute("id"), $request->validated());
            return redirect()->route('payment-networks.show', $updatedPaymentNetwork->getAttribute("id"))->with('success', 'Payment Network updated successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->withInput()->with('error', 'Failed to update payment network: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentNetwork $paymentNetwork): RedirectResponse
    {
        try {
            $this->paymentNetworkService->delete($paymentNetwork->getAttribute("id"));
            return redirect()->route('payment-networks.index')->with('success', 'Payment Network deleted successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());
            return back()->with('error', 'Failed to delete payment network: ' . $e->getMessage());
        }
    }
}
