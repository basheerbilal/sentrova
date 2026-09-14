<?php
declare(strict_types=1);

/**
 * SENTROVA CCTV MONITORING - REST API ENTRY POINT
 * PHP 8.3+ / Apache / Nginx
 */

// Error reporting shielding for production
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Global exception handler to return clean JSON error messages
set_exception_handler(function (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'data' => [
            'token' => null,
            'admin' => null
        ],
        'errors' => []
    ]);
    exit;
});

// Autoload application classes (compatible with Windows and Linux case-sensitivity)
spl_autoload_register(function (string $class) {
    $prefix = 'Sentrova\\';
    $baseDir = dirname(__DIR__) . '/';

    if (strncmp($prefix, $class, strlen($prefix)) !== 0) {
        return;
    }

    $relativeClass = substr($class, strlen($prefix));
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (file_exists($file)) {
        require_once $file;
        return;
    }

    // Support Linux where directory names are lowercase (config, controllers, models, etc.)
    $parts = explode('\\', $relativeClass);
    if (count($parts) > 1) {
        for ($i = 0; $i < count($parts) - 1; $i++) {
            $parts[$i] = strtolower($parts[$i]);
        }
        $fileLower = $baseDir . implode('/', $parts) . '.php';
        if (file_exists($fileLower)) {
            require_once $fileLower;
            return;
        }
    }
});

// Require API routes file
require_once dirname(__DIR__) . '/routes/api.php';

use Sentrova\Config\Cors;
use Sentrova\Routes\Router;

// Handle CORS headers and preflight
Cors::handle();

// Dispatch route
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = $_SERVER['REQUEST_URI'] ?? '/';

Router::dispatch($method, $uri);
