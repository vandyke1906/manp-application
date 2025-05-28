<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'suffix' => $this->suffix,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'role' => $this->role,
        ];

        if(isset($this->verified)){
            $data["verified"] = $this->verified;
        }
         if(isset($this->token)){
            $data["token"] = $this->token;
        }
        return $data;
    }
}
