# Nefi’s Kidney Lab — GitHub Pages

Struktur proyek sudah dipisah dari file HTML tunggal:

- `index.html` — markup halaman
- `assets/css/styles.css` — seluruh CSS
- `assets/js/app.js` — seluruh JavaScript
- `assets/images/` — gambar yang sebelumnya tertanam sebagai Base64/data URI
- `.nojekyll` — memastikan GitHub Pages menyajikan aset secara langsung

## Upload ke GitHub

1. Buat repository baru di GitHub.
2. Upload **seluruh isi folder ini** ke root repository.
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`, lalu simpan.
6. Setelah deployment selesai, buka URL GitHub Pages repository tersebut.

Semua path aset menggunakan path relatif, jadi proyek juga bisa dibuka dari server lokal/static hosting lain.
