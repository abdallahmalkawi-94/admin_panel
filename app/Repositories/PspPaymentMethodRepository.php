<?php

namespace App\Repositories;

use App\Models\PspPaymentMethod;
use Illuminate\Database\Eloquent\Model;

class PspPaymentMethodRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(PspPaymentMethod $model) {
        parent::__construct($model);
    }
}