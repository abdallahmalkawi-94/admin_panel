<?php

namespace App\Repositories;

use App\Models\MessageType;
use Illuminate\Database\Eloquent\Model;

class MessageTypeRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(MessageType $model) {
        parent::__construct($model);
    }
}