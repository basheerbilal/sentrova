<?php
declare(strict_types=1);

namespace Sentrova\Models;

use Sentrova\Config\Database;
use PDO;

class Industry {
    public static function getAllPublic(): array {
        $db = Database::getConnection();
        $stmt = $db->query("
            SELECT id, name, slug, description, image, icon, sort_order
            FROM `industries`
            WHERE status = 'active'
            ORDER BY sort_order ASC, id ASC
        ");
        return $stmt->fetchAll();
    }

    public static function getAllAdmin(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT * FROM `industries` ORDER BY sort_order ASC, id ASC");
        return $stmt->fetchAll();
    }

    public static function create(array $data): int {
        $db = Database::getConnection();
        $slug = $data['slug'] ?? strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['name'])));
        $stmt = $db->prepare("
            INSERT INTO `industries` (`name`, `slug`, `description`, `image`, `icon`, `sort_order`, `status`, `created_at`)
            VALUES (:name, :slug, :desc, :image, :icon, :sort_order, :status, NOW())
        ");
        $stmt->execute([
            ':name'       => $data['name'],
            ':slug'       => $slug,
            ':desc'       => $data['description'] ?? '',
            ':image'      => $data['image'] ?? null,
            ':icon'       => $data['icon'] ?? 'Building2',
            ':sort_order' => (int)($data['sort_order'] ?? 0),
            ':status'     => $data['status'] ?? 'active'
        ]);
        return (int)$db->lastInsertId();
    }

    public static function update(int $id, array $data): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            UPDATE `industries` SET
                name = :name,
                description = :desc,
                image = :image,
                icon = :icon,
                sort_order = :sort_order,
                status = :status,
                updated_at = NOW()
            WHERE id = :id
        ");
        return $stmt->execute([
            ':name'       => $data['name'],
            ':desc'       => $data['description'] ?? '',
            ':image'      => $data['image'] ?? null,
            ':icon'       => $data['icon'] ?? 'Building2',
            ':sort_order' => (int)($data['sort_order'] ?? 0),
            ':status'     => $data['status'] ?? 'active',
            ':id'         => $id
        ]);
    }

    public static function delete(int $id): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM `industries` WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
