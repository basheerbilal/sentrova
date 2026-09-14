<?php
declare(strict_types=1);

namespace Sentrova\Helpers;

use Sentrova\Config\Database;
use PDOException;

class Logger {
    public static function logActivity(?int $adminId, string $action, string $entity, ?string $entityId = null, ?string $details = null): void {
        try {
            $db = Database::getConnection();
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown', 0, 255);

            $stmt = $db->prepare("
                INSERT INTO `admin_activity_logs` (`admin_id`, `action`, `entity`, `entity_id`, `details`, `ip_address`, `user_agent`, `created_at`)
                VALUES (:admin_id, :action, :entity, :entity_id, :details, :ip, :ua, NOW())
            ");

            $stmt->execute([
                ':admin_id'  => $adminId,
                ':action'    => $action,
                ':entity'    => $entity,
                ':entity_id' => $entityId,
                ':details'   => $details,
                ':ip'        => $ip,
                ':ua'        => $userAgent
            ]);
        } catch (PDOException $e) {
            error_log("Failed to write activity log: " . $e->getMessage());
        }
    }
}
