<?php
declare(strict_types=1);

namespace Sentrova\Controllers;

use Sentrova\Models\QuoteRequest;
use Sentrova\Helpers\Response;
use Sentrova\Helpers\Validator;
use Sentrova\Helpers\Logger;
use Sentrova\Middleware\AuthMiddleware;

class QuoteController {
    // Public Quote Submission
    public function store(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $validator = new Validator();
        if (!$validator->validate($input, [
            'full_name'     => 'required|max:120',
            'business_name' => 'required|max:150',
            'phone'         => 'required|max:50',
            'email'         => 'required|email|max:191',
        ])) {
            Response::error('Please verify all required fields.', 422, $validator->getErrors());
        }

        try {
            $id = QuoteRequest::create($input);
            $input['id'] = $id;
            try {
                \Sentrova\Helpers\Mailer::sendQuoteEmails($input);
            } catch (\Throwable $mErr) {
                error_log("Quote Mail Error: " . $mErr->getMessage());
            }

            Response::success([
                'id' => $id
            ], 'Thank you. Your quote request has been received. Our operations team will contact you within 15 minutes.', 201);
        } catch (\Exception $e) {
            error_log("Quote Request Error: " . $e->getMessage());
            Response::error('Could not process quote request at this moment. Please call operations directly.', 500);
        }
    }

    // Admin List Quotes
    public function indexAdmin(): void {
        AuthMiddleware::authenticate();

        $page = max(1, (int)($_GET['page'] ?? 1));
        $limit = min(100, max(1, (int)($_GET['limit'] ?? 20)));
        $status = $_GET['status'] ?? '';
        $packageId = $_GET['package_id'] ?? '';
        $search = $_GET['search'] ?? '';

        $result = QuoteRequest::getAllAdmin($page, $limit, trim($status), trim($packageId), trim($search));
        Response::success($result);
    }

    // Admin Show Quote
    public function show(int $id): void {
        AuthMiddleware::authenticate();
        $quote = QuoteRequest::findById($id);
        if (!$quote) {
            Response::notFound('Quote request not found');
        }
        Response::success($quote);
    }

    // Admin Update Quote Status & Notes
    public function update(int $id): void {
        $admin = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $allowedStatuses = ['new', 'contacted', 'in_progress', 'completed', 'cancelled'];
        $status = $input['status'] ?? '';

        if (!in_array($status, $allowedStatuses, true)) {
            Response::error('Invalid status value', 422);
        }

        $notes = isset($input['admin_notes']) ? (string)$input['admin_notes'] : null;
        QuoteRequest::updateStatus($id, $status, $notes);

        Logger::logActivity((int)$admin['id'], 'update_quote_status', 'quote_request', (string)$id, "Status changed to {$status}");
        Response::success(QuoteRequest::findById($id), 'Quote request status updated successfully');
    }

    // Admin Delete Quote
    public function destroy(int $id): void {
        $admin = AuthMiddleware::authenticate();
        QuoteRequest::delete($id);
        Logger::logActivity((int)$admin['id'], 'delete_quote', 'quote_request', (string)$id, "Deleted quote request");

        Response::success([], 'Quote request deleted successfully');
    }
}
