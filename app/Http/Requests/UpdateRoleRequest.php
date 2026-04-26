<?php

namespace App\Http\Requests;

use App\Constants\roles;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $role = $this->route('role');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')->ignore($role?->id),
                Rule::notIn($role?->name === roles::SYSTEM_ADMIN ? [] : [roles::SYSTEM_ADMIN]),
            ],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => [
                'string',
                Rule::exists('permissions', 'name')->where('guard_name', 'web'),
            ],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $role = $this->route('role');

            if ($role?->name === roles::SYSTEM_ADMIN && $this->input('name') !== roles::SYSTEM_ADMIN) {
                $validator->errors()->add('name', 'The SYSTEM_ADMIN role cannot be renamed.');
            }
        });
    }
}
