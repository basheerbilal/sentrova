<?php
declare(strict_types=1);

namespace Sentrova\Controllers;

use Sentrova\Config\Database;
use Sentrova\Models\QuoteRequest;
use Sentrova\Helpers\Response;
use Sentrova\Middleware\AuthMiddleware;

class DashboardController {
    public function stats(): void {
        AuthMiddleware::authenticate();
        $db = Database::getConnection();

        // Quote metrics
        $quoteMetrics = QuoteRequest::getMetrics();

        // Contact messages count
        $cStmt = $db->query("
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as unread
            FROM `contact_messages`
        ");
        $contactMetrics = $cStmt->fetch();

        // Package count
        $pStmt = $db->query("SELECT COUNT(*) as total FROM `packages` WHERE status = 'active'");
        $activePackages = (int)$pStmt->fetch()['total'];

        // Service count
        $sStmt = $db->query("SELECT COUNT(*) as total FROM `services` WHERE status = 'active'");
        $activeServices = (int)$sStmt->fetch()['total'];

        // Recent leads (latest 8)
        $recentStmt = $db->query("
            SELECT q.id, q.full_name, q.business_name, q.phone, q.email, q.status, q.created_at, p.name as package_name
            FROM `quote_requests` q
            LEFT JOIN `packages` p ON q.package_id = p.id
            ORDER BY q.created_at DESC
            LIMIT 8
        ");
        $recentLeads = $recentStmt->fetchAll();

        // Recent activity logs (latest 6)
        $logStmt = $db->query("
            SELECT l.*, a.name as admin_name
            FROM `admin_activity_logs` l
            LEFT JOIN `admins` a ON l.admin_id = a.id
            ORDER BY l.created_at DESC
            LIMIT 6
        ");
        $recentLogs = $logStmt->fetchAll();

        Response::success([
            'metrics' => [
                'total_quotes'    => (int)$quoteMetrics['total'],
                'new_leads'       => (int)$quoteMetrics['new_leads'],
                'in_progress'     => (int)$quoteMetrics['in_progress'],
                'completed'       => (int)$quoteMetrics['completed'],
                'contact_unread'  => (int)$contactMetrics['unread'],
                'contact_total'   => (int)$contactMetrics['total'],
                'active_packages' => $activePackages,
                'active_services' => $activeServices
            ],
            'recent_leads' => $recentLeads,
            'recent_logs'  => $recentLogs
        ]);
    }
}
