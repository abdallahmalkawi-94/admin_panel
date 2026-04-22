<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFeesCollectionModelRequest;
use App\Http\Resources\PspPaymentMethodResource;
use App\Models\PspPaymentMethod;
use App\Services\FeesCollectionModelService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\ResponseFactory;

class FeesCollectionModelController extends Controller
{
    private FeesCollectionModelService $feesCollectionModelService;

    public function __construct(FeesCollectionModelService $feesCollectionModelService)
    {
        $this->feesCollectionModelService = $feesCollectionModelService;
    }

    /**
     * Display a listing of the resource.
     */
    public function create(PspPaymentMethod $pspPaymentMethod): Response|ResponseFactory
    {
        $pspPaymentMethod->load(['psp', 'paymentMethod', 'merchant', 'invoiceType']);

        $feeSlices = $this->feesCollectionModelService
            ->getForPspPaymentMethod($pspPaymentMethod)
            ->map(fn ($slice) => [
                'id' => $slice->id,
                'from' => $slice->from,
                'to' => $slice->to,
                'foc_fixed' => $slice->foc_fixed,
                'fom_fixed' => $slice->fom_fixed,
                'foc_percentage' => $slice->foc_percentage,
                'fom_percentage' => $slice->fom_percentage,
                'foc_psp_cost_fixed' => $slice->foc_psp_cost_fixed,
                'fom_psp_cost_fixed' => $slice->fom_psp_cost_fixed,
                'fom_psp_cost_percentage' => $slice->fom_psp_cost_percentage,
                'foc_psp_cost_percentage' => $slice->foc_psp_cost_percentage,
                'installment_fom_fixed' => $slice->installment_fom_fixed,
                'installment_fom_percentage' => $slice->installment_fom_percentage,
                'installment_foc_fixed' => $slice->installment_foc_fixed,
                'installment_foc_percentage' => $slice->installment_foc_percentage,
                'is_default' => $slice->is_default,
            ])
            ->values()
            ->all();

        return inertia('psp-payment-methods/fees-collection-model/create', [
            'pspPaymentMethod' => (new PspPaymentMethodResource($pspPaymentMethod))->resolve(),
            'feeSlices' => $feeSlices,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFeesCollectionModelRequest $request, PspPaymentMethod $pspPaymentMethod): RedirectResponse
    {
        try {
            $this->feesCollectionModelService->syncForPspPaymentMethod(
                $pspPaymentMethod,
                $request->validated('slices'),
                $request->user()?->id,
            );

            return redirect()
                ->route('fees-collection-model.create', $pspPaymentMethod)
                ->with('success', 'Fee slices saved successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());

            return back()
                ->withInput()
                ->with('error', 'Failed to save fee slices: '.$e->getMessage());
        }
    }
}
