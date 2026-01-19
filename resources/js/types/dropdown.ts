export interface CountryDropDown {
    code: string;
    name: string;
}

export interface CurrencyDropDown {
    code: string;
    name: string;
}
export interface BankDropDown {
    id: number;
    en_name: string;
    ar_name: string;
}

export interface InvoiceTypeDropDown {
    id: number;
    code: string;
    description: string;
}

export interface ProductDropDown {
    id: number;
    en_name: string;
    ar_name: string;
}

export interface MerchantStatusDropDown {
    id: number;
    description: string;
}

export interface TermsAndConditionDropDown {
    id: number;
    version: string;
}

export interface MerchantDropDown {
    id: number;
    en_name: string;
    ar_name: string;
}

export interface PspDropDown {
    id: number;
    name: string;
    code: string;
}

export interface PaymentMethodDropDown {
    id: number;
    description: string;
    code: string;
}

export interface RefundOptionDropDown {
    id: number;
    description: string;
}

export interface PayoutModelDropDown {
    id: number;
    description: string;
}
