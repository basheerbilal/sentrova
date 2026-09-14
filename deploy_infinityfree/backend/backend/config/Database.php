<?php
declare(strict_types=1);

namespace Sentrova\Config;

use PDO;
use PDOException;

class Database {
    private static ?PDO $connection = null;

    public static function getConnection(): PDO {
        if (self::$connection !== null) {
            return self::$connection;
        }

        $host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: 'sql102.infinityfree.com';
        $port = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?: '3306';
        $database = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'if0_42872602_sentrova';
        $username = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'if0_42872602';
        $password = $_ENV['DB_PASSWORD'] ?? getenv('DB_PASSWORD') ?: 'YAHAN_APNA_PASSWORD_LIKHEIN';

        $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];

        try {
            self::$connection = new PDO($dsn, $username, $password, $options);
            return self::$connection;
        } catch (PDOException $e) {
            error_log("Database Connection Error: " . $e->getMessage());
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => 'Database connection failed: ' . $e->getMessage(),
                'data' => [
                    'token' => null,
                    'admin' => null
                ],
                'errors' => []
            ]);
            exit;
        }
    }
}
