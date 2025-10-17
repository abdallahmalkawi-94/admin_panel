<?php


use App\Models\Country;
use App\Models\Currency;
use App\Models\Language;
use App\Models\UserStatus;

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

