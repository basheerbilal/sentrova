<?php
declare(strict_types=1);

namespace Sentrova\Helpers;

use Sentrova\Config\Database;
use PDO;

class Mailer {
    private static function getConfig(): array {
        $config = [
            'from' => 'monitoring@sentrova.co.uk',
            'from_name' => 'SENTROVA Operations',
            'admin_email' => 'monitoring@sentrova.co.uk',
        ];

        try {
            $db = Database::getConnection();
            $stmt = $db->query("SELECT key_name, key_value FROM site_settings WHERE key_name IN ('email', 'admin_notification_email', 'smtp_from', 'company_name')");
            $rows = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
            if (!empty($rows['admin_notification_email'])) {
                $config['admin_email'] = $rows['admin_notification_email'];
            } elseif (!empty($rows['email'])) {
                $config['admin_email'] = $rows['email'];
            }
            if (!empty($rows['smtp_from'])) {
                $config['from'] = $rows['smtp_from'];
            }
        } catch (\Exception $e) {
            // fallback
        }

        return $config;
    }

    private static function sendHtmlMail(string $to, string $subject, string $htmlBody): bool {
        $config = self::getConfig();
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $headers .= "From: {$config['from_name']} <{$config['from']}>\r\n";
        $headers .= "Reply-To: {$config['from']}\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        return @mail($to, $subject, $htmlBody, $headers);
    }

    public static function sendQuoteEmails(array $quote): void {
        $config = self::getConfig();
        $fullName = htmlspecialchars($quote['full_name'] ?? '');
        $businessName = htmlspecialchars($quote['business_name'] ?? '');
        $phone = htmlspecialchars($quote['phone'] ?? '');
        $email = htmlspecialchars($quote['email'] ?? '');
        $cameras = (int)($quote['camera_count'] ?? 1);
        $location = htmlspecialchars($quote['location'] ?? 'Not specified');
        $message = htmlspecialchars($quote['message'] ?? '');

        // Admin Alert
        $adminHtml = "
        <div style='font-family: Arial, sans-serif; background: #060E1E; color: #fff; padding: 20px; border-radius: 12px;'>
            <h2 style='color: #00D2FF;'>🚨 New Quote Request</h2>
            <p><strong>Business:</strong> {$businessName}</p>
            <p><strong>Contact:</strong> {$fullName} ({$email}, {$phone})</p>
            <p><strong>Location:</strong> {$location}</p>
            <p><strong>Cameras:</strong> {$cameras}</p>
            " . ($message ? "<p><strong>Notes:</strong> {$message}</p>" : "") . "
            <p><a href='https://api.whatsapp.com/send?phone=" . preg_replace('/[^0-9]/', '', $phone) . "' style='display:inline-block;padding:10px 20px;background:#10B981;color:#fff;text-decoration:none;border-radius:6px;'>WhatsApp Client</a></p>
        </div>";

        // Client Confirmation
        $clientHtml = "
        <div style='font-family: Arial, sans-serif; background: #060E1E; color: #fff; padding: 25px; border-radius: 12px;'>
            <h2 style='color: #00D2FF;'>SENTROVA UK CCTV Operations</h2>
            <p>Dear {$fullName},</p>
            <p>Thank you for requesting 24/7 CCTV surveillance monitoring for <strong>{$businessName}</strong>.</p>
            <p>Our operations desk is reviewing your requirements ({$cameras} cameras). A specialist will contact you within 30 minutes.</p>
            <p>Direct Desk: +44 7742 476163 | WhatsApp: +44 7448 871603</p>
        </div>";

        self::sendHtmlMail($config['admin_email'], "🚨 [New Quote] {$businessName} ({$fullName})", $adminHtml);
        if ($email) {
            self::sendHtmlMail($email, "Your Sentrova CCTV Surveillance Proposal", $clientHtml);
        }
    }

    public static function sendNewsletterEmails(string $subscriberEmail): void {
        $config = self::getConfig();
        $adminHtml = "
        <div style='font-family: Arial, sans-serif; background: #060E1E; color: #fff; padding: 20px; border-radius: 12px;'>
            <h2 style='color: #00D2FF;'>📰 New Newsletter Subscriber</h2>
            <p>New subscriber: <strong>{$subscriberEmail}</strong></p>
        </div>";

        $welcomeHtml = "
        <div style='font-family: Arial, sans-serif; background: #060E1E; color: #fff; padding: 20px; border-radius: 12px;'>
            <h2 style='color: #00D2FF;'>Welcome to Sentrova Intelligence Dispatch</h2>
            <p>Thank you for subscribing to our monthly commercial crime and loss prevention briefing.</p>
        </div>";

        self::sendHtmlMail($config['admin_email'], "📰 [Newsletter Subscriber] {$subscriberEmail}", $adminHtml);
        self::sendHtmlMail($subscriberEmail, "Welcome to Sentrova Surveillance Intelligence", $welcomeHtml);
    }
}
