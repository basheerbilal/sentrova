<?php
declare(strict_types=1);

namespace Sentrova\Helpers;

class Response {
    public static function json(bool $success, string $message, mixed $data = [], int $statusCode = 200, array $errors = []): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');

        $response = [
            'success' => $success,
            'message' => $message,
            'data'    => $data,
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }

        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function success(mixed $data = [], string $message = 'Request successful', int $statusCode = 200): void {
        self::json(true, $message, $data, $statusCode);
    }

    public static function error(string $message = 'An error occurred', int $statusCode = 400, array $errors = []): void {
        self::json(false, $message, [], $statusCode, $errors);
    }

    public static function unauthorized(string $message = 'Unauthorized access'): void {
        self::json(false, $message, [], 401);
    }

    public static function forbidden(string $message = 'Forbidden access'): void {
        self::json(false, $message, [], 403);
    }

    public static function notFound(string $message = 'Resource not found'): void {
        self::json(false, $message, [], 404);
    }
}
