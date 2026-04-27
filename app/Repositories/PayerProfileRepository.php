<?php

namespace App\Repositories;

use App\Models\PayerProfile;
use Illuminate\Database\Eloquent\Model;

class PayerProfileRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(PayerProfile $model) {
        parent::__construct($model);
    }
}