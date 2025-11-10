# Merchant and Merchant Settings Implementation

## Overview
This document provides a comprehensive overview of the merchant and merchant settings implementation for the admin panel.

## Backend Implementation

### 1. Models

#### MerchantStatus Model
- Location: `app/Models/MerchantStatus.php`
- Features:
  - Caching support for dropdown lists
  - Relationship with Merchant model
  - Constants for status types (ACTIVE, INACTIVE, PENDING, SUSPENDED)

#### Merchant Model
- Location: `app/Models/Merchant.php`
- Features:
  - Soft deletes enabled
  - Relationships: Product, Parent Merchant, Status, Settings
  - Fillable fields for mass assignment
  - Query scopes for filtering (name, status, product, live status)
  - Support for bilingual names (English & Arabic)

#### MerchantSetting Model
- Location: `app/Models/MerchantSetting.php`
- Features:
  - Relationships: Merchant, Bank, Terms and Conditions
  - Payout model configuration
  - Banking details (IBAN, Account Number)
  - Custom URLs settings (JSON field)
  - SMS and email notification settings
  - Auto-redirect configuration

#### Bank Model
- Location: `app/Models/Bank.php`
- Features:
  - Bilingual names (English & Arabic)
  - SWIFT code support
  - Logo URL storage
  - Query scopes for filtering

#### TermsAndCondition Model
- Location: `app/Models/TermsAndCondition.php`
- Features:
  - Version tracking
  - Active/inactive status
  - Content field for terms text

### 2. Repositories

#### MerchantRepository
- Location: `app/Repositories/MerchantRepository.php`
- Extends: `BaseRepository`
- Methods:
  - `paginate()` - Get merchants with pagination and eager loading
  - `getAllStatuses()` - Get cached merchant statuses

#### BankRepository
- Location: `app/Repositories/BankRepository.php`
- Extends: `BaseRepository`
- Methods:
  - `paginate()` - Get banks with pagination

#### TermsAndConditionRepository
- Location: `app/Repositories/TermsAndConditionRepository.php`
- Extends: `BaseRepository`
- Methods:
  - `getAllActive()` - Get all active terms and conditions

### 3. Services

#### MerchantService
- Location: `app/Services/MerchantService.php`
- Features:
  - Create merchant with settings in a transaction
  - Update merchant and settings
  - Handle logo uploads with automatic storage
  - Delete merchant with cleanup
  - Automatic settings data extraction and management

#### BankService
- Location: `app/Services/BankService.php`
- Features:
  - CRUD operations for banks
  - Logo upload handling
  - Automatic file cleanup on deletion

### 4. Controllers

#### MerchantController
- Location: `app/Http/Controllers/MerchantController.php`
- Actions:
  - `index` - List merchants with filters
  - `create` - Show create form with dropdowns
  - `store` - Create new merchant
  - `show` - Display merchant details
  - `edit` - Show edit form
  - `update` - Update merchant
  - `destroy` - Delete merchant

#### BankController
- Location: `app/Http/Controllers/BankController.php`
- Actions: Standard CRUD operations

### 5. Request Validation

#### StoreMerchantRequest
- Location: `app/Http/Requests/StoreMerchantRequest.php`
- Validates:
  - Basic merchant information
  - Product and parent merchant references
  - Status and live mode
  - Logo file upload
  - Financial settings (payout model, bank details)
  - Custom URLs
  - Notification settings

#### UpdateMerchantRequest
- Location: `app/Http/Requests/UpdateMerchantRequest.php`
- Similar to StoreMerchantRequest but with 'sometimes' rules

#### StoreBankRequest & UpdateBankRequest
- Location: `app/Http/Requests/StoreBankRequest.php` & `UpdateBankRequest.php`
- Validates: English name, Arabic name, SWIFT code, logo

### 6. Resources

#### MerchantResource
- Location: `app/Http/Resources/MerchantResource.php`
- Transforms merchant data for API responses
- Includes nested relationships (product, status, parent merchant, settings)

#### BankResource
- Location: `app/Http/Resources/BankResource.php`
- Transforms bank data for API responses

#### TermsAndConditionResource
- Location: `app/Http/Resources/TermsAndConditionResource.php`
- Transforms terms and conditions data

### 7. Routes
- Merchants: `routes/merchants.php`
- Banks: `routes/banks.php`
- Both included in `routes/web.php`
- All routes protected with `auth` and `verified` middleware

### 8. Constants

#### MerchantConstants
- Location: `app/Http/Constants/MerchantConstants.php`
- Defines:
  - Payout models (Manual, Daily, Weekly, Monthly, Annual)
  - Order types (Push, Pull)

#### MerchantStatusConstants
- Location: `app/Http/Constants/MerchantStatusConstants.php`
- Defines status IDs (ACTIVE, INACTIVE, PENDING, SUSPENDED)

### 9. Helper Functions
- Location: `bootstrap/lookups.php`
- Added functions:
  - `MerchantStatusesDropDown()`
  - `ProductsDropDown()`
  - `BanksDropDown()`
  - `MerchantsDropDown()`
  - `TermsAndConditionsDropDown()`

## Frontend Implementation

### 1. TypeScript Types
- Location: `resources/js/types/index.d.ts`
- Added interfaces:
  - `MerchantStatus`
  - `Bank`
  - `TermsAndCondition`
  - `MerchantSettings`
  - `Merchant`

### 2. Merchant Pages

#### Index Page
- Location: `resources/js/pages/merchants/index.tsx`
- Features:
  - Data table with pagination
  - Filters (name, status, product, live status)
  - Status badges with color coding
  - Live/Test environment badges

#### Show Page
- Location: `resources/js/pages/merchants/show.tsx`
- Features:
  - Comprehensive merchant details display
  - Basic information card
  - Relationships card (product, parent merchant)
  - Financial settings card
  - Notification settings card
  - Custom URLs card (conditional)
  - Timestamps

#### Create Page
- Location: `resources/js/pages/merchants/create.tsx`
- Features:
  - Multi-section form
  - Basic information (bilingual names, registry, referral ID)
  - Product, parent merchant, and status selection
  - Live mode toggle
  - Logo upload
  - Financial settings (payout model, bank details, order type)
  - Terms and conditions selection
  - Notification settings (SMS/Email)
  - Auto-redirect toggle

#### Edit Page
- Location: `resources/js/pages/merchants/edit.tsx`
- Features: Same as create but with pre-filled data

### 3. Bank Pages

#### Index Page
- Location: `resources/js/pages/banks/index.tsx`
- Features:
  - Data table with pagination
  - Name filter
  - SWIFT code display

#### Show Page
- Location: `resources/js/pages/banks/show.tsx`
- Features:
  - Bank information display
  - Logo display
  - Timestamps

#### Create Page
- Location: `resources/js/pages/banks/create.tsx`
- Features:
  - Bilingual name inputs
  - SWIFT code input
  - Logo upload

#### Edit Page
- Location: `resources/js/pages/banks/edit.tsx`
- Features: Same as create with pre-filled data and current logo display

## Database Schema

### merchants table
- `id` - Primary key
- `en_name` - English name
- `ar_name` - Arabic name
- `commercial_registry_name` - Optional registry name
- `product_id` - Foreign key to products
- `referral_id` - Integer
- `parent_merchant_id` - Foreign key to merchants (self-referencing)
- `status_id` - Foreign key to merchant_statuses
- `is_live` - Boolean (default: false)
- `logo_url` - String
- `deleted_at` - Soft delete timestamp
- `created_at`, `updated_at` - Timestamps

### merchant_settings table
- `id` - Primary key
- `merchant_id` - Foreign key to merchants
- `payout_model` - SmallInteger (1-5)
- `bank_id` - Foreign key to banks (nullable)
- `iban` - String (nullable)
- `bank_account_no` - String (nullable)
- `supported_order_type` - SmallInteger (1-2)
- `has_custom_urls` - Boolean
- `urls_settings` - JSONB (nullable)
- `attachment` - String (nullable)
- `terms_and_condition_id` - Foreign key to terms_and_conditions
- `is_enable_sms_notification` - Boolean
- `monthly_sms` - Integer
- `monthly_sms_counter` - Integer
- `daily_sms` - Integer
- `daily_sms_counter` - Integer
- `is_enable_email_notification` - Boolean
- `is_enable_auto_redirect` - Boolean
- `created_at`, `updated_at` - Timestamps

### banks table
- `id` - Primary key
- `en_name` - English name
- `ar_name` - Arabic name
- `logo_url` - String (nullable)
- `swift_code` - String (nullable)
- `created_at`, `updated_at` - Timestamps

### merchant_statuses table
- `id` - Primary key
- `description` - String (10 chars)
- `created_at`, `updated_at` - Timestamps

## Features

### Security
- All routes protected with authentication
- Email verification required
- Request validation for all inputs
- File upload validation (image types, max 2MB)

### Performance
- Caching for dropdown lists (24-hour TTL)
- Eager loading of relationships
- Query scopes for efficient filtering
- Pagination support

### User Experience
- Bilingual support (English & Arabic)
- Comprehensive filtering options
- Real-time form validation
- Loading states during submissions
- Success/error flash messages
- Image preview for logos
- Breadcrumb navigation
- Responsive design

### Data Integrity
- Foreign key constraints
- Soft deletes for merchants
- Transaction support for complex operations
- File cleanup on deletion

## Next Steps

To complete the implementation:

1. **Run Migrations**
   ```bash
   php artisan migrate
   ```

2. **Seed Data (if needed)**
   - Create merchant statuses seeder
   - Create banks seeder
   - Create terms and conditions seeder

3. **Generate Frontend Routes**
   ```bash
   npm run dev
   ```
   This will generate the wayfinder routes automatically.

4. **Test the Implementation**
   - Test merchant CRUD operations
   - Test bank CRUD operations
   - Test file uploads
   - Test filtering and pagination
   - Test validation rules

5. **Add to Navigation**
   - Add merchants link to sidebar navigation
   - Add banks link to sidebar navigation

## API Endpoints

### Merchants
- `GET /merchants` - List merchants
- `GET /merchants/create` - Show create form
- `POST /merchants` - Store new merchant
- `GET /merchants/{merchant}` - Show merchant
- `GET /merchants/{merchant}/edit` - Show edit form
- `PATCH /merchants/{merchant}` - Update merchant
- `DELETE /merchants/{merchant}` - Delete merchant

### Banks
- `GET /banks` - List banks
- `GET /banks/create` - Show create form
- `POST /banks` - Store new bank
- `GET /banks/{bank}` - Show bank
- `GET /banks/{bank}/edit` - Show edit form
- `PATCH /banks/{bank}` - Update bank
- `DELETE /banks/{bank}` - Delete bank

