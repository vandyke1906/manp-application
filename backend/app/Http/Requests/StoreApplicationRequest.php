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
            'applicant_type_id.*' => ['required', 'integer', 'exists:applicant_types,id'],
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

    public function messages(): array
    {
        return [
            'application_date.required' => 'The application date is required.',
            'application_date.date' => 'The application date must be a valid date.',

            'mobile_number.required' => 'The mobile number is required.',
            'mobile_number.string' => 'The mobile number must be a string.',

            'address.required' => 'The address is required.',
            'address.string' => 'The address must be a string.',

            'applicant_type_id.required' => 'Please select at least one applicant type.',
            'applicant_type_id.*.integer' => 'Each applicant type must be valid.',
            'applicant_type_id.*.exists' => 'One or more selected applicant types are invalid.',


            'application_type_id.required' => 'The application type is required.',

            'business_name.required' => 'The business name is required.',
            'business_name.string' => 'The business name must be a string.',

            'business_address.required' => 'The business address is required.',
            'business_address.string' => 'The business address must be a string.',

            'business_description.required' => 'The business description is required.',
            'business_description.string' => 'The business description must be a string.',

            'business_nature_id.required' => 'The business nature is required.',
            'business_status_id.required' => 'The business status is required.',
            'capitalization_id.required' => 'The capitalization information is required.',

            'proof_of_capitalization.required' => 'Proof of capitalization is required.',
            'proof_of_capitalization.file' => 'Proof of capitalization must be a file.',
            'proof_of_capitalization.mimes' => 'Proof of capitalization must be a PDF, JPEG, or PNG file.',
            'proof_of_capitalization.max' => 'Proof of capitalization must not exceed 5MB.',

            'barangay_clearance.required' => 'Barangay clearance is required.',
            'barangay_clearance.file' => 'Barangay clearance must be a file.',
            'barangay_clearance.mimes' => 'Barangay clearance must be a PDF, JPEG, or PNG file.',
            'barangay_clearance.max' => 'Barangay clearance must not exceed 5MB.',

            'birth_certificate_or_id.required' => 'Birth certificate or valid ID is required.',
            'birth_certificate_or_id.file' => 'Birth certificate or ID must be a file.',
            'birth_certificate_or_id.mimes' => 'Birth certificate or ID must be a PDF, JPEG, or PNG file.',
            'birth_certificate_or_id.max' => 'Birth certificate or ID must not exceed 5MB.',

            'ncip_document.required' => 'NCIP document is required.',
            'ncip_document.file' => 'NCIP document must be a file.',
            'ncip_document.mimes' => 'NCIP document must be a PDF, JPEG, or PNG file.',
            'ncip_document.max' => 'NCIP document must not exceed 5MB.',

            'fpic_certification.required' => 'FPIC certification is required.',
            'fpic_certification.file' => 'FPIC certification must be a file.',
            'fpic_certification.mimes' => 'FPIC certification must be a PDF, JPEG, or PNG file.',
            'fpic_certification.max' => 'FPIC certification must not exceed 5MB.',

            'business_permit.required' => 'Business permit is required.',
            'business_permit.file' => 'Business permit must be a file.',
            'business_permit.mimes' => 'Business permit must be a PDF, JPEG, or PNG file.',
            'business_permit.max' => 'Business permit must not exceed 5MB.',

            'authorization_letter.file' => 'Authorization letter must be a file.',
            'authorization_letter.mimes' => 'Authorization letter must be a PDF, JPEG, or PNG file.',
            'authorization_letter.max' => 'Authorization letter must not exceed 5MB.',
        ];
    }

    
}
