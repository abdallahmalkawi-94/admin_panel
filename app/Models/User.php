<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Nnjeim\World\Models\Country;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'country_code',
        'mobile_number',
        'status_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the status for the user.
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(UserStatus::class, 'status_id');
    }

    /**
     * Get the country for the user.
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'country_code', 'iso2');
    }

    /**
     * Scope a query to filter by name.
     */
    public function scopeFilterByName($query, ?string $name)
    {
        if (!empty($name)) {
            return $query->where('name', 'like', '%' . $name . '%');
        }
        return $query;
    }

    /**
     * Scope a query to filter by email.
     */
    public function scopeFilterByEmail($query, ?string $email)
    {
        if (!empty($email)) {
            return $query->where('email', 'like', '%' . $email . '%');
        }
        return $query;
    }

    /**
     * Scope a query to filter by phone (mobile_number).
     */
    public function scopeFilterByPhone($query, ?string $phone)
    {
        if (!empty($phone)) {
            return $query->where('mobile_number', 'like', '%' . $phone . '%');
        }
        return $query;
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeFilterByStatus($query, ?string $statusId)
    {
        if (!empty($statusId) && is_numeric($statusId)) {
            return $query->where('status_id', $statusId);
        }
        return $query;
    }

    /**
     * Scope a query to filter by country.
     */
    public function scopeFilterByCountry($query, ?string $countryCode)
    {
        if (!empty($countryCode)) {
            return $query->where('country_code', $countryCode);
        }
        return $query;
    }

    /**
     * Scope a query to apply all filters at once.
     */
    public function scopeApplyFilters($query, array $filters)
    {
        return $query
            ->filterByName($filters['name'] ?? null)
            ->filterByEmail($filters['email'] ?? null)
            ->filterByPhone($filters['phone'] ?? null)
            ->filterByStatus($filters['status_id'] ?? null)
            ->filterByCountry($filters['country_code'] ?? null);
    }
}
