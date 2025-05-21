<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProponentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //return parent::toArray($request);
        return [
            'id' =>$this->id,
            'name' => $this->name,
            'contact_number' => $this->contact_number,
            'email_address' => $this->email_address,
            'establishment' => $this->establishment,
            'address' => $this->address,
            'area_occupied' => $this->area_occupied,
            'capital_declaration' => $this->capital_declaration,
            'business_type_id' => $this->business_type_id,
            'zoning_id' => $this->zoning_id
        ];
    }
}
