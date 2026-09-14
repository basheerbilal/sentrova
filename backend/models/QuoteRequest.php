<?php
declare(strict_types=1);

namespace Sentrova\Models;

use Sentrova\Config\Database;
use PDO;

class QuoteRequest {
    public static function create(array $data): int {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO `quote_requests` (
                `full_name`, `business_name`, `phone`, `email`, `location`,
                `camera_count`, `package_id`, `message`, `status`, `created_at`
            ) VALUES (
                :full_name, :biz_name, :phone, :email, :location,
                :camera_count, :package_id, :message, 'new', NOW()
            )
        ");

        $stmt->execute([
            ':full_name'    => $data['full_name'],
            ':biz_name'     => $data['business_name'],
            ':phone'        => $data['phone'],
            ':email'        => $data['email'],
            ':location'     => $data['location'] ?? null,
            ':camera_count' => (int)($data['camera_count'] ?? 1),
            ':package_id'   => !empty($data['package_id']) ? (int)$data['package_id'] : null,
            ':message'      => $data['message'] ?? null
        ]);

        return (int)$db->lastInsertId();
    }

    public static function getAllAdmin(
        int $page = 1,
        int $limit = 20,
        string $status = '',
        string $packageId = '',
        string $search = ''
    ): array {
        $db = Database::getConnection();
        $where = [];
        $params = [];

        if ($status !== '') {
            $where[] = "q.status = :status";
            $params[':status'] = $status;
        }

        if ($packageId !== '') {
            $where[] = "q.package_id = :pkg_id";
            $params[':pkg_id'] = (int)$packageId;
        }

        if ($search !== '') {
            $where[] = "(q.full_name LIKE :search OR q.business_name LIKE :search OR q.email LIKE :search OR q.phone LIKE :search)";
            $params[':search'] = "%{$search}%";
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        // Total count
        $countSql = "SELECT COUNT(*) as total FROM `quote_requests` q {$whereClause}";
        $countStmt = $db->prepare($countSql);
        $countStmt->execute($params);
        $total = (int)$countStmt->fetch()['total'];

        $offset = ($page - 1) * $limit;
        $sql = "
            SELECT q.*, p.name as package_name, p.price as package_price
            FROM `quote_requests` q
            LEFT JOIN `packages` p ON q.package_id = p.id
            {$whereClause}
            ORDER BY q.created_at DESC
            LIMIT :limit OFFSET :offset
        ";

        $stmt = $db->prepare($sql);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $records = $stmt->fetchAll();

        return [
            'records'    => $records,
            'pagination' => [
                'page'        => $page,
                'limit'       => $limit,
                'total'       => $total,
                'total_pages' => ceil($total / max(1, $limit))
            ]
        ];
    }

    public static function findById(int $id): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            SELECT q.*, p.name as package_name, p.price as package_price
            FROM `quote_requests` q
            LEFT JOIN `packages` p ON q.package_id = p.id
            WHERE q.id = :id
            LIMIT 1
        ");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function updateStatus(int $id, string $status, ?string $adminNotes = null): bool {
        $db = Database::getConnection();
        $sql = "UPDATE `quote_requests` SET status = :status, updated_at = NOW()";
        $params = [':status' => $status, ':id' => $id];

        if ($adminNotes !== null) {
            $sql .= ", admin_notes = :notes";
            $params[':notes'] = $adminNotes;
        }

        $sql .= " WHERE id = :id";
        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }

    public static function delete(int $id): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM `quote_requests` WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public static function getMetrics(): array {
        $db = Database::getConnection();
        $stmt = $db->query("
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_leads,
                SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
            FROM `quote_requests`
        ");
        return $stmt->fetch() ?: [
            'total' => 0, 'new_leads' => 0, 'in_progress' => 0, 'completed' => 0, 'contacted' => 0, 'cancelled' => 0
        ];
    }
}
