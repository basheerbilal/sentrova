<?php
declare(strict_types=1);

namespace Sentrova\Models;

use Sentrova\Config\Database;
use PDO;

class Admin {
    public static function findByEmail(string $email): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM `admins` WHERE email = :email LIMIT 1");
        $stmt->execute([':email' => $email]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function findById(int $id): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT id, name, email, role, status, last_login_at, created_at, updated_at FROM `admins` WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function updateLastLogin(int $id): void {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("UPDATE `admins` SET last_login_at = NOW() WHERE id = :id");
            $stmt->execute([':id' => $id]);
        } catch (\PDOException $e) {
            // Silently ignore if column is missing
        }
    }

    public static function updatePassword(int $id, string $newPassword): bool {
        $hash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE `admins` SET password_hash = :hash, updated_at = NOW() WHERE id = :id");
        return $stmt->execute([':hash' => $hash, ':id' => $id]);
    }
}
