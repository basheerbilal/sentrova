<?php
declare(strict_types=1);

namespace Sentrova\Models;

use Sentrova\Config\Database;
use PDO;

class Package {
    public static function getAllPublic(): array {
        $db = Database::getConnection();
        $stmt = $db->query("
            SELECT id, name, slug, subtitle, price, currency, billing_unit, description, popular, sort_order
            FROM `packages`
            WHERE status = 'active'
            ORDER BY sort_order ASC, id ASC
        ");
        $packages = $stmt->fetchAll();

        // Attach features to each package
        foreach ($packages as &$pkg) {
            $fStmt = $db->prepare("
                SELECT id, feature, sort_order
                FROM `package_features`
                WHERE package_id = :pkg_id
                ORDER BY sort_order ASC, id ASC
            ");
            $fStmt->execute([':pkg_id' => $pkg['id']]);
            $pkg['features'] = $fStmt->fetchAll();
        }

        return $packages;
    }

    public static function getAllAdmin(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT * FROM `packages` ORDER BY sort_order ASC, id ASC");
        $packages = $stmt->fetchAll();

        foreach ($packages as &$pkg) {
            $fStmt = $db->prepare("
                SELECT id, feature, sort_order
                FROM `package_features`
                WHERE package_id = :pkg_id
                ORDER BY sort_order ASC, id ASC
            ");
            $fStmt->execute([':pkg_id' => $pkg['id']]);
            $pkg['features'] = $fStmt->fetchAll();
        }

        return $packages;
    }

    public static function findById(int $id): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM `packages` WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $pkg = $stmt->fetch();
        if (!$pkg) return null;

        $fStmt = $db->prepare("SELECT id, feature, sort_order FROM `package_features` WHERE package_id = :pkg_id ORDER BY sort_order ASC, id ASC");
        $fStmt->execute([':pkg_id' => $pkg['id']]);
        $pkg['features'] = $fStmt->fetchAll();
        return $pkg;
    }

    public static function update(int $id, array $data): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            UPDATE `packages` SET
                name = :name,
                subtitle = :subtitle,
                price = :price,
                currency = :currency,
                billing_unit = :billing_unit,
                description = :description,
                popular = :popular,
                status = :status,
                sort_order = :sort_order,
                updated_at = NOW()
            WHERE id = :id
        ");

        return $stmt->execute([
            ':name'         => $data['name'],
            ':subtitle'     => $data['subtitle'],
            ':price'        => $data['price'],
            ':currency'     => $data['currency'] ?? '$',
            ':billing_unit' => $data['billing_unit'] ?? '/HR',
            ':description'  => $data['description'] ?? '',
            ':popular'      => !empty($data['popular']) ? 1 : 0,
            ':status'       => $data['status'] ?? 'active',
            ':sort_order'   => (int)($data['sort_order'] ?? 0),
            ':id'           => $id
        ]);
    }

    public static function addFeature(int $packageId, string $feature, int $sortOrder = 0): int {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO `package_features` (`package_id`, `feature`, `sort_order`, `created_at`)
            VALUES (:pkg_id, :feature, :sort_order, NOW())
        ");
        $stmt->execute([
            ':pkg_id'     => $packageId,
            ':feature'    => $feature,
            ':sort_order' => $sortOrder
        ]);
        return (int)$db->lastInsertId();
    }

    public static function updateFeature(int $featureId, string $feature, int $sortOrder = 0): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            UPDATE `package_features` SET feature = :feature, sort_order = :sort_order, updated_at = NOW()
            WHERE id = :id
        ");
        return $stmt->execute([
            ':feature'    => $feature,
            ':sort_order' => $sortOrder,
            ':id'         => $featureId
        ]);
    }

    public static function deleteFeature(int $featureId): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM `package_features` WHERE id = :id");
        return $stmt->execute([':id' => $featureId]);
    }
}
