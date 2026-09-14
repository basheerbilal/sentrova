<?php
declare(strict_types=1);

namespace Sentrova\Models;

use Sentrova\Config\Database;
use PDO;

class Faq {
    public static function getAllPublic(): array {
        $db = Database::getConnection();
        $stmt = $db->query("
            SELECT id, question, answer, sort_order
            FROM `faqs`
            WHERE status = 'active'
            ORDER BY sort_order ASC, id ASC
        ");
        return $stmt->fetchAll();
    }

    public static function getAllAdmin(string $search = ''): array {
        $db = Database::getConnection();
        if ($search !== '') {
            $stmt = $db->prepare("SELECT * FROM `faqs` WHERE question LIKE :q OR answer LIKE :q ORDER BY sort_order ASC, id ASC");
            $stmt->execute([':q' => "%{$search}%"]);
            return $stmt->fetchAll();
        }
        $stmt = $db->query("SELECT * FROM `faqs` ORDER BY sort_order ASC, id ASC");
        return $stmt->fetchAll();
    }

    public static function create(array $data): int {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO `faqs` (`question`, `answer`, `sort_order`, `status`, `created_at`)
            VALUES (:q, :a, :sort_order, :status, NOW())
        ");
        $stmt->execute([
            ':q'          => $data['question'],
            ':a'          => $data['answer'],
            ':sort_order' => (int)($data['sort_order'] ?? 0),
            ':status'     => $data['status'] ?? 'active'
        ]);
        return (int)$db->lastInsertId();
    }

    public static function update(int $id, array $data): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            UPDATE `faqs` SET
                question = :q,
                answer = :a,
                sort_order = :sort_order,
                status = :status,
                updated_at = NOW()
            WHERE id = :id
        ");
        return $stmt->execute([
            ':q'          => $data['question'],
            ':a'          => $data['answer'],
            ':sort_order' => (int)($data['sort_order'] ?? 0),
            ':status'     => $data['status'] ?? 'active',
            ':id'         => $id
        ]);
    }

    public static function delete(int $id): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM `faqs` WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
