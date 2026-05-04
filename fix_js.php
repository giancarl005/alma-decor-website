<?php
$file = 'c:/laragon/www/Alma Decor Website/alma-decor/dist/assets/index-Tj1hNgvA.js';
if (!file_exists($file)) die("Fișierul nu există!");

$content = file_get_contents($file);

// Inlocuim link-ul catre magazin cu radacina site-ului
// Incercam mai multe variante de scriere in JS-ul compilat
$content = str_replace('"/magazin"', '"/Alma%20Decor%20Website/"', $content);
$content = str_replace('"/magazin/"', '"/Alma%20Decor%20Website/"', $content);
$content = str_replace("'/magazin'", "'/Alma%20Decor%20Website/'", $content);

file_put_contents($file, $content);
echo "JS Reparat cu succes!";
