<?php
declare(strict_types=1);

namespace Sentrova\Controllers;

use Sentrova\Models\Testimonial;
use Sentrova\Helpers\Response;
use Sentrova\Helpers\Validator;
use Sentrova\Helpers\Logger;
use Sentrova\Middleware\AuthMiddleware;

class TestimonialController {
    public function index(): void {
        $testimonials = Testimonial::getAllPublic();
        Response::success($testimonials);
    }

    public function indexAdmin(): void {
        AuthMiddleware::authenticate();
        $testimonials = Testimonial::getAllAdmin();
        Response::success($testimonials);
    }

    public function store(): void {
        $admin = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $validator = new Validator();
        if (!$validator->validate($input, [
            'customer_name' => 'required|max:120',
            'company_name'  => 'required|max:150',
            'content'       => 'required',
        ])) {
            Response::error('Validation failed', 422, $validator->getErrors());
        }

        $id = Testimonial::create($input);
        Logger::logActivity((int)$admin['id'], 'create_testimonial', 'testimonial', (string)$id, "Created testimonial for {$input['customer_name']}");

        Response::success(['id' => $id], 'Testimonial created successfully', 201);
    }

    public function update(int $id): void {
        $admin = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $validator = new Validator();
        if (!$validator->validate($input, [
            'customer_name' => 'required|max:120',
            'company_name'  => 'required|max:150',
            'content'       => 'required',
        ])) {
            Response::error('Validation failed', 422, $validator->getErrors());
        }

        Testimonial::update($id, $input);
        Logger::logActivity((int)$admin['id'], 'update_testimonial', 'testimonial', (string)$id, "Updated testimonial");

        Response::success([], 'Testimonial updated successfully');
    }

    public function destroy(int $id): void {
        $admin = AuthMiddleware::authenticate();
        Testimonial::delete($id);
        Logger::logActivity((int)$admin['id'], 'delete_testimonial', 'testimonial', (string)$id, "Deleted testimonial");

        Response::success([], 'Testimonial deleted successfully');
    }
}
