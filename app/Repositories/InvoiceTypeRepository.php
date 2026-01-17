<?php

namespace App\Repositories;

use App\Models\InvoiceType;
use Illuminate\Database\Eloquent\Model;

class InvoiceTypeRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(InvoiceType $model) {
        parent::__construct($model);
    }
}