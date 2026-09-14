<?php
declare(strict_types=1);

namespace Sentrova\Controllers;

use Sentrova\Helpers\Response;
use Sentrova\Middleware\AuthMiddleware;

class UploadController {
    private const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    ];

    public function upload(): void {
        AuthMiddleware::authenticate();

        if (empty($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            Response::error('No file was uploaded or an upload error occurred', 400);
        }

        $file = $_FILES['image'];

        if ($file['size'] > self::MAX_SIZE) {
            Response::error('Uploaded image exceeds 5MB size limit', 422);
        }

        // Verify MIME type using finfo
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);

        if (!array_key_exists($mime, self::ALLOWED_MIME_TYPES)) {
            Response::error('Invalid file type. Only JPG, PNG, and WebP images are permitted.', 422);
        }

        $extension = self::ALLOWED_MIME_TYPES[$mime];
        $safeFileName = bin2hex(random_bytes(16)) . '_' . time() . '.' . $extension;

        $targetDir = dirname(__DIR__) . '/uploads/';
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $targetPath = $targetDir . $safeFileName;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            Response::error('Failed to store uploaded image on server', 500);
        }

        // Secure file permissions
        chmod($targetPath, 0644);

        $url = '/backend/uploads/' . $safeFileName;
        Response::success([
            'url'      => $url,
            'filename' => $safeFileName
        ], 'Image uploaded successfully', 201);
    }
}
