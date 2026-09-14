<?php
declare(strict_types=1);

namespace Sentrova\Controllers;

use Sentrova\Models\ContactMessage;
use Sentrova\Helpers\Response;
use Sentrova\Helpers\Validator;
use Sentrova\Helpers\Logger;
use Sentrova\Middleware\AuthMiddleware;

class ContactController {
    // Public Contact Form Submission
    public function store(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $validator = new Validator();
        if (!$validator->validate($input, [
            'full_name' => 'required|max:120',
            'email'     => 'required|email|max:191',
            'subject'   => 'required|max:200',
            'message'   => 'required',
        ])) {
            Response::error('Please fill out all required fields.', 422, $validator->getErrors());
        }

        try {
            $id = ContactMessage::create($input);
            Response::success([
                'id' => $id
            ], 'Thank you. Your message has been sent to our monitoring support desk.', 201);
        } catch (\Exception $e) {
            error_log("Contact Message Error: " . $e->getMessage());
            Response::error('Could not send message. Please contact us directly via WhatsApp or phone.', 500);
        }
    }

    // Admin List Messages
    public function indexAdmin(): void {
        AuthMiddleware::authenticate();
        $page = max(1, (int)($_GET['page'] ?? 1));
        $limit = min(100, max(1, (int)($_GET['limit'] ?? 20)));
        $status = $_GET['status'] ?? '';

        $result = ContactMessage::getAllAdmin($page, $limit, trim($status));
        Response::success($result);
    }

    // Admin Show Message
    public function show(int $id): void {
        AuthMiddleware::authenticate();
        $msg = ContactMessage::findById($id);
        if (!$msg) {
            Response::notFound('Message not found');
        }
        Response::success($msg);
    }

    // Admin Update Message Status / Notes
    public function update(int $id): void {
        $admin = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $allowed = ['new', 'read', 'replied', 'archived'];
        $status = $input['status'] ?? '';

        if (!in_array($status, $allowed, true)) {
            Response::error('Invalid status value', 422);
        }

        $notes = isset($input['admin_notes']) ? (string)$input['admin_notes'] : null;
        ContactMessage::updateStatus($id, $status, $notes);

        Logger::logActivity((int)$admin['id'], 'update_message_status', 'contact_message', (string)$id, "Status changed to {$status}");
        Response::success([], 'Message updated successfully');
    }

    // Admin Delete Message
    public function destroy(int $id): void {
        $admin = AuthMiddleware::authenticate();
        ContactMessage::delete($id);
        Logger::logActivity((int)$admin['id'], 'delete_message', 'contact_message', (string)$id, "Deleted contact message");

        Response::success([], 'Message deleted successfully');
    }
}
