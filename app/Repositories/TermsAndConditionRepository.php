<?php

namespace App\Repositories;

use App\Models\TermsAndCondition;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class TermsAndConditionRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(TermsAndCondition $termsAndCondition) {
        parent::__construct($termsAndCondition);
    }

    /**
     * Get all active terms and conditions
     */
    public function getAllActive(): Collection
    {
        return $this->getModel()->newQuery()
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}

