<?php
declare(strict_types=1);

namespace Sentrova\Controllers;

use Sentrova\Models\Admin;
use Sentrova\Config\Jwt;
use Sentrova\Helpers\Response;
use Sentrova\Helpers\Validator;
use Sentrova\Helpers\Logger;
use Sentrova\Middleware\AuthMiddleware;

class AuthController {
    public function login(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $validator = new Validator();

        if (!$validator->validate($input, [
            'email'    => 'required|email',
            'password' => 'required'
        ])) {
            Response::error('Validation failed', 422, $validator->getErrors());
        }

        $admin = Admin::findByEmail(trim($input['email']));

        if (!$admin || !password_verify($input['password'], $admin['password_hash'])) {
            Logger::logActivity(null, 'login_failed', 'auth', null, 'Failed attempt for email: ' . $input['email']);
            Response::error('Invalid email or password', 401);
        }

        if ($admin['status'] !== 'active') {
            Response::error('This administrator account has been deactivated.', 403);
        }

        Admin::updateLastLogin((int)$admin['id']);

        $token = Jwt::generate([
            'admin_id' => $admin['id'],
            'email'    => $admin['email'],
            'role'     => $admin['role']
        ], 86400 * 7); // 7-day session

        Logger::logActivity((int)$admin['id'], 'login_success', 'auth', (string)$admin['id'], 'Admin logged in');

        Response::success([
            'token' => $token,
            'admin' => [
                'id'    => $admin['id'],
                'name'  => $admin['name'],
                'email' => $admin['email'],
                'role'  => $admin['role']
            ]
        ], 'Authentication successful');
    }

    public function me(): void {
        $currentAdmin = AuthMiddleware::authenticate();
        $admin = Admin::findById((int)$currentAdmin['id']);
        if (!$admin) {
            Response::notFound('Admin profile not found');
        }
        Response::success($admin);
    }

    public function logout(): void {
        $admin = AuthMiddleware::authenticate();
        Logger::logActivity((int)$admin['id'], 'logout', 'auth', (string)$admin['id'], 'Admin logged out');
        Response::success([], 'Logged out successfully');
    }
}
