<?php
$file = 'c:/laragon/www/Alma Decor Website/alma-decor/dist/assets/index-Tj1hNgvA.js';
if (!file_exists($file)) die("Fișierul nu există!");

$content = file_get_contents($file);

// Eliminăm eventualele caractere de control (BOM) adăugate de Windows
$content = str_replace("\xEF\xBB\xBF", '', $content);

// Ne asigurăm că link-ul este cel corect
$content = str_replace('"/magazin"', '"/Alma%20Decor%20Website/"', $content);

file_put_contents($file, $content);
echo "Encoding reparat și link actualizat!";
