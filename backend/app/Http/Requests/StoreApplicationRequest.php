<?php

namespace App\Http\Requests;

// use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\CommonFormRequest;

class StoreApplicationRequest extends CommonFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'application_date' => ['required', 'date'],
            'mobile_number' => ['required', 'string'],
            'address' => ['required', 'string'],
            'applicant_type_id' => ['required', 'array'],
            'application_type_id' => 'required',
            'business_name' => ['required', 'string'],
            'business_address' => ['required', 'string'],
            'business_description' => ['required', 'string'],
            'business_nature_id' => 'required',
            'business_status_id' => 'required',
            'capitalization_id' => 'required',
            
            // File uploads with unique IDs for each document
            'proof_of_capitalization' => ['required', 'file', 'mimes:pdf,jpeg,png', 'max:5120'],
            'barangay_clearance' => ['required', 'file', 'mimes:pdf,jpeg,png', 'max:5120'],
            'birth_certificate_or_id' => ['required', 'file', 'mimes:pdf,jpeg,png', 'max:5120'],
            'ncip_document' => ['required', 'file', 'mimes:pdf,jpeg,png', 'max:5120'],
            'fpic_certification' => ['required', 'file', 'mimes:pdf,jpeg,png', 'max:5120'],
            'business_permit' => ['required', 'file', 'mimes:pdf,jpeg,png', 'max:5120'],
            'authorization_letter' => ['file', 'mimes:pdf,jpeg,png', 'max:5120'],
        ];
    }
}
