<?php
/**
 * Alma Decor - Hybrid SEO Router
 */

require_once __DIR__ . '/app/config.php';

$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$base_path = '/'; // Ajustează dacă site-ul e într-un subdirector

// Curățăm URI-ul pentru a obține cheia paginii sau slug-ul
$uri = trim(str_replace('Alma Decor Website/', '', $request_uri), '/');
if ($uri === '') $uri = 'home';

$seo = [
    'title' => 'Alma Decor - Design Interior & Exterior Premium',
    'description' => 'Soluții complete de design interior: parchet, tapet, perdele și consultanță specializată.',
    'image' => 'https://www.almadecor.ro/assets/og-image.jpg'
];

// 1. Căutăm în tabelul de pagini statice
$stmt = $pdo->prepare("SELECT * FROM seo_pages WHERE page_key = ?");
$stmt->execute([$uri]);
$page_seo = $stmt->fetch();

if ($page_seo) {
    $seo['title'] = $page_seo['meta_title'];
    $seo['description'] = $page_seo['meta_description'];
    if ($page_seo['og_image']) $seo['image'] = $page_seo['og_image'];
} else {
    // 2. Căutăm dacă este un produs
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
    // 3. Căutăm dacă este un articol de blog
    elseif (strpos($uri, 'blog/') === 0) {
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

// Citim fișierul index.html generat de Vite
$html_file = __DIR__ . '/alma-decor/dist/index.html';
if (!file_exists($html_file)) {
    die("Eroare: Aplicația React nu este compilată. Rulează 'npm run build' în folderul alma-decor.");
}

$html = file_get_contents($html_file);

// Înlocuim Meta Tag-urile pentru SEO (Server-Side Injection)
$html = preg_replace('/<title>.*?<\/title>/i', '<title>' . htmlspecialchars($seo['title']) . '</title>', $html);
$html = preg_replace('/<meta name="description" content=".*?"/i', '<meta name="description" content="' . htmlspecialchars($seo['description']) . '"', $html);
$html = preg_replace('/<meta property="og:title" content=".*?"/i', '<meta property="og:title" content="' . htmlspecialchars($seo['title']) . '"', $html);
$html = preg_replace('/<meta property="og:description" content=".*?"/i', '<meta property="og:description" content="' . htmlspecialchars($seo['description']) . '"', $html);
$html = preg_replace('/<meta property="og:image" content=".*?"/i', '<meta property="og:image" content="' . htmlspecialchars($seo['image']) . '"', $html);

// 4. Preluăm Pixelii de tracking
$stmt = $pdo->query("SELECT * FROM settings WHERE setting_key LIKE 'pixel_%'");
$pixels_data = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

$tracking_scripts = "";
// Facebook Pixel
if (!empty($pixels_data['pixel_facebook'])) {
    $tracking_scripts .= "
    <!-- Facebook Pixel -->
    <script>
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '{$pixels_data['pixel_facebook']}');
    fbq('track', 'PageView');
    </script>
    <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id={$pixels_data['pixel_facebook']}&ev=PageView&noscript=1'/></noscript>
    ";
}
// Google Analytics (G-ID)
if (!empty($pixels_data['pixel_google_analytics'])) {
    $tracking_scripts .= "
    <!-- Google Analytics -->
    <script async src='https://www.googletagmanager.com/gtag/js?id={$pixels_data['pixel_google_analytics']}'></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '{$pixels_data['pixel_google_analytics']}');
    </script>
    ";
}
// Google Tag Manager
if (!empty($pixels_data['pixel_google_tag_manager'])) {
    $tracking_scripts .= "
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','{$pixels_data['pixel_google_tag_manager']}');</script>
    ";
}
// TikTok Pixel
if (!empty($pixels_data['pixel_tiktok'])) {
    $tracking_scripts .= "
    <!-- TikTok Pixel -->
    <script>
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq[e].length,n=0;n<e;n++)ttq.setAndDefer(t,ttq[e][n]);return t};var e='https://analytics.tiktok.com/i18n/pixel/events.js';ttq.load=function(e,n){var i='https://analytics.tiktok.com/i18n/pixel/events.js';ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n;var o=document.createElement('script');o.type='text/javascript',o.async=!0,o.src=i;var a=document.getElementsByTagName('script')[0];a.parentNode.insertBefore(o,a)};
      ttq.load('{$pixels_data['pixel_tiktok']}');
      ttq.page();
    }(window, document, 'ttq');
    </script>
    ";
}

$html = str_replace('</head>', $tracking_scripts . '</head>', $html);

// Ajustăm căile către assets pentru a funcționa din rădăcină sau subdirector
// Căutăm href=" și src=" care nu încep cu http, https sau //
$base_url = rtrim(SITE_URL, '/');
$dist_path = $base_url . '/alma-decor/dist/';

// Înlocuim căile relative care încep cu ./
$html = str_replace('href="./', 'href="' . $dist_path, $html);
$html = str_replace('src="./', 'src="' . $dist_path, $html);

// Înlocuim căile absolute care încep cu / dar nu sunt URL-uri complete
$html = preg_replace('/(href|src)="\/([^h\/][^"]*)"/i', '$1="' . $dist_path . '$2"', $html);

// Înlocuim căile relative care nu au prefix (ex: index.css)
$html = preg_replace('/(href|src)="(?!(http|https|\/\/|\/|\.\/))([^"]+)"/i', '$1="' . $dist_path . '$3"', $html);

echo $html;
