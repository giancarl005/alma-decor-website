<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../app/config.php';

// --- HELPERS ---

function parseScrapedPrice($priceText) {
    if (!$priceText) return 0;
    if (is_numeric($priceText)) return (float)$priceText;
    
    $priceText = preg_replace('/[^0-9,.]/', '', (string)$priceText);
    if (!$priceText) return 0;

    if (strpos($priceText, '.') !== false && strpos($priceText, ',') !== false) {
        if (strpos($priceText, '.') < strpos($priceText, ',')) {
            $priceText = str_replace('.', '', $priceText);
            $priceText = str_replace(',', '.', $priceText);
        } else {
            $priceText = str_replace(',', '', $priceText);
        }
    } else {
        if (strpos($priceText, ',') !== false) {
            if (substr_count($priceText, ',') == 1) $priceText = str_replace(',', '.', $priceText);
            else $priceText = str_replace(',', '', $priceText);
        } else if (strpos($priceText, '.') !== false) {
            if (substr_count($priceText, '.') > 1) $priceText = str_replace('.', '', $priceText);
            else if (preg_match('/\.\d{3}$/', $priceText)) $priceText = str_replace('.', '', $priceText);
        }
    }
    return (float)$priceText;
}

function getHtml($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    $html = curl_exec($ch);
    curl_close($ch);
    return $html;
}

function decodeEntities($text) {
    if (!$text) return '';
    $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    // Basic manual replacement for common Romanian entities
    return str_replace(
        ['&#259;', '&#537;', '&#539;', '&#226;', '&#238;', '&#258;', '&#536;', '&#538;', '&#194;', '&#206;', '&#351;', '&#355;', '&#350;', '&#354;', '&#174;', '&#8482;'],
        ['ă', 'ș', 'ț', 'â', 'î', 'Ă', 'Ș', 'Ț', 'Â', 'Î', 'ș', 'ț', 'Ș', 'Ț', '®', '™'],
        $text
    );
}

function extractLdJson($html) {
    preg_match_all('/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/is', $html, $jsonMatches);
    if (!empty($jsonMatches[1])) {
        foreach ($jsonMatches[1] as $jsonStr) {
            $decoded = json_decode(trim($jsonStr), true);
            if ($decoded) {
                $items = isset($decoded['@type']) ? [$decoded] : $decoded;
                foreach ($items as $item) {
                    if (isset($item['@type']) && (strpos($item['@type'], 'Product') !== false)) {
                        return $item;
                    }
                }
            }
        }
    }
    return null;
}

function generateSlug($text) {
    $chars = [
        'ă' => 'a', 'â' => 'a', 'î' => 'i', 'ș' => 's', 'ț' => 't',
        'Ă' => 'a', 'Â' => 'a', 'Î' => 'i', 'Ș' => 's', 'Ț' => 't',
        'ş' => 's', 'ţ' => 't', 'Ş' => 's', 'Ţ' => 't'
    ];
    $text = strtr($text, $chars);
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    return trim($text, '-');
}

function uploadImage($url, $sku) {
    if (!$url) return null;
    $ext = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';
    $filename = $sku . '-' . time() . '-' . rand(100, 999) . '.' . $ext;
    $uploadDir = '../../uploads/products/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
    $path = $uploadDir . $filename;
    
    $content = getHtml($url);
    if ($content && file_put_contents($path, $content)) return 'uploads/products/' . $filename;
    return $url;
}

// --- SCRAPERS ---

function scrapeProductNmc($html, $url) {
    $product = [
        'name' => '', 'sku' => '', 'price' => 0, 'description' => '',
        'primary_image' => '', 'gallery' => [], 'url' => $url,
        'brand' => 'ADRo®', 'category_id' => 3, 'specs' => []
    ];

    $ld = extractLdJson($html);
    if ($ld) {
        $product['name'] = decodeEntities($ld['name'] ?? '');
        $product['sku'] = $ld['sku'] ?? $ld['mpn'] ?? '';
        $offers = $ld['offers'] ?? null;
        if ($offers) {
            $offer = isset($offers[0]) ? $offers[0] : $offers;
            $product['price'] = parseScrapedPrice($offer['price'] ?? 0);
        }
        $product['description'] = decodeEntities($ld['description'] ?? '');
        if (isset($ld['image'])) {
            $imgs = is_array($ld['image']) ? $ld['image'] : [$ld['image']];
            foreach ($imgs as $img) {
                $imgUrl = is_array($img) ? ($img['contentUrl'] ?? $img['url'] ?? '') : $img;
                if ($imgUrl) {
                    if (!$product['primary_image']) $product['primary_image'] = $imgUrl;
                    else $product['gallery'][] = $imgUrl;
                }
            }
        }
    }

    if (preg_match('/<h1[^>]*>(.*?)<\/h1>/is', $html, $m)) {
        if (!$product['name']) $product['name'] = decodeEntities(trim(strip_tags($m[1])));
    }
    
    if (!$product['sku'] && preg_match('/Model:.*?<span>(.*?)<\/span>/s', $html, $m)) $product['sku'] = trim(strip_tags($m[1]));
    if (!$product['description'] && preg_match('/<div id="tab-description".*?>(.*?)<\/div>/s', $html, $m)) $product['description'] = decodeEntities($m[1]);
    
    return $product;
}

function scrapeProductMardom($html, $url) {
    $product = [
        'name' => '', 'sku' => '', 'price' => 0, 'description' => '',
        'primary_image' => '', 'gallery' => [], 'url' => $url,
        'brand' => 'Mardom Decor', 'category_id' => 3, 'specs' => []
    ];

    if (preg_match('/<h1[^>]*>(.*?)<\/h1>/is', $html, $m)) {
        $product['name'] = decodeEntities(trim(strip_tags($m[1])));
    }

    $ld = extractLdJson($html);
    if ($ld) {
        if (!$product['name']) $product['name'] = decodeEntities($ld['name'] ?? '');
        $product['sku'] = $ld['sku'] ?? $ld['mpn'] ?? '';
        $offers = $ld['offers'] ?? null;
        if ($offers) {
            $offer = isset($offers[0]) ? $offers[0] : $offers;
            $product['price'] = parseScrapedPrice($offer['price'] ?? 0);
        }
        
        if (isset($ld['image'])) {
            $imgs = is_array($ld['image']) ? $ld['image'] : [$ld['image']];
            foreach ($imgs as $img) {
                $imgUrl = is_array($img) ? ($img['contentUrl'] ?? $img['url'] ?? '') : $img;
                if ($imgUrl) {
                    if (!$product['primary_image']) $product['primary_image'] = $imgUrl;
                    else $product['gallery'][] = $imgUrl;
                }
            }
        }
    }

    if (preg_match('/<div[^>]*class="[^"]*description-tab[^"]*".*?>(.*?)<\/div>/is', $html, $m)) {
        $product['description'] = $m[1];
    } else if (preg_match('/<div[^>]*class="[^"]*_descriptionTab[^"]*".*?>(.*?)<\/div>/is', $html, $m)) {
        $product['description'] = $m[1];
    }
    
    $product['description'] = decodeEntities($product['description']);

    // Specs extraction - targeted search for characteristic labels and values
    preg_match_all('/<b[^>]*class="[^"]*-g-characteristics-attribute-title[^"]*".*?>(.*?)<\/b>.*?<span[^>]*class="[^"]*-g-attribute-characteristic-value[^"]*".*?>(.*?)<\/span>/is', $html, $specMatches);
    
    if (empty($specMatches[1])) {
        // Fallback for different Gomag structures
        preg_match_all('/<p[^>]*>.*?<b[^>]*>(.*?)<\/b>.*?<span[^>]*>(.*?)<\/span>.*?<\/p>/is', $html, $specMatches);
    }

    if (!empty($specMatches[1])) {
        foreach ($specMatches[1] as $i => $label) {
            $lbl = trim(strip_tags(decodeEntities($label)));
            $lbl = trim(str_replace(':', '', $lbl));
            $val = trim(strip_tags(decodeEntities($specMatches[2][$i])));
            if ($lbl && $val) {
                $product['specs'][$lbl] = $val;
            }
        }
    }

    if (!$product['primary_image'] && preg_match('/<meta property="og:image" content="(.*?)"/s', $html, $m)) {
        $product['primary_image'] = $m[1];
    }

    return $product;
}

function scrapeCategoryNmc($html) {
    preg_match_all('/<(?:div|a)[^>]*class="[^"]*(?:image|product-thumb)[^"]*".*?href="([^"]+)"/is', $html, $matches);
    return array_values(array_unique(array_filter($matches[1])));
}

function scrapeCategoryMardom($html, $baseUrl) {
    $extract = function($h) {
        $urls = [];
        // Find all <a> tags
        if (preg_match_all('/<a\s+[^>]*href="([^"]+\.html)"[^>]*>/is', $h, $matches)) {
            foreach ($matches[0] as $i => $fullTag) {
                // Check if tag has the _productUrl_ class or matches a Gomag product link pattern
                if (strpos($fullTag, '_productUrl_') !== false || strpos($fullTag, 'class="title') !== false) {
                    $urls[] = $matches[1][$i];
                }
            }
        }
        return array_values(array_unique(array_filter($urls)));
    };

    $allUrls = $extract($html);
    if (preg_match('/class="[^"]*categoryPagination[^"]*">.*?<ol.*?>(.*?)<\/ol>/s', $html, $pagMatches)) {
        preg_match_all('/<a[^>]*>(\d+)<\/a>/', $pagMatches[1], $pageNumbers);
        if (!empty($pageNumbers[1])) {
            $maxPage = max(array_map('intval', $pageNumbers[1]));
            for ($p = 1; $p < $maxPage; $p++) {
                if ($p >= 10) break;
                $separator = (strpos($baseUrl, '?') !== false) ? '&' : '?';
                $pageHtml = getHtml($baseUrl . $separator . 'p=' . $p);
                if ($pageHtml) $allUrls = array_merge($allUrls, $extract($pageHtml));
            }
        }
    }
    return array_values(array_unique(array_filter($allUrls)));
}

// --- IMPORT LOGIC ---

function importProductAsDraft($data, $pdo) {
    $sku = $data['sku'] ?: 'SCRP-' . time() . '-' . rand(100, 999);
    $stmt = $pdo->prepare("SELECT id FROM produse WHERE sku = ?");
    $stmt->execute([$sku]);
    $existing = $stmt->fetch();
    
    $localImg = uploadImage($data['primary_image'], $sku);
    $slug = generateSlug($data['name']);
    
    $cleanDesc = $data['description'];
    if (preg_match('/<div[^>]*class="[^"]*_descriptionTab[^"]*".*?>(.*?)<\/div>/is', $cleanDesc, $m)) $cleanDesc = $m[1];
    $cleanDesc = preg_match('/(.*?)<a[^>]*class="[^"]*product-gspr-widget-button[^"]*".*?>/is', $cleanDesc, $m) ? $m[1] : $cleanDesc;
    $shortDesc = substr(strip_tags($cleanDesc), 0, 500) . '...';

    if ($existing) {
        $productId = $existing['id'];
        $stmt = $pdo->prepare("SELECT price FROM produse WHERE id = ?");
        $stmt->execute([$productId]);
        $oldPrice = $stmt->fetchColumn();
        if ($data['price'] > 0 && abs($data['price'] - $oldPrice) > 0.01) {
            $pdo->prepare("UPDATE produse SET price = ? WHERE id = ?")->execute([$data['price'], $productId]);
        }
        $pdo->prepare("UPDATE produse SET description = ?, short_description = ? WHERE id = ?")->execute([$cleanDesc, $shortDesc, $productId]);
    } else {
        $sql = "INSERT INTO produse (category_id, sku, name, slug, short_description, description, price, stock, stock_status, brand, primary_image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)";
        $pdo->prepare($sql)->execute([$data['category_id'], $sku, $data['name'], $slug, $shortDesc, $cleanDesc, $data['price'], 100, $data['stock_status'] ?? 'in_stoc', $data['brand'], $localImg]);
        $productId = $pdo->lastInsertId();
    }

    if (!empty($data['gallery'])) {
        $pdo->prepare("DELETE FROM produs_imagini WHERE product_id = ?")->execute([$productId]);
        foreach ($data['gallery'] as $index => $imgUrl) {
            $localGalImg = uploadImage($imgUrl, $sku . '-gal-' . $index);
            if ($localGalImg) $pdo->prepare("INSERT INTO produs_imagini (product_id, url, sort_order) VALUES (?, ?, ?)")->execute([$productId, $localGalImg, $index]);
        }
    }

    if (!empty($data['specs'])) {
        $pdo->prepare("DELETE FROM produs_campuri_custom WHERE product_id = ?")->execute([$productId]);
        foreach ($data['specs'] as $label => $value) {
            // Truncate label to 200 to be safe and avoid SQL error
            $label = substr($label, 0, 200);
            $pdo->prepare("INSERT INTO produs_campuri_custom (product_id, field_name, field_value) VALUES (?, ?, ?)")->execute([$productId, $label, $value]);
        }
    }
    return $productId;
}

// --- ENTRY POINT ---

$json = file_get_contents('php://input');
$input = json_decode($json, true);
$action = $input['action'] ?? $_GET['action'] ?? '';
$supplier = $input['supplier'] ?? $_GET['supplier'] ?? 'nmc';
$url = $input['url'] ?? $_POST['url'] ?? '';

if (!$url) { echo json_encode(['status' => 'error', 'message' => 'URL lipsă.']); exit; }
$html = getHtml($url);
if (!$html) { echo json_encode(['status' => 'error', 'message' => 'Eroare accesare URL.']); exit; }

$isCategory = (strpos($url, '.html') === false);

if ($action === 'preview' || $action === 'scrape') {
    if ($isCategory) {
        $productUrls = ($supplier === 'mardom') ? scrapeCategoryMardom($html, $url) : scrapeCategoryNmc($html);
        echo json_encode([
            'status' => 'success', 
            'type' => 'category', 
            'data' => [
                'product_urls' => $productUrls, 
                'total_pages' => 1
            ]
        ]);
    } else {
        $productData = ($supplier === 'mardom') ? scrapeProductMardom($html, $url) : scrapeProductNmc($html, $url);
        echo json_encode(['status' => 'success', 'type' => 'product', 'data' => $productData]);
    }
} elseif ($action === 'scrape_and_import') {
    $productData = ($supplier === 'mardom') ? scrapeProductMardom($html, $url) : scrapeProductNmc($html, $url);
    if (!$productData['name']) { echo json_encode(['status' => 'error', 'message' => 'Eroare extragere date.']); exit; }
    
    $categoryId = $input['category_id'] ?? 3;
    if ($newCategoryName = ($input['new_category'] ?? '')) {
        $stmt = $pdo->prepare("SELECT id FROM categorii WHERE name = ?");
        $stmt->execute([$newCategoryName]);
        $catId = $stmt->fetchColumn();
        if (!$catId) {
            $catSlug = strtolower(trim(preg_replace('/[^a-z0-9]+/', '-', $newCategoryName), '-'));
            $pdo->prepare("INSERT INTO categorii (name, slug) VALUES (?, ?)")->execute([$newCategoryName, $catSlug]);
            $catId = $pdo->lastInsertId();
        }
        $categoryId = $catId;
    }
    
    $productData['category_id'] = $categoryId;
    $productData['stock_status'] = $input['stock_status'] ?? 'in_stoc';
    $id = importProductAsDraft($productData, $pdo);
    
    echo json_encode([
        'status' => 'success', 'product_id' => $id, 
        'specs_count' => count($productData['specs'] ?? []),
        'found_specs' => array_slice($productData['specs'] ?? [], 0, 3)
    ]);
}
