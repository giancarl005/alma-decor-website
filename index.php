<?php
/**
 * Alma Decor - Hybrid SEO Router
 */

require_once __DIR__ . '/app/config.php';
header('Content-Type: text/html; charset=utf-8');

// Detectăm calea de bază (folderul proiectului)
$script_name = $_SERVER['SCRIPT_NAME'];
$base_dir = str_replace('index.php', '', $script_name);
$request_uri = $_SERVER['REQUEST_URI'];

// Obținem URI-ul curat (fără folderul de bază)
$uri_path = str_replace($base_dir, '', urldecode(parse_url($request_uri, PHP_URL_PATH)));
$uri = trim($uri_path, '/');
if ($uri === '') $uri = 'home';

// Detectăm dacă suntem pe o rută de Admin sau vechea aplicație
$is_app = (strpos($request_uri, '/app/') !== false || strpos($request_uri, '/app') === (strlen($request_uri) - 4));

$seo = [
    'title' => 'Alma Decor - Design Interior & Exterior Premium',
    'description' => 'Soluții complete de design interior: parchet, tapet, perdele și consultanță specializată.',
    'image' => 'https://www.almadecor.ro/assets/og-image.jpg'
];

// ... (logica de SEO rămâne neschimbată)
if (!$is_app) {
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
    } elseif (strpos($uri, 'blog/') === 0) {
        $slug = str_replace('blog/', '', $uri);
        $stmt = $pdo->prepare("SELECT title, excerpt, featured_image FROM articole_blog WHERE slug = ?");
        $stmt->execute([$slug]);
        $art = $stmt->fetch();
        if ($art) {
            $seo['title'] = $art['title'] . ' - Blog Alma Decor';
            $seo['description'] = $art['excerpt'];
            $seo['image'] = $art['featured_image'];
        }
    }
}

if ($is_app) {
    $html_file = __DIR__ . '/alma-decor/dist/index.html';
    if (!file_exists($html_file)) {
        die("Eroare: Aplicația Admin nu este compilată în alma-decor/dist.");
    }
    $html = file_get_contents($html_file);
    
    // Calea de bază pentru resurse
    $asset_base = rtrim($base_dir, '/') . '/alma-decor/dist/';
    
    // Injectăm un script pentru a corecta apelurile API în timp real (Intercepție Fetch)
    $api_base = rtrim($base_dir, '/');
    $intercept_script = "
    <script>
    (function() {
        const origin = window.location.origin;
        const base = '$api_base'.replace(/\/+$/, '').replace(/^\/+/, '');
        const fullBase = origin + '/' + base;
        
        console.log('Alma Decor API Interceptor [ABSOLUTE] Active. Base:', fullBase);

        // Interceptare Fetch
        const originalFetch = window.fetch;
        window.fetch = function(resource, config) {
            if (typeof resource === 'string' && (resource.startsWith('/api/') || resource.startsWith('/uploads/'))) {
                const newUrl = fullBase + '/' + resource.replace(/^\/+/, '');
                console.log('Intercepted Fetch:', resource, '->', newUrl);
                resource = newUrl;
            }
            return originalFetch(resource, config);
        };

        // Interceptare XMLHttpRequest (Axios)
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (typeof url === 'string' && (url.startsWith('/api/') || url.startsWith('/uploads/'))) {
                const newUrl = fullBase + '/' + url.replace(/^\/+/, '');
                console.log('Intercepted XHR:', url, '->', newUrl);
                url = newUrl;
            }
            return originalOpen.apply(this, arguments);
        };
    })();
    </script>
    ";
    $html = str_replace('<head>', '<head>' . $intercept_script, $html);
    
    // Rescriem toate link-urile care încep cu /app/, /api/ sau /uploads/ in HTML
    $html = str_replace('"/app/', '"' . $asset_base, $html);
    $html = str_replace('"/api/', '"' . rtrim($base_dir, '/') . '/api/', $html);
    $html = str_replace('"/uploads/', '"' . rtrim($base_dir, '/') . '/uploads/', $html);
    
    // Corecție pentru butonul View Storefront
    $html = str_replace('href="/magazin"', 'href="' . rtrim($base_dir, '/') . '/"', $html);
    
    $html = str_replace("' /app/", "'" . $asset_base, $html);
    $html = str_replace('href="./', 'href="' . $asset_base, $html);
    $html = str_replace('src="./', 'src="' . $asset_base, $html);
    
    echo $html;
    exit;
} else {
    // 2. Servim versiunea Next.js (Storefront Nou)
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
        // Dacă nu există build static, poate vrei să fii redirecționat către portul Node (doar local)
        if ($_SERVER['HTTP_HOST'] === 'localhost' || $_SERVER['HTTP_HOST'] === '127.0.0.1') {
             $clean_path = ltrim($uri_path, '/');
             header("Location: http://localhost:3001/" . $clean_path);
             exit;
        }
        die("Eroare: Aplicația Next.js nu este compilată.");
    }
    
    $html = file_get_contents($html_file);
    $next_asset_base = rtrim($base_dir, '/') . '/alma-decor-next/out/';
    $html = str_replace('/_next/', $next_asset_base . '_next/', $html);
}

// Înlocuim Meta Tag-urile pentru SEO (doar dacă avem date specifice și nu suntem în Next.js)
if ($is_app) {
    $html = preg_replace('/<title>.*?<\/title>/i', '<title>' . htmlspecialchars($seo['title']) . '</title>', $html);
    $html = preg_replace('/<meta name="description" content=".*?"/i', '<meta name="description" content="' . htmlspecialchars($seo['description']) . '"', $html);
}

// Preluăm Pixelii de tracking
$stmt = $pdo->query("SELECT * FROM settings WHERE setting_key LIKE 'pixel_%'");
$pixels_data = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

$tracking_scripts = "";
if (!empty($pixels_data['pixel_facebook'])) {
    $tracking_scripts .= "\n<!-- Facebook Pixel -->\n<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '{$pixels_data['pixel_facebook']}');fbq('track', 'PageView');</script>";
}
if (!empty($pixels_data['pixel_google_analytics'])) {
    $tracking_scripts .= "\n<!-- Google Analytics -->\n<script async src='https://www.googletagmanager.com/gtag/js?id={$pixels_data['pixel_google_analytics']}'></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','{$pixels_data['pixel_google_analytics']}');</script>";
}

$html = str_replace('</head>', $tracking_scripts . '</head>', $html);

echo $html;
