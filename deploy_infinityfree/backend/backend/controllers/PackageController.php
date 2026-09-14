<?php
declare(strict_types=1);

namespace Sentrova\Controllers;

use Sentrova\Models\Package;
use Sentrova\Helpers\Response;
use Sentrova\Helpers\Validator;
use Sentrova\Helpers\Logger;
use Sentrova\Middleware\AuthMiddleware;

class PackageController {
    public function index(): void {
        $packages = Package::getAllPublic();
        Response::success($packages);
    }

    public function indexAdmin(): void {
        AuthMiddleware::authenticate();
        $packages = Package::getAllAdmin();
        Response::success($packages);
    }

    public function show(int $id): void {
        AuthMiddleware::authenticate();
        $package = Package::findById($id);
        if (!$package) {
            Response::notFound('Package not found');
        }
        Response::success($package);
    }

    public function update(int $id): void {
        $admin = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $validator = new Validator();
        if (!$validator->validate($input, [
            'name'     => 'required|max:100',
            'subtitle' => 'required|max:255',
            'price'    => 'required|numeric',
        ])) {
            Response::error('Validation failed', 422, $validator->getErrors());
        }

        $success = Package::update($id, $input);
        if (!$success) {
            Response::error('Failed to update package');
        }

        Logger::logActivity((int)$admin['id'], 'update_package', 'package', (string)$id, "Updated package {$input['name']}");
        Response::success(Package::findById($id), 'Package updated successfully');
    }

    public function addFeature(int $packageId): void {
        $admin = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        if (empty($input['feature'])) {
            Response::error('Feature description is required', 422);
        }

        $featureId = Package::addFeature($packageId, trim($input['feature']), (int)($input['sort_order'] ?? 0));
        Logger::logActivity((int)$admin['id'], 'add_package_feature', 'package', (string)$packageId, "Added feature {$input['feature']}");

        Response::success(['id' => $featureId], 'Feature added successfully', 201);
    }

    public function updateFeature(int $featureId): void {
        $admin = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        if (empty($input['feature'])) {
            Response::error('Feature description is required', 422);
        }

        Package::updateFeature($featureId, trim($input['feature']), (int)($input['sort_order'] ?? 0));
        Logger::logActivity((int)$admin['id'], 'update_package_feature', 'package_feature', (string)$featureId, "Updated feature");

        Response::success([], 'Feature updated successfully');
    }

    public function deleteFeature(int $featureId): void {
        $admin = AuthMiddleware::authenticate();
        Package::deleteFeature($featureId);
        Logger::logActivity((int)$admin['id'], 'delete_package_feature', 'package_feature', (string)$featureId, "Deleted feature");

        Response::success([], 'Feature deleted successfully');
    }
}
