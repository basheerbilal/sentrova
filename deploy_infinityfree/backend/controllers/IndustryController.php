<?php
declare(strict_types=1);

namespace Sentrova\Controllers;

use Sentrova\Models\Industry;
use Sentrova\Helpers\Response;
use Sentrova\Helpers\Validator;
use Sentrova\Helpers\Logger;
use Sentrova\Middleware\AuthMiddleware;

class IndustryController {
    public function index(): void {
        $industries = Industry::getAllPublic();
        Response::success($industries);
    }

    public function indexAdmin(): void {
        AuthMiddleware::authenticate();
        $industries = Industry::getAllAdmin();
        Response::success($industries);
    }

    public function store(): void {
        $admin = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $validator = new Validator();
        if (!$validator->validate($input, [
            'name' => 'required|max:120',
        ])) {
            Response::error('Validation failed', 422, $validator->getErrors());
        }

        $id = Industry::create($input);
        Logger::logActivity((int)$admin['id'], 'create_industry', 'industry', (string)$id, "Created industry {$input['name']}");

        Response::success(['id' => $id], 'Industry created successfully', 201);
    }

    public function update(int $id): void {
        $admin = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $validator = new Validator();
        if (!$validator->validate($input, [
            'name' => 'required|max:120',
        ])) {
            Response::error('Validation failed', 422, $validator->getErrors());
        }

        Industry::update($id, $input);
        Logger::logActivity((int)$admin['id'], 'update_industry', 'industry', (string)$id, "Updated industry {$input['name']}");

        Response::success([], 'Industry updated successfully');
    }

    public function destroy(int $id): void {
        $admin = AuthMiddleware::authenticate();
        Industry::delete($id);
        Logger::logActivity((int)$admin['id'], 'delete_industry', 'industry', (string)$id, "Deleted industry");

        Response::success([], 'Industry deleted successfully');
    }
}
