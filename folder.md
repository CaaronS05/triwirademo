# Ringkasan Struktur Folder

Proyek ini adalah website statis berbasis HTML, CSS, dan JavaScript. Struktur utamanya memakai pendekatan modular: halaman utama memuat section terpisah, sedangkan beberapa halaman produk memiliki folder mandiri berisi HTML, CSS, JS, dan section masing-masing.

## Struktur Utama

```text
.
├── index.html
├── assets/
├── css/
├── js/
├── sections/
└── product/
```

## Penjelasan Folder

### `index.html`

File halaman utama website.

### `assets/`

Folder aset visual dan font. Saat ini berisi sekitar 28 file.

```text
assets/
├── fonts/
├── icons/
│   ├── about/
│   ├── contact/
│   ├── coverage/
│   ├── documents/
│   ├── global/
│   ├── home/
│   ├── products/
│   └── services/
└── images/
    ├── about/
    ├── backgrounds/
    ├── coverage/
    ├── home/
    ├── logo/
    ├── products/
    └── services/
```

### `css/`

Folder stylesheet global dan stylesheet bersama. Saat ini berisi sekitar 14 file.

Berisi file dasar seperti:

```text
reset.css
variables.css
global.css
responsive.css
header.css
footer.css
home.css
about.css
products.css
services.css
coverage.css
contact.css
```

Juga berisi stylesheet dasar untuk detail produk:

```text
product-detail*.css
```

### `js/`

Folder JavaScript global. Saat ini berisi sekitar 4 file.

```text
js/
├── include.js
├── language.js
├── main.js
└── navigation.js
```

### `sections/`

Folder section HTML untuk halaman utama.

```text
sections/
├── header.html
├── home.html
├── about.html
├── products.html
├── services.html
├── coverage.html
├── contact.html
└── footer.html
```

### `product/`

Folder halaman dan komponen produk. Saat ini berisi sekitar 95 file.

File halaman produk langsung yang masih tersisa:

```text
product/
├── flooring-natural-stone.html
└── perekat-plaster.html
```

Folder produk mandiri:

```text
product/
├── bata-ringan/
├── flooring-natural-stone/
├── perekat-plaster/
└── semen/
```

## Folder Produk Mandiri

Produk utama memakai struktur mandiri:

```text
product/bata-ringan/
├── index.html
├── css/
├── js/
└── sections/

product/flooring-natural-stone/
├── index.html
├── css/
├── js/
└── sections/

product/perekat-plaster/
├── index.html
├── css/
├── js/
└── sections/

product/semen/
├── index.html
├── css/
├── js/
└── sections/
```

Masing-masing folder produk mandiri umumnya memiliki:

- `index.html` sebagai halaman utama produk.
- `css/page.css` dan/atau `css/stage-*.css` untuk styling.
- `js/page.js` untuk behavior halaman.
- `sections/*.html` untuk bagian halaman seperti hero, about, applications, order, CTA, dan footer.

## Catatan Pola

- Halaman utama memakai `sections/` di root.
- Halaman produk utama memakai folder mandiri di dalam `product/`.
- `bata-ringan` dan `semen` sekarang mengikuti pola `flooring-natural-stone` dan `perekat-plaster`.
- CSS banyak dipisah berdasarkan section atau stage, sehingga perubahan tampilan sebaiknya dicek berdasarkan halaman terkait.
