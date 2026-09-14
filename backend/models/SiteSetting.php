<?php
declare(strict_types=1);

namespace Sentrova\Models;

use Sentrova\Config\Database;
use PDO;

class SiteSetting {
    public static function getAll(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT key_name, key_value, field_group, description FROM `site_settings`");
        $rows = $stmt->fetchAll();

        $settings = [];
        foreach ($rows as $row) {
            $settings[$row['key_name']] = $row['key_value'];
        }
        return $settings;
    }

    public static function getAllDetailed(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT * FROM `site_settings` ORDER BY field_group ASC, key_name ASC");
        return $stmt->fetchAll();
    }

    public static function updateMany(array $settings): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO `site_settings` (`key_name`, `key_value`, `updated_at`)
            VALUES (:key, :val, NOW())
            ON DUPLICATE KEY UPDATE `key_value` = :val_update, `updated_at` = NOW()
        ");

        foreach ($settings as $key => $value) {
            $stmt->execute([
                ':key'        => $key,
                ':val'        => (string)$value,
                ':val_update' => (string)$value
            ]);
        }
        return true;
    }
}
