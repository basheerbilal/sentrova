<?php
declare(strict_types=1);

namespace Sentrova\Controllers;

use Sentrova\Models\SiteSetting;
use Sentrova\Helpers\Response;
use Sentrova\Helpers\Logger;
use Sentrova\Middleware\AuthMiddleware;

class SettingController {
    public function index(): void {
        $settings = SiteSetting::getAll();
        Response::success($settings);
    }

    public function indexAdmin(): void {
        AuthMiddleware::authenticate();
        $settings = SiteSetting::getAllDetailed();
        Response::success($settings);
    }

    public function update(): void {
        $admin = AuthMiddleware::requireSuperAdmin();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        if (empty($input) || !is_array($input)) {
            Response::error('Invalid settings payload', 422);
        }

        SiteSetting::updateMany($input);
        Logger::logActivity((int)$admin['id'], 'update_settings', 'site_settings', null, "Updated site settings");

        Response::success(SiteSetting::getAll(), 'Settings updated successfully');
    }
}
