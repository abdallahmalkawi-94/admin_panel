<?php


use App\Models\Bank;
use App\Models\Country;
use App\Models\Currency;
use App\Models\InvoiceType;
use App\Models\Language;
use App\Models\Merchant;
use App\Models\MerchantStatus;
use App\Models\Product;
use App\Models\TermsAndCondition;
use App\Models\UserStatus;
use Illuminate\Support\Facades\Cache;

function CountriesDropDown(): array
{
    return Country::dropdown();
}

function CurrenciesDropDown(): array
{
    return Currency::dropdown();
}

function LanguagesDropDown(): array
{
    return Language::dropdown();
}

function UserStatusesDropDown(): array
{
    return UserStatus::dropdown();
}

function MerchantStatusesDropDown(): array
{
    return MerchantStatus::dropdown();
}

function ProductsDropDown(): array
{
    return Cache::remember('products:dropdown', 86400, function () {
        return Product::query()
            ->get(['id', 'en_name', 'ar_name'])
            ->map(fn($product) => [
                'id' => $product->id,
                'en_name' => $product->en_name,
                'ar_name' => $product->ar_name,
            ])
            ->toArray();
    });
}

function BanksDropDown(): array
{
    return Cache::remember('banks:dropdown', 86400, function () {
        return Bank::query()
            ->get(['id', 'en_name', 'ar_name'])
            ->map(fn($bank) => [
                'id' => $bank->id,
                'en_name' => $bank->en_name,
                'ar_name' => $bank->ar_name,
            ])
            ->toArray();
    });
}

function MerchantsDropDown(): array
{
    return Cache::remember('merchants:dropdown', 86400, function () {
        return Merchant::query()
            ->get(['id', 'en_name', 'ar_name'])
            ->map(fn($merchant) => [
                'id' => $merchant->id,
                'en_name' => $merchant->en_name,
                'ar_name' => $merchant->ar_name,
            ])
            ->toArray();
    });
}

function TermsAndConditionsDropDown(): array
{
    return Cache::remember('terms_and_conditions:dropdown', 86400, function () {
        return TermsAndCondition::query()
            ->get(['id', 'version'])
            ->map(fn($terms) => [
                'id' => $terms->id,
                'version' => $terms->version,
            ])
            ->toArray();
    });
}

function InvoiceTypesDropDown(): array
{
    return Cache::remember('invoice_types:dropdown', 86400, function () {
        return InvoiceType::query()
            ->get(['id', 'code', 'description'])
            ->map(fn($invoiceType) => [
                'id' => $invoiceType->id,
                'code' => $invoiceType->code,
                'description' => $invoiceType->description,
            ])
            ->toArray();
    });
}

