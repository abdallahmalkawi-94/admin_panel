import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface FlashMessages {
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    flash: FlashMessages;
    [key: string]: unknown;
}

export interface UserStatus {
    id: number;
    description: string;
}

export interface UserStatusCounts {
    active: number;
    inactive: number;
    pending: number;
    blocked: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    country_code?: string | null;
    country_name?: string | null;
    mobile_number?: string | null;
    status_id: number;
    status: UserStatus;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Product {
    id: number;
    en_name: string;
    ar_name: string;
    signing_active: boolean;
    callback_url?: string | null;
    webhook_url?: string | null;
    invoice_inquiry_api?: string | null;
    invoice_creation_api?: string | null;
    hmac_key?: string | null;
    token_key?: string | null;
    secret_key?: string | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface Country {
    id: number;
    iso2: string;
    iso3?: string | null;
    name: string;
    phone_code?: string | null;
    region?: string | null;
    subregion?: string | null;
    status: number;
}

export interface Currency {
    id: number;
    country_id: number;
    country_name?: string | null;
    name: string;
    code: string;
    precision: number;
    symbol: string;
    symbol_native: string;
    symbol_first: boolean;
    decimal_mark: string;
    thousands_separator: string;
}

export interface Language {
    code: string;
    name: string;
    name_native: string;
    dir: string;
}

export interface MerchantStatus {
    id: number;
    description: string;
}

export interface Bank {
    id: number;
    en_name: string;
    ar_name: string;
    logo_url?: string | null;
    swift_code?: string | null;
    created_at: string;
    updated_at: string;
}

export interface PaymentMethod {
    id: number;
    description: string;
    code: string;
    logo_url?: string | null;
    is_one_time_payment: boolean;
    created_at: string;
    updated_at: string;
}

export interface PaymentNetwork {
    id: number;
    name: string;
    tags: string[];
    created_at: string;
    updated_at: string;
}

export interface MessageType {
    id: number;
    code: number;
    description: string;
    message_direction: number;
    message_direction_label: string;
    created_at: string;
    updated_at: string;
}

export interface TermsAndCondition {
    id: number;
    content?: string | null;
    version: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface MerchantSettings {
    id: number;
    payout_model: number;
    bank_id?: number | null;
    bank?: {
        id: number;
        en_name: string;
        ar_name: string;
    } | null;
    iban?: string | null;
    bank_account_no?: string | null;
    supported_order_type: number;
    has_custom_urls: boolean;
    urls_settings?: {
        callback_url?: string;
        webhook_url?: string;
        invoice_inquiry_url?: string;
        invoice_creation_url?: string;
        token_key?: string;
    } | null;
    attachment?: string | null;
    terms_and_condition_id: number;
    terms_and_condition?: {
        id: number;
        version: string;
    } | null;
    is_enable_sms_notification: boolean;
    monthly_sms: number;
    monthly_sms_counter: number;
    daily_sms: number;
    daily_sms_counter: number;
    is_enable_email_notification: boolean;
    is_enable_auto_redirect: boolean;
    country_code?: string | null;
    country?: {
        code: string;
        name: string;
    } | null;
    currency_code?: string | null;
    currency?: {
        code: string;
        name: string;
        symbol?: string;
    } | null;
}

export interface InvoiceType {
    id: number;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Merchant {
    id: number;
    en_name: string;
    ar_name: string;
    commercial_registry_name?: string | null;
    product_id: number;
    product?: {
        id: number;
        en_name: string;
        ar_name: string;
    } | null;
    referral_id: number;
    parent_merchant_id: number;
    parent_merchant?: {
        id: number;
        en_name: string;
        ar_name: string;
    } | null;
    status_id: number;
    status?: MerchantStatus | null;
    is_live: boolean;
    logo_url?: string | null;
    settings?: MerchantSettings | null;
    invoice_types: InvoiceType[];
    invoice_type_ids: number[];
    created_at: string;
    updated_at: string;
}

export interface PspStatus {
    id: number;
    code: string;
    description: string;
}

export interface Psp {
    id: number;
    name: string;
    code: string;
    country_code: string;
    country?: {
        id: number;
        name: string;
        iso2: string;
    } | null;
    settlement_currency_code: string;
    settlement_currency?: {
        id: number;
        name: string;
        code: string;
        symbol: string;
    } | null;
    monthly_fees: string | number;
    psp_status_id: number;
    status?: PspStatus | null;
    contact_person?: string | null;
    contact_email?: string | null;
    base_url?: string | null;
    sdk_version?: string | null;
    dashboard_url?: string | null;
    support_money_splitting: boolean;
    notes?: string | null;
    attachment?: string | null;
    password?: string | null;
    bank_account_number?: string | null;
    bank_id?: number | null;
    bank?: {
        id: number;
        en_name: string;
        ar_name: string;
        swift_code: string;
    };
    iban?: string | null;
    enable_auto_transfer: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    swift_code?: string | null;
}

export interface PspPaymentMethod {
    id: number;
    psp_id: number;
    psp?: {
        id: number;
        name: string;
        code: string;
    } | null;
    payment_method_id: number;
    payment_method?: {
        id: number;
        description: string;
        code: string;
    } | null;
    merchant_id?: number | null;
    merchant?: {
        id: number;
        en_name: string;
        ar_name: string;
    } | null;
    invoice_type_id?: number | null;
    invoice_type?: {
        id: number;
        code: string;
        description: string;
    } | null;
    refund_option_id: number;
    refund_option?: {
        id: number;
        description: string;
    } | null;
    payout_model_id: number;
    payout_model?: {
        id: number;
        description: string;
    } | null;
    support_tokenization: boolean;
    subscription_model: number;
    is_active: boolean;
    shown_in_checkout: boolean;
    support_international_payment: boolean;
    post_fees_to_psp: boolean;
    fees_type: number;
    priority: number;
    max_allowed_amount: number;
    min_allowed_amount: number;
    config?: Record<string, unknown> | null;
    test_config?: Record<string, unknown> | null;
    created_by?: number | null;
    updated_by?: number | null;
    created_at: string;
    updated_at: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
}

export interface PaginatedResourceCollection<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: PaginationMeta;
}

// Legacy pagination structure (direct from Eloquent)
export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}
