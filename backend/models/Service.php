<?php
declare(strict_types=1);

namespace Sentrova\Models;

use Sentrova\Config\Database;
use PDO;

class Service {
    public static function getAllPublic(): array {
        $db = Database::getConnection();
        $stmt = $db->query("
            SELECT id, slug, title, short_description, description, icon, image, sort_order
            FROM `services`
            WHERE status = 'active'
            ORDER BY sort_order ASC, id ASC
        ");
        return $stmt->fetchAll();
    }

    public static function getAllAdmin(string $search = ''): array {
        $db = Database::getConnection();
        if ($search !== '') {
            $stmt = $db->prepare("SELECT * FROM `services` WHERE title LIKE :q OR short_description LIKE :q ORDER BY sort_order ASC, id ASC");
            $stmt->execute([':q' => "%{$search}%"]);
            return $stmt->fetchAll();
        }
        $stmt = $db->query("SELECT * FROM `services` ORDER BY sort_order ASC, id ASC");
        return $stmt->fetchAll();
    }

    public static function findById(int $id): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM `services` WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(array $data): int {
        $db = Database::getConnection();
        $slug = $data['slug'] ?? strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['title'])));
        $stmt = $db->prepare("
            INSERT INTO `services` (`slug`, `title`, `short_description`, `description`, `icon`, `image`, `sort_order`, `status`, `created_at`)
            VALUES (:slug, :title, :short_desc, :desc, :icon, :image, :sort_order, :status, NOW())
        ");
        $stmt->execute([
            ':slug'       => $slug,
            ':title'      => $data['title'],
            ':short_desc' => $data['short_description'],
            ':desc'       => $data['description'] ?? $data['short_description'],
            ':icon'       => $data['icon'] ?? 'ShieldAlert',
            ':image'      => $data['image'] ?? null,
            ':sort_order' => (int)($data['sort_order'] ?? 0),
            ':status'     => $data['status'] ?? 'active'
        ]);
        return (int)$db->lastInsertId();
    }

    public static function update(int $id, array $data): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            UPDATE `services` SET
                title = :title,
                short_description = :short_desc,
                description = :desc,
                icon = :icon,
                image = :image,
                sort_order = :sort_order,
                status = :status,
                updated_at = NOW()
            WHERE id = :id
        ");
        return $stmt->execute([
            ':title'      => $data['title'],
            ':short_desc' => $data['short_description'],
            ':desc'       => $data['description'] ?? '',
            ':icon'       => $data['icon'] ?? 'ShieldAlert',
            ':image'      => $data['image'] ?? null,
            ':sort_order' => (int)($data['sort_order'] ?? 0),
            ':status'     => $data['status'] ?? 'active',
            ':id'         => $id
        ]);
    }

    public static function delete(int $id): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM `services` WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
