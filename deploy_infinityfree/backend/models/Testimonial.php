<?php
declare(strict_types=1);

namespace Sentrova\Models;

use Sentrova\Config\Database;
use PDO;

class Testimonial {
    public static function getAllPublic(): array {
        $db = Database::getConnection();
        $stmt = $db->query("
            SELECT id, customer_name, company_name, designation, content, rating, image, sort_order
            FROM `testimonials`
            WHERE status = 'active'
            ORDER BY sort_order ASC, id ASC
        ");
        return $stmt->fetchAll();
    }

    public static function getAllAdmin(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT * FROM `testimonials` ORDER BY sort_order ASC, id ASC");
        return $stmt->fetchAll();
    }

    public static function create(array $data): int {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO `testimonials` (`customer_name`, `company_name`, `designation`, `content`, `rating`, `image`, `sort_order`, `status`, `created_at`)
            VALUES (:name, :comp, :desig, :content, :rating, :img, :sort, :status, NOW())
        ");
        $stmt->execute([
            ':name'    => $data['customer_name'],
            ':comp'    => $data['company_name'],
            ':desig'   => $data['designation'] ?? '',
            ':content' => $data['content'],
            ':rating'  => min(5, max(1, (int)($data['rating'] ?? 5))),
            ':img'     => $data['image'] ?? null,
            ':sort'    => (int)($data['sort_order'] ?? 0),
            ':status'  => $data['status'] ?? 'active'
        ]);
        return (int)$db->lastInsertId();
    }

    public static function update(int $id, array $data): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            UPDATE `testimonials` SET
                customer_name = :name,
                company_name = :comp,
                designation = :desig,
                content = :content,
                rating = :rating,
                image = :img,
                sort_order = :sort,
                status = :status,
                updated_at = NOW()
            WHERE id = :id
        ");
        return $stmt->execute([
            ':name'    => $data['customer_name'],
            ':comp'    => $data['company_name'],
            ':desig'   => $data['designation'] ?? '',
            ':content' => $data['content'],
            ':rating'  => min(5, max(1, (int)($data['rating'] ?? 5))),
            ':img'     => $data['image'] ?? null,
            ':sort'    => (int)($data['sort_order'] ?? 0),
            ':status'  => $data['status'] ?? 'active',
            ':id'      => $id
        ]);
    }

    public static function delete(int $id): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM `testimonials` WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
