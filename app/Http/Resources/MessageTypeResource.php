<?php

namespace App\Http\Resources;

use App\Constants\message_types;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageTypeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $directionLabels = array_flip(message_types::MESSAGE_DIRECTION);
        $messageDirectionLabel = $directionLabels[$this->message_direction] ?? 'Unknown';

        return [
            'id' => $this->id,
            'code' => $this->code,
            'description' => $this->description,
            'message_direction' => $this->message_direction,
            'message_direction_label' => $messageDirectionLabel,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
