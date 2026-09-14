<?php
declare(strict_types=1);

namespace Sentrova\Routes;

use Sentrova\Controllers\AuthController;
use Sentrova\Controllers\ServiceController;
use Sentrova\Controllers\PackageController;
use Sentrova\Controllers\IndustryController;
use Sentrova\Controllers\FaqController;
use Sentrova\Controllers\TestimonialController;
use Sentrova\Controllers\QuoteController;
use Sentrova\Controllers\ContactController;
use Sentrova\Controllers\SettingController;
use Sentrova\Controllers\DashboardController;
use Sentrova\Controllers\UploadController;
use Sentrova\Helpers\Response;

class Router {
    public static function dispatch(string $method, string $uri): void {
        // Strip query string
        $path = parse_url($uri, PHP_URL_PATH);
        // Normalize leading and trailing slashes
        $path = '/' . trim($path, '/');

        // PUBLIC ROUTES
        if ($method === 'GET' && $path === '/api/services') {
            (new ServiceController())->index();
            return;
        }
        if ($method === 'GET' && $path === '/api/packages') {
            (new PackageController())->index();
            return;
        }
        if ($method === 'GET' && $path === '/api/industries') {
            (new IndustryController())->index();
            return;
        }
        if ($method === 'GET' && $path === '/api/faqs') {
            (new FaqController())->index();
            return;
        }
        if ($method === 'GET' && $path === '/api/testimonials') {
            (new TestimonialController())->index();
            return;
        }
        if ($method === 'GET' && $path === '/api/settings') {
            (new SettingController())->index();
            return;
        }
        if ($method === 'POST' && ($path === '/api/quote-request' || $path === '/api/quote-requests')) {
            (new QuoteController())->store();
            return;
        }
        if ($method === 'POST' && ($path === '/api/contact' || $path === '/api/contact-messages')) {
            (new ContactController())->store();
            return;
        }

        // AUTH ROUTES
        if ($method === 'POST' && $path === '/api/admin/login') {
            (new AuthController())->login();
            return;
        }
        if ($method === 'POST' && $path === '/api/admin/logout') {
            (new AuthController())->logout();
            return;
        }
        if ($method === 'GET' && $path === '/api/admin/me') {
            (new AuthController())->me();
            return;
        }

        // ADMIN DASHBOARD
        if ($method === 'GET' && $path === '/api/admin/dashboard') {
            (new DashboardController())->stats();
            return;
        }

        // ADMIN SERVICES
        if ($method === 'GET' && $path === '/api/admin/services') {
            (new ServiceController())->indexAdmin();
            return;
        }
        if ($method === 'POST' && $path === '/api/admin/services') {
            (new ServiceController())->store();
            return;
        }
        if (preg_match('#^/api/admin/services/(\d+)(/delete)?$#', $path, $matches)) {
            $id = (int)$matches[1];
            if (!empty($matches[2]) || $method === 'DELETE') {
                (new ServiceController())->destroy($id);
                return;
            }
            if ($method === 'GET') {
                (new ServiceController())->show($id);
                return;
            }
            if ($method === 'PUT' || $method === 'PATCH' || $method === 'POST') {
                (new ServiceController())->update($id);
                return;
            }
        }

        // ADMIN PACKAGES
        if ($method === 'GET' && $path === '/api/admin/packages') {
            (new PackageController())->indexAdmin();
            return;
        }
        if (preg_match('#^/api/admin/packages/(\d+)(/delete)?$#', $path, $matches)) {
            $id = (int)$matches[1];
            if (!empty($matches[2]) || $method === 'DELETE') {
                (new PackageController())->destroy($id);
                return;
            }
            if ($method === 'GET') {
                (new PackageController())->show($id);
                return;
            }
            if ($method === 'PUT' || $method === 'PATCH' || $method === 'POST') {
                (new PackageController())->update($id);
                return;
            }
        }
        // PACKAGE FEATURES
        if (preg_match('#^/api/admin/packages/(\d+)/features$#', $path, $matches) && $method === 'POST') {
            (new PackageController())->addFeature((int)$matches[1]);
            return;
        }
        if (preg_match('#^/api/admin/features/(\d+)(/delete)?$#', $path, $matches)) {
            $id = (int)$matches[1];
            if (!empty($matches[2]) || $method === 'DELETE') {
                (new PackageController())->deleteFeature($id);
                return;
            }
            if ($method === 'PUT' || $method === 'PATCH' || $method === 'POST') {
                (new PackageController())->updateFeature($id);
                return;
            }
        }

        // ADMIN INDUSTRIES
        if ($method === 'GET' && $path === '/api/admin/industries') {
            (new IndustryController())->indexAdmin();
            return;
        }
        if ($method === 'POST' && $path === '/api/admin/industries') {
            (new IndustryController())->store();
            return;
        }
        if (preg_match('#^/api/admin/industries/(\d+)(/delete)?$#', $path, $matches)) {
            $id = (int)$matches[1];
            if (!empty($matches[2]) || $method === 'DELETE') {
                (new IndustryController())->destroy($id);
                return;
            }
            if ($method === 'PUT' || $method === 'PATCH' || $method === 'POST') {
                (new IndustryController())->update($id);
                return;
            }
        }

        // ADMIN FAQS
        if ($method === 'GET' && $path === '/api/admin/faqs') {
            (new FaqController())->indexAdmin();
            return;
        }
        if ($method === 'POST' && $path === '/api/admin/faqs') {
            (new FaqController())->store();
            return;
        }
        if (preg_match('#^/api/admin/faqs/(\d+)(/delete)?$#', $path, $matches)) {
            $id = (int)$matches[1];
            if (!empty($matches[2]) || $method === 'DELETE') {
                (new FaqController())->destroy($id);
                return;
            }
            if ($method === 'PUT' || $method === 'PATCH' || $method === 'POST') {
                (new FaqController())->update($id);
                return;
            }
        }

        // ADMIN TESTIMONIALS
        if ($method === 'GET' && $path === '/api/admin/testimonials') {
            (new TestimonialController())->indexAdmin();
            return;
        }
        if ($method === 'POST' && $path === '/api/admin/testimonials') {
            (new TestimonialController())->store();
            return;
        }
        if (preg_match('#^/api/admin/testimonials/(\d+)(/delete)?$#', $path, $matches)) {
            $id = (int)$matches[1];
            if (!empty($matches[2]) || $method === 'DELETE') {
                (new TestimonialController())->destroy($id);
                return;
            }
            if ($method === 'PUT' || $method === 'PATCH' || $method === 'POST') {
                (new TestimonialController())->update($id);
                return;
            }
        }

        // ADMIN QUOTES
        if ($method === 'GET' && $path === '/api/admin/quotes') {
            (new QuoteController())->indexAdmin();
            return;
        }
        if (preg_match('#^/api/admin/quotes/(\d+)(/delete)?$#', $path, $matches)) {
            $id = (int)$matches[1];
            if (!empty($matches[2]) || $method === 'DELETE') {
                (new QuoteController())->destroy($id);
                return;
            }
            if ($method === 'GET') {
                (new QuoteController())->show($id);
                return;
            }
            if ($method === 'PUT' || $method === 'PATCH' || $method === 'POST') {
                (new QuoteController())->update($id);
                return;
            }
        }

        // ADMIN CONTACTS
        if ($method === 'GET' && $path === '/api/admin/contacts') {
            (new ContactController())->indexAdmin();
            return;
        }
        if (preg_match('#^/api/admin/contacts/(\d+)(/delete)?$#', $path, $matches)) {
            $id = (int)$matches[1];
            if (!empty($matches[2]) || $method === 'DELETE') {
                (new ContactController())->destroy($id);
                return;
            }
            if ($method === 'GET') {
                (new ContactController())->show($id);
                return;
            }
            if ($method === 'PUT' || $method === 'PATCH') {
                (new ContactController())->update($id);
                return;
            }
        }

        // ADMIN SETTINGS
        if ($method === 'GET' && $path === '/api/admin/settings') {
            (new SettingController())->indexAdmin();
            return;
        }
        if (($method === 'PUT' || $method === 'POST') && $path === '/api/admin/settings') {
            (new SettingController())->update();
            return;
        }

        // ADMIN ORDERS / TRANSACTIONS
        if ($method === 'GET' && str_starts_with($path, '/api/admin/orders')) {
            Response::success([
                'records' => [],
                'summary' => [
                    'total_orders'  => 0,
                    'total_revenue' => 0,
                    'total_hours'   => 0,
                    'paid_orders'   => 0,
                ],
                'pagination' => [
                    'page'        => 1,
                    'limit'       => 20,
                    'total'       => 0,
                    'total_pages' => 1,
                ]
            ]);
            return;
        }

        // IMAGE UPLOAD
        if ($method === 'POST' && $path === '/api/admin/upload') {
            (new UploadController())->upload();
            return;
        }

        // 404 Route Not Found
        Response::notFound("Endpoint {$method} {$path} does not exist.");
    }
}
