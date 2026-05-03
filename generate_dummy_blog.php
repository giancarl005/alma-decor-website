<?php
require_once 'app/config.php';

try {
    // 1. Insert Author 'LauraDusca'
    $stmt = $pdo->prepare("INSERT IGNORE INTO blog_authors (name, image, description, is_verified, stat_1_label, stat_1_value, stat_2_label, stat_2_value, stat_3_label, stat_3_value) VALUES (:name, :image, :description, :is_verified, :s1l, :s1v, :s2l, :s2v, :s3l, :s3v)");
    $stmt->execute([
        'name' => 'LauraDusca',
        'image' => '/uploads/laura.jpg', // Dummy URL or external, let's use a nice Unsplash portrait
        'description' => 'Specialist în design interior și arhitectură de interior, pasionată de spații luminoase, texturi naturale și soluții inovatoare.',
        'is_verified' => 1,
        's1l' => 'EXPERIENȚĂ',
        's1v' => '10+ Ani',
        's2l' => 'PROIECTE',
        's2v' => '300+ Finalizate',
        's3l' => 'STIL',
        's3v' => 'Modern Minimalist'
    ]);

    // 2. Articles Data
    $articles = [
        [
            'title' => 'Cum să-ți transformi livingul într-un spațiu modern',
            'slug' => 'cum-sa-transformi-livingul-' . time(), // unique
            'excerpt' => 'Află care sunt pașii esențiali pentru a aduce o notă modernă și elegantă în livingul tău, folosind culori neutre și decorațiuni minimaliste Alma Decor.',
            'content' => '
<h2>Alegerea Paletei de Culori</h2>
<p>Culorile neutre reprezintă fundamentul oricărui design interior cu influențe moderne. În 2026, amestecurile de bejuri calde cu griuri arhitecturale domină scenele de design. Este important să pui accent pe un perete principal.</p>
<p>Utilizarea unor nuanțe precum <strong>greige</strong> (combinația supremă de gri și bej) poate oferi căldură fără a încărca vizual încăperea.</p>

<h3>Importanța luminii naturale și artificiale</h3>
<p>Lumina joacă un rol esențial. Pentru un living modern, încearcă să eliberezi ferestrele de draperii grele. La nivel de iluminat artificial, profilele LED ascunse în spatele panourilor decorative sunt un <span style="font-style: italic;">must-have</span> absolut.</p>

<h2>Integrarea Panourilor Decorative</h2>
<p>Dacă îți dorești acel efect spectaculos, adaugă textură! Un perete plat poate prinde viață imediat dacă aplici lambriuri sau profile decorative premium din poliuretan. Ele nu doar că adaugă profunzime, dar ajută și la acustica spațiului.</p>
',
            'featured_image' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
            'author' => 'LauraDusca'
        ],
        [
            'title' => 'Cele mai bune materiale pentru profile decorative',
            'slug' => 'cele-mai-bune-materiale-profile-' . time(),
            'excerpt' => 'Descoperă avantajele și dezavantajele diverselor materiale folosite la panourile și profilele decorative, și de ce poliuretanul de înaltă densitate este preferatul specialiștilor.',
            'content' => '
<h2>Poliuretan (HDPS) vs. Polistiren Extrudat</h2>
<p>Alegerea materialului dictează direct rezistența în timp a proiectului tău de amenajare. Pe de o parte avem polistirenul, care este foarte ieftin, dar pe de altă parte avem <strong>poliuretanul de înaltă densitate</strong> care oferă detalii extrem de clare și o duritate la șocuri mult superioară.</p>
<p>Dacă vei monta plinta de pardoseală dintr-un material fragil, la primul contact cu aspiratorul, va fi compromisă.</p>

<h3>Rezistența la umiditate (Băi și Bucătării)</h3>
<p>Atunci când amenajezi o baie, umezeala este inamicul numărul unu. Lambriurile moderne din materiale compozite sunt complet rezistente la apă, ceea ce le face ideale pentru a înlocui clasica faianță, aducând un aer luxos, asemănător hotelurilor boutique.</p>

<h2>Ușurința în montaj</h2>
<p>Un alt criteriu major este montajul. Profilele premium necesită doar adezivi speciali (cum ar fi Mardom Fix Pro) și un minim de unelte pentru tăierea la 45 de grade. Nu necesită șuruburi, făcând instalarea curată și rapidă chiar și pentru pasionații de DIY.</p>
',
            'featured_image' => 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200',
            'author' => 'LauraDusca'
        ],
        [
            'title' => 'Top 5 tendințe în amenajări interioare (Ediția 2026)',
            'slug' => 'top-5-tendinte-amenajari-2026-' . time(),
            'excerpt' => 'Sustenabilitatea, materialele naturale, marginile curbate și integrarea profilaturilor ample sunt pilonii de bază ai designului în acest an. Află cum să le integrezi în locuința ta.',
            'content' => '
<h2>1. Sustenabilitatea și Materialele Eco-Friendly</h2>
<p>Designul contemporan nu mai este doar despre estetică, ci și despre impactul asupra mediului. Consumatorii aleg produse certificate care nu degajă substanțe toxice (fără VOC) și care folosesc materiale reciclate.</p>

<h2>2. Formele Organice și Curbe Fine</h2>
<p>Mobila pătrățoasă cu margini ascuțite pierde teren în fața canapelelor curbate, a covoarelor asimetrice rotunjite și a arcadelor decorative. Aceste forme induc o senzație de calm, relaxare și conexiune cu natura.</p>
<p>La nivel de profile, plintele flexibile care se mulează pe pereții rotunzi sunt extrem de căutate.</p>

<h2>3. Spațiile Hibride</h2>
<p>Pentru că munca de acasă a devenit o constantă, integrarea unui colț de birou armonios în living este esențială. Acest lucru se face delimitând vizual zona prin utilizarea culorilor contrastante sau prin montarea panourilor riflate care funcționează ca un separator de camere transparent.</p>

<h2>4. Integrarea Profilaturilor Ample</h2>
<p>Decorul de tavan cu cornișe supradimensionate sau rozete centrale revine în forță, chiar și în apartamentele mici. Aceste detalii, numite adesea "new classic", oferă acel sentiment opulent.</p>
',
            'featured_image' => 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200',
            'author' => 'LauraDusca'
        ]
    ];

    // 3. Insert into articole_blog
    $stmt = $pdo->prepare("INSERT INTO articole_blog (title, slug, excerpt, content, featured_image, author, is_published, created_at) VALUES (:title, :slug, :excerpt, :content, :featured_image, :author, 1, NOW())");

    foreach ($articles as $art) {
        $stmt->execute([
            'title' => $art['title'],
            'slug' => $art['slug'],
            'excerpt' => $art['excerpt'],
            'content' => $art['content'],
            'featured_image' => $art['featured_image'],
            'author' => $art['author']
        ]);
    }

    echo "Success";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
