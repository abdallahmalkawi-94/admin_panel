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
