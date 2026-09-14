<?php
declare(strict_types=1);

namespace Sentrova\Controllers;

use Sentrova\Models\Service;
use Sentrova\Helpers\Response;
use Sentrova\Helpers\Validator;
use Sentrova\Helpers\Logger;
use Sentrova\Middleware\AuthMiddleware;

class ServiceController {
    public function index(): void {
        $services = Service::getAllPublic();
        Response::success($services);
    }

    public function indexAdmin(): void {
        AuthMiddleware::authenticate();
        $search = $_GET['search'] ?? '';
        $services = Service::getAllAdmin(trim($search));
        Response::success($services);
    }

    public function show(int $id): void {
        AuthMiddleware::authenticate();
        $service = Service::findById($id);
        if (!$service) {
            Response::notFound('Service not found');
        }
        Response::success($service);
    }

    public function store(): void {
        $admin = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $validator = new Validator();
        if (!$validator->validate($input, [
            'title'             => 'required|max:150',
            'short_description' => 'required|max:500',
        ])) {
            Response::error('Validation failed', 422, $validator->getErrors());
        }

        $id = Service::create($input);
        Logger::logActivity((int)$admin['id'], 'create_service', 'service', (string)$id, "Created service {$input['title']}");

        Response::success(['id' => $id], 'Service created successfully', 201);
    }

    public function update(int $id): void {
        $admin = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $validator = new Validator();
        if (!$validator->validate($input, [
            'title'             => 'required|max:150',
            'short_description' => 'required|max:500',
        ])) {
            Response::error('Validation failed', 422, $validator->getErrors());
        }

        Service::update($id, $input);
        Logger::logActivity((int)$admin['id'], 'update_service', 'service', (string)$id, "Updated service {$input['title']}");

        Response::success(Service::findById($id), 'Service updated successfully');
    }

    public function destroy(int $id): void {
        $admin = AuthMiddleware::authenticate();
        Service::delete($id);
        Logger::logActivity((int)$admin['id'], 'delete_service', 'service', (string)$id, "Deleted service");

        Response::success([], 'Service deleted successfully');
    }
}
