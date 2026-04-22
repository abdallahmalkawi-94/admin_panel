<?php

namespace App\Repositories;

use App\Models\FeesCollectionModel;
use Illuminate\Database\Eloquent\Model;

class FeesCollectionModelRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(FeesCollectionModel $model) {
        parent::__construct($model);
    }
}