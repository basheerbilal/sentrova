<?php
declare(strict_types=1);

namespace Sentrova\Helpers;

class Validator {
    private array $errors = [];

    public function validate(array $data, array $rules): bool {
        $this->errors = [];

        foreach ($rules as $field => $fieldRules) {
            $rulesList = is_string($fieldRules) ? explode('|', $fieldRules) : $fieldRules;
            $value = $data[$field] ?? null;

            foreach ($rulesList as $rule) {
                if ($rule === 'required' && ($value === null || trim((string)$value) === '')) {
                    $this->errors[$field][] = "The {$field} field is required.";
                    break;
                }

                if ($value !== null && trim((string)$value) !== '') {
                    if ($rule === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        $this->errors[$field][] = "The {$field} must be a valid email address.";
                    }

                    if ($rule === 'numeric' && !is_numeric($value)) {
                        $this->errors[$field][] = "The {$field} must be a number.";
                    }

                    if ($rule === 'integer' && !filter_var($value, FILTER_VALIDATE_INT)) {
                        $this->errors[$field][] = "The {$field} must be an integer.";
                    }

                    if (str_starts_with($rule, 'min:')) {
                        $min = (int)substr($rule, 4);
                        if (is_string($value) && mb_strlen($value) < $min) {
                            $this->errors[$field][] = "The {$field} must be at least {$min} characters.";
                        }
                    }

                    if (str_starts_with($rule, 'max:')) {
                        $max = (int)substr($rule, 4);
                        if (is_string($value) && mb_strlen($value) > $max) {
                            $this->errors[$field][] = "The {$field} must not exceed {$max} characters.";
                        }
                    }

                    if (str_starts_with($rule, 'in:')) {
                        $allowed = explode(',', substr($rule, 3));
                        if (!in_array($value, $allowed, true)) {
                            $this->errors[$field][] = "The {$field} must be one of: " . implode(', ', $allowed);
                        }
                    }
                }
            }
        }

        return empty($this->errors);
    }

    public function getErrors(): array {
        return $this->errors;
    }

    public static function sanitize(mixed $data): mixed {
        if (is_array($data)) {
            return array_map([self::class, 'sanitize'], $data);
        }
        if (is_string($data)) {
            return trim(htmlspecialchars($data, ENT_QUOTES, 'UTF-8'));
        }
        return $data;
    }
}
