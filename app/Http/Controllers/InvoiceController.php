<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Models\Merchant;
use App\Models\PayerProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Response;
use Inertia\ResponseFactory;

class InvoiceController extends Controller
{
    public function create(): Response|ResponseFactory
    {
        return inertia('invoices/one-time-payment', [
            'products' => ProductsDropDown()
        ]);
    }

    public function merchantContext(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'merchant_id' => ['required', 'integer', 'exists:merchants,id'],
        ]);

        $merchant = Merchant::query()
            ->with(['invoiceTypes:id,code,description', 'settings.currency'])
            ->findOrFail($validated['merchant_id']);

        return response()->json([
            'invoiceTypes' => $merchant->invoiceTypes
                ->map(fn ($invoiceType) => [
                    'id' => $invoiceType->id,
                    'code' => $invoiceType->code,
                    'description' => $invoiceType->description,
                ])
                ->values(),
            'currency' => $merchant->settings?->currency_code ? [
                'code' => $merchant->settings->currency_code,
                'name' => $merchant->settings?->currency?->name,
                'symbol' => $merchant->settings?->currency?->symbol,
            ] : null,
        ]);
    }

    public function payerProfileByEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $payerProfile = PayerProfile::query()
            ->where('email', $validated['email'])
            ->first(['id', 'full_name', 'username', 'referral_id', 'email', 'mobile_number']);

        if (!$payerProfile) {
            return response()->json([
                'payerProfile' => null,
            ]);
        }

        return response()->json([
            'payerProfile' => [
                'id' => $payerProfile->id,
                'full_name' => $payerProfile->full_name,
                'username' => $payerProfile->username,
                'referral_id' => $payerProfile->referral_id,
                'email' => $payerProfile->email,
                'mobile_number' => $payerProfile->mobile_number,
            ],
        ]);
    }

    /**
     * "merchant_id" => "6"
     * "invoice_type_id" => "2"
     * "invoice_no" => "INV-123"
     * "billing_account" => "9941021326"
     * "currency_code" => "JOD"
     * "due_amount" => "500"
     * "min_amount" => "100"
     * "max_amount" => "1000"
     * "user_id" => "1"
     * "username" => "johndoe+6"
     * "full_name" => "johndoe 6"
     * "user_email" => "johndoe+6@example.com"
     * "phone" => "+962787654321"
     * "language_code" => "en"
     * "expiry_date" => null
     * "allow_partial_payment" => true
     * "scheduled_payment" => false
     * "billing_frequency" => "daily"
     * "number_of_repetitions" => "5"
     * "due_date" => "2026-04-28"
     */
    public function store(StoreInvoiceRequest $request): RedirectResponse
    {
        dd($request->validated());

//        $merchant = Merchant::query()
//            ->with('settings')
//            ->findOrFail($validated['merchant_id']);
//
//        $invoiceTypeBelongsToMerchant = $merchant->invoiceTypes()
//            ->where('invoice_types.id', $validated['invoice_type_id'])
//            ->exists();
//
//        if (!$invoiceTypeBelongsToMerchant) {
//            return back()
//                ->withInput()
//                ->withErrors(['invoice_type_id' => 'The selected invoice type must belong to the selected merchant.']);
//        }
//
//        if ($merchant->settings?->currency_code !== $validated['currency_code']) {
//            return back()
//                ->withInput()
//                ->withErrors(['currency_code' => 'The selected currency must match the merchant currency.']);
//        }

        return back()->with('success', 'One-time invoice validated successfully.');
    }
}
