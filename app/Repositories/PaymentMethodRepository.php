<?php

namespace App\Repositories;

use App\Models\PaymentMethod;
use Illuminate\Database\Eloquent\Model;

class PaymentMethodRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(PaymentMethod $model) {
        parent::__construct($model);
    }
}