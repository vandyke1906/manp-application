<?php

namespace App\Http\Requests;

use App\Http\Requests\CommonFormRequest;
use Illuminate\Validation\Rule;

class StoreCommentRequest extends CommonFormRequest
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
            'application_id' => ['required', 'integer', Rule::exists('applications', 'id')],
            'comment' => 'string'
        ];
    }

    public function messages(): array
    {
        return [
            'application_id.required' => 'The application is required.',
            'application_id.integer' => 'The application must be valid.',
            'application_id.exists' => 'The selected application does not exist in our records.',

            'comment.string' => 'The comment must be a valid string.',
        ];
    }

}
