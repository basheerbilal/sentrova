<?php
declare(strict_types=1);

namespace Sentrova\Middleware;

use Sentrova\Config\Jwt;
use Sentrova\Helpers\Response;
use Sentrova\Config\Database;

class AuthMiddleware {
    private static function getAuthorizationHeader(): string {
        if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
            return trim($_SERVER['HTTP_AUTHORIZATION']);
        }
        if (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            return trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
        }
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
            if (!empty($headers['Authorization'])) {
                return trim($headers['Authorization']);
            }
            if (!empty($headers['authorization'])) {
                return trim($headers['authorization']);
            }
        }
        if (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if (!empty($headers['Authorization'])) {
                return trim($headers['Authorization']);
            }
            if (!empty($headers['authorization'])) {
                return trim($headers['authorization']);
            }
        }
        return '';
    }

    public static function authenticate(): array {
        $authHeader = self::getAuthorizationHeader();

        if (!str_starts_with($authHeader, 'Bearer ')) {
            Response::unauthorized('Authentication token missing or malformed.');
        }

        $token = substr($authHeader, 7);
        $payload = Jwt::verify($token);

        if (!$payload || !isset($payload['admin_id'])) {
            Response::unauthorized('Invalid or expired authentication session.');
        }

        // Verify admin is still active in database
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT id, name, email, role, status FROM `admins` WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $payload['admin_id']]);
        $admin = $stmt->fetch();

        if (!$admin || $admin['status'] !== 'active') {
            Response::unauthorized('Admin account is inactive or no longer exists.');
        }

        return $admin;
    }

    public static function requireSuperAdmin(): array {
        $admin = self::authenticate();
        if ($admin['role'] !== 'super_admin') {
            Response::forbidden('Super admin privileges required for this action.');
        }
        return $admin;
    }
}