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
// Pe local (Laragon), servim din folderul 'out' dacă există, altfel facem redirect la portul 3001
if ($_SERVER['HTTP_HOST'] === 'localhost' || $_SERVER['HTTP_HOST'] === '127.0.0.1') {
    $html_file = __DIR__ . '/alma-decor-next/out/index.html';
    if (!file_exists($html_file)) {
        header("Location: http://localhost:3001/" . ltrim($uri_path, '/'));
        exit;
    }
    echo file_get_contents($html_file);
} else {
    // Pe server, lăsăm aplicația Node.js să preia controlul.
    // Dacă am ajuns aici, înseamnă că acest fișier a fost apelat greșit pentru o rută de storefront.
    // Nu afișăm nimic și lăsăm serverul să continue către următorul handler (Node.js).
}
