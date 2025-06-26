<?php

namespace App\Http\Requests;


use App\Http\Requests\CommonFormRequest;
use Illuminate\Validation\Rule;

class StoreApprovalRequest extends CommonFormRequest
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
            'application_id' => 'required',
            'comment' => 'string',
            'status' => ['required', 'string', Rule::in(['pending', 'approved', 'rejected', 'for_survey'])],
            // 'survey_date' => [
            //         'nullable',
            //         'date',
            //         Rule::requiredIf(function ($input) {
            //             return $input->status === 'for_survey';
            //         }),
            //     ],
        ];
    }

    public function messages(): array
    {
        return [
            'application_id.required' => 'The application ID is required.',
            'status.required' => 'Status is required.',
            'status.in' => 'The selected status is invalid.',
            'comment.string' => 'Comment must be a valid string.',
            // 'survey_date.required_if' => 'Survey date is required when status is For Survey.',
            // 'survey_date.date' => 'Please provide a valid survey date.',
        ];
    }


    
}
