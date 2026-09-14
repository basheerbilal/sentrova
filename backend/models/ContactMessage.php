<?php
declare(strict_types=1);

namespace Sentrova\Models;

use Sentrova\Config\Database;
use PDO;

class ContactMessage {
    public static function create(array $data): int {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO `contact_messages` (`full_name`, `email`, `phone`, `subject`, `message`, `status`, `created_at`)
            VALUES (:name, :email, :phone, :subject, :msg, 'new', NOW())
        ");
        $stmt->execute([
            ':name'    => $data['full_name'],
            ':email'   => $data['email'],
            ':phone'   => $data['phone'] ?? null,
            ':subject' => $data['subject'],
            ':msg'     => $data['message']
        ]);
        return (int)$db->lastInsertId();
    }

    public static function getAllAdmin(int $page = 1, int $limit = 20, string $status = ''): array {
        $db = Database::getConnection();
        $where = [];
        $params = [];

        if ($status !== '') {
            $where[] = "status = :status";
            $params[':status'] = $status;
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        $countStmt = $db->prepare("SELECT COUNT(*) as total FROM `contact_messages` {$whereClause}");
        $countStmt->execute($params);
        $total = (int)$countStmt->fetch()['total'];

        $offset = ($page - 1) * $limit;
        $sql = "SELECT * FROM `contact_messages` {$whereClause} ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        $stmt = $db->prepare($sql);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return [
            'records'    => $stmt->fetchAll(),
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
        $stmt = $db->prepare("SELECT * FROM `contact_messages` WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function updateStatus(int $id, string $status, ?string $notes = null): bool {
        $db = Database::getConnection();
        $sql = "UPDATE `contact_messages` SET status = :status, updated_at = NOW()";
        $params = [':status' => $status, ':id' => $id];
        if ($notes !== null) {
            $sql .= ", admin_notes = :notes";
            $params[':notes'] = $notes;
        }
        $sql .= " WHERE id = :id";
        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }

    public static function delete(int $id): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM `contact_messages` WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
