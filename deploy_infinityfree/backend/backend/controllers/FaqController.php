<?php
declare(strict_types=1);

namespace Sentrova\Controllers;

use Sentrova\Models\Faq;
use Sentrova\Helpers\Response;
use Sentrova\Helpers\Validator;
use Sentrova\Helpers\Logger;
use Sentrova\Middleware\AuthMiddleware;

class FaqController {
    public function index(): void {
        $faqs = Faq::getAllPublic();
        Response::success($faqs);
    }

    public function indexAdmin(): void {
        AuthMiddleware::authenticate();
        $search = $_GET['search'] ?? '';
        $faqs = Faq::getAllAdmin(trim($search));
        Response::success($faqs);
    }

    public function store(): void {
        $admin = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $validator = new Validator();
        if (!$validator->validate($input, [
            'question' => 'required|max:255',
            'answer'   => 'required',
        ])) {
            Response::error('Validation failed', 422, $validator->getErrors());
        }

        $id = Faq::create($input);
        Logger::logActivity((int)$admin['id'], 'create_faq', 'faq', (string)$id, "Created FAQ");

        Response::success(['id' => $id], 'FAQ created successfully', 201);
    }

    public function update(int $id): void {
        $admin = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $validator = new Validator();
        if (!$validator->validate($input, [
            'question' => 'required|max:255',
            'answer'   => 'required',
        ])) {
            Response::error('Validation failed', 422, $validator->getErrors());
        }

        Faq::update($id, $input);
        Logger::logActivity((int)$admin['id'], 'update_faq', 'faq', (string)$id, "Updated FAQ");

        Response::success([], 'FAQ updated successfully');
    }

    public function destroy(int $id): void {
        $admin = AuthMiddleware::authenticate();
        Faq::delete($id);
        Logger::logActivity((int)$admin['id'], 'delete_faq', 'faq', (string)$id, "Deleted FAQ");

        Response::success([], 'FAQ deleted successfully');
    }
}
