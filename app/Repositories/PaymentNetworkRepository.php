<?php

namespace App\Repositories;

use App\Models\PaymentNetwork;
use Illuminate\Database\Eloquent\Model;

class PaymentNetworkRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(PaymentNetwork $model) {
        parent::__construct($model);
    }
}