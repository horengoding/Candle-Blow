# Candle Blow

Kue ulang tahun yang dapat dipasangi lilin dengan cara diklik, kemudian ditiup langsung melalui mikrofon untuk memadamkan apinya. Setelah seluruh lilin padam, aplikasi akan menampilkan confetti dan memutar lagu ulang tahun.

Proyek ini pada awalnya hanya berupa animasi kue berbasis CSS dengan fitur deteksi tiupan melalui mikrofon agar interaksinya tidak sekadar klik, kemudian ditambahkan efek confetti dan lagu.

## Menjalankan proyek

Fitur mikrofon (`getUserMedia`) tidak akan berfungsi apabila file dibuka langsung melalui `file://`, sehingga proyek ini perlu dijalankan melalui local server. Contoh:

```bash
npx http-server -p 3000
```

Buka `http://localhost:3000`, izinkan akses mikrofon ketika diminta oleh browser, kemudian klik pada kue untuk mulai menambahkan lilin.

## Cara kerja

Setiap klik pada area kue akan menambahkan satu lilin baru pada titik yang diklik. Ketika pengguna meniup ke arah mikrofon, fungsi `isBlowing()` pada `script.js` akan memeriksa rata-rata volume input mikrofon; apabila terdeteksi tiupan, sebagian lilin akan padam secara acak (tidak seluruhnya sekaligus, agar terasa lebih alami).

Teks pada kartu pesan di atas kue berubah mengikuti kondisi saat itu: belum ada lilin, ada lilin yang masih menyala, atau seluruh lilin telah padam. Ketika lilin terakhir padam, aplikasi akan memutar efek suara terlebih dahulu, dilanjutkan dengan lagu ulang tahun, sambil menampilkan confetti secara terus-menerus di seluruh layar.

## Struktur berkas

- `index.html` — markup halaman: kue, kartu pesan, dan canvas confetti
- `style.css` — seluruh tampilan dan animasi
- `script.js` — logika interaktif: penambahan lilin, deteksi tiupan, serta pemicu confetti dan audio
- `audio/` — berkas suara (`confetti.mp3` untuk efek suara, `namida-surprise-template.mp3` untuk lagu ulang tahun)

## Catatan

Deteksi tiupan hanya memeriksa rata-rata volume mikrofon secara umum, bukan pola napas tertentu. Oleh karena itu, pada lingkungan yang bising (misalnya kipas angin atau suara percakapan keras), lilin dapat padam meskipun tidak ada tiupan.

Sebagian browser memblokir autoplay audio sebelum terjadi interaksi pengguna. Karena klik pada kue sudah terhitung sebagai interaksi, hal ini umumnya tidak menjadi masalah. Namun apabila lagu tidak terdengar sama sekali saat perayaan berlangsung, kemungkinan besar penyebabnya adalah kebijakan tersebut.

Volume audio diatur langsung pada `script.js` melalui `trumpetSound.volume` dan `birthdaySong.volume` (skala 0–1). Nilai tersebut dapat disesuaikan apabila dirasa terlalu keras atau terlalu pelan.

Proyek ini dibangun menggunakan HTML, CSS, dan JavaScript murni tanpa framework maupun proses build. Jenis huruf yang digunakan adalah Baloo 2 dari Google Fonts, dan normalize.css digunakan untuk menyeragamkan gaya default antar browser.

## Sumber

Proyek ini berbasis pada [cake-blow](https://github.com/sherryuser/cake-blow) oleh [sherryuser](https://github.com/sherryuser). Tampilan (`style.css`) telah dimodifikasi dari versi aslinya, sementara struktur HTML dan logika inti pada `script.js` masih mengikuti implementasi asal.
