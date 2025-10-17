<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Model;

class ProductRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(Product $model) {
        parent::__construct($model);
    }
}