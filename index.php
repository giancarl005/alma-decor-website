<?php
/**
 * Alma Decor - Hybrid SEO Router
 */

require_once __DIR__ . '/app/config.php';
header('Content-Type: text/html; charset=utf-8');

$script_name = $_SERVER['SCRIPT_NAME'];
$base_dir = str_replace('index.php', '', $script_name);
$request_uri = $_SERVER['REQUEST_URI'];
$clean_base = urldecode($base_dir);
$clean_request = urldecode($request_uri);
$uri_path = str_replace($clean_base, '', parse_url($clean_request, PHP_URL_PATH));
$uri = trim($uri_path, '/');
if ($uri === '') $uri = 'home';

// 1. Logica de DETECTARE ADMIN
$is_app = (strpos($uri, 'app') === 0 || strpos($uri, 'admin') === 0);

// Redirecționare automată la login dacă accesăm doar rădăcina admin-ului
if ($is_app && ($uri === 'app' || $uri === 'admin') && !isset($_GET['nav'])) {
    $target = rtrim($base_dir, '/') . '/' . $uri . '/?nav=1#/admin/login';
    header("Location: $target");
    exit;
}

if ($is_app) {
    $html_file = __DIR__ . '/alma-decor/dist/index.html';
    if (!file_exists($html_file)) {
        die("Eroare: Aplicația Admin nu este compilată în alma-decor/dist.");
    }
    $html = file_get_contents($html_file);
    
    // Calea de bază pentru resurse
    $asset_base = rtrim($base_dir, '/') . '/alma-decor/dist/';
    $api_base = rtrim($base_dir, '/');

    // Injectăm script-ul de interceptare API
    $intercept_script = "
    <script>
    (function() {
        const origin = window.location.origin;
        const base = '$api_base'.replace(/\/+$/, '').replace(/^\/+/, '');
        const fullBase = origin + '/' + base;
        console.log('Alma Decor API Interceptor Active. Base:', fullBase);
        const originalFetch = window.fetch;
        window.fetch = function(resource, config) {
            if (typeof resource === 'string' && (resource.startsWith('/api/') || resource.startsWith('/uploads/'))) {
                resource = fullBase + '/' + resource.replace(/^\/+/, '');
            }
            return originalFetch(resource, config);
        };
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (typeof url === 'string' && (url.startsWith('/api/') || url.startsWith('/uploads/'))) {
                url = fullBase + '/' + url.replace(/^\/+/, '');
            }
            return originalOpen.apply(this, arguments);
        };
    })();
    </script>";
    
    $html = str_replace('<head>', '<head>' . $intercept_script, $html);
    
    // Corecții căi
    $html = str_replace('"/app/', '"' . $asset_base, $html);
    $html = str_replace('"/api/', '"' . $api_base . '/api/', $html);
    $html = str_replace('"/uploads/', '"' . $api_base . '/uploads/', $html);
    $html = str_replace('"/assets/', '"' . $asset_base . 'assets/', $html);
    $html = str_replace("'/assets/", "'" . $asset_base . "assets/", $html);
    $html = str_replace('href="./', 'href="' . $asset_base, $html);
    $html = str_replace('src="./', 'src="' . $asset_base, $html);
    
    echo $html;
    exit; // OPRIM TOTUL AICI PENTRU ADMIN
}

// 2. Logica de STOREFRONT (Next.js)
$html_file = __DIR__ . '/alma-decor-next/out/index.html';
$next_path = __DIR__ . '/alma-decor-next/out/' . $uri . '.html';

if (file_exists($next_path)) {
    $html_file = $next_path;
} elseif (file_exists(__DIR__ . '/alma-decor-next/out/' . $uri . '/index.html')) {
    $html_file = __DIR__ . '/alma-decor-next/out/' . $uri . '/index.html';
}

if (!file_exists($html_file)) {
    $html_file = __DIR__ . '/alma-decor-next/out/index.html';
}

if (!file_exists($html_file)) {
    if ($_SERVER['HTTP_HOST'] === 'localhost' || $_SERVER['HTTP_HOST'] === '127.0.0.1') {
         header("Location: http://localhost:3001/" . ltrim($uri_path, '/'));
         exit;
    }
    die("Eroare: Aplicația Next.js nu este compilată.");
}

$html = file_get_contents($html_file);
$next_asset_base = rtrim($base_dir, '/') . '/alma-decor-next/out/';
$html = str_replace('/_next/', $next_asset_base . '_next/', $html);

// SEO & Tracking pentru Storefront
$seo = [
    'title' => 'Alma Decor - Design Interior & Exterior Premium',
    'description' => 'Soluții complete de design interior: parchet, tapet, perdele și consultanță specializată.',
    'image' => 'https://www.almadecor.ro/assets/og-image.jpg'
];

// ... (Preluare date SEO specifice din DB dacă e cazul)
if (strpos($uri, 'produs/') === 0) {
    $slug = str_replace('produs/', '', $uri);
    $stmt = $pdo->prepare("SELECT name, short_description, primary_image FROM produse WHERE slug = ?");
    $stmt->execute([$slug]);
    $prod = $stmt->fetch();
    if ($prod) {
        $seo['title'] = $prod['name'] . ' - Alma Decor';
        $seo['description'] = $prod['short_description'];
        $seo['image'] = $prod['primary_image'];
    }
}

$html = preg_replace('/<title>.*?<\/title>/i', '<title>' . htmlspecialchars($seo['title']) . '</title>', $html);
$html = preg_replace('/<meta name="description" content=".*?"/i', '<meta name="description" content="' . htmlspecialchars($seo['description']) . '"', $html);

// Tracking Pixels
$stmt = $pdo->query("SELECT * FROM settings WHERE setting_key LIKE 'pixel_%'");
$pixels_data = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
$tracking = "";
if (!empty($pixels_data['pixel_facebook'])) $tracking .= "<script>/* FB Pixel */</script>"; // Simplificat pentru demo
if (!empty($pixels_data['pixel_google_analytics'])) $tracking .= "<script>/* GA Pixel */</script>";

$html = str_replace('</head>', $tracking . '</head>', $html);

echo $html;
