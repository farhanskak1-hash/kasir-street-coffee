# BLS Street Coffee - Kasir POS & Panel Admin (Outlet Tepi Jalan)

Aplikasi kasir web modern (*Point of Sale*) dan Panel Manajemen Usaha yang dirancang khusus untuk operasional cepat outlet kopi tepi jalan (*street coffee kiosk / booth* ala Nescafe jalanan).

---

## 🔐 1. Panel Admin (Khusus Pemilik Tanpa Koding)

Untuk mempermudah pemilik outlet atau manajer yang **tidak memiliki latar belakang teknis/koding**, kini tersedia tombol **"Panel Admin"** di pojok kanan atas header.

### Akses & Keamanan:
- **PIN Bawaan Awal**: `1234`
- Saat tombol "Panel Admin" ditekan, akan muncul tombol angka (*keypad*) ramah layar sentuh (*touchscreen/tablet*). Masukkan `1-2-3-4` lalu klik **OK**.
- PIN dapat diubah kapan saja melalui menu **"PIN & Cadangan Data"**.

---

## 🛠️ Fitur-Fitur di Dalam Panel Admin:

### 1. ☕ Kelola Menu & Harga Jual:
- **Tambah Menu Baru**: Klik tombol `+ Tambah Menu Baru`.
  - Masukkan Nama Minuman/Makanan.
  - Pilih Kategori (*Kopi Susu, Kopi Hitam, Non-Coffee, Tea & Segar, Cemilan*).
  - Masukkan Harga Jual (Rp).
  - Pilih Label Promo/Badge (misal: *Best Seller, Spesial, Promo, Favorit*).
  - **Pilihan Gambar Siap Pakai (*No Coding*)**: Cukup klik salah satu foto minuman yang sudah disediakan di layar (tersedia foto kopi susu, americano, latte, cokelat, matcha, es teh, roti panggang), atau bisa juga memasukkan URL gambar sendiri.
- **Ubah Harga & Edit Menu**: Klik tombol **Edit** pada baris menu untuk mengganti nama, harga, atau foto.
- **Tandai Stok Habis (*Sold Out*)**: Klik tombol **Tandai Habis** saat bahan baku di booth habis.
- **Hapus Menu**: Menghapus menu yang sudah tidak dijual lagi.

### 2. 🧁 Kelola Extra Topping:
- Tambah topping baru (misal: *Extra Espresso Shot, Boba Brown Sugar, Cincau, Cream Cheese Foam*) beserta harga tambahannya (+Rp 2.000, +Rp 3.000, dll.).

### 3. 🏪 Profil Toko & Pengaturan Struk:
- Ubah Nama Toko / Outlet (misal: *BLS Street Coffee - Cabang Stasiun*).
- Ubah Alamat Lengkap Booth yang dicetak di kertas struk thermal.
- Ubah Nomor WhatsApp Kasir (nota otomatis terhubung ke WhatsApp pembeli).
- Ubah Akun Media Sosial & Pesan Terima Kasih di bagian bawah struk.

### 4. 💳 Rekening Bank & QRIS Kasir:
- Ubah Nama Bank & Nomor Rekening Transfer (BCA, Mandiri, dll.).
- Ubah Nomor E-Wallet Kasir (GoPay, DANA, OVO).
- Ubah ID Merchant / NMID QRIS.

### 5. 📊 Laporan Analisis & Menu Terlaris:
- Pantau **Total Omzet Keseluruhan**, **Total Cup Terjual**, dan **Jumlah Nota Transaksi**.
- **Peringkat 5 Menu Paling Laris (*Top 5 Best Sellers*)** otomatis dihitung dari histori transaksi pembeli.
- Tombol **Unduh Laporan Excel (CSV)** untuk pembukuan bulanan.

### 6. 💾 Cadangan & Pemulihan Data (*Backup & Restore*):
- **Download File Cadangan (JSON)**: Simpan seluruh data menu, harga, pengaturan toko, dan riwayat transaksi ke dalam 1 berkas aman di HP/laptop.
- **Pulihkan Data (Restore)**: Jika Anda berganti HP, tablet, atau laptop kasir baru, cukup unggah berkas cadangan tersebut dan seluruh data menu langsung pulih seketika.

---

## ☕ 2. Operasional Kasir Harian:
1. **Pemesanan Cepat**:
   - Ketuk menu minuman/makanan di sebelah kiri.
   - Pilih Suhu: **Dingin (Ice)** atau **Hangat (Hot)**.
   - Pilih Level Gula: **Normal**, **Less Sugar (50%)**, **No Sugar**.
   - Pilih Extra Topping jika diinginkan.
   - Klik **"Tambahkan ke Pesanan"**.
2. **Pilihan Tipe Pesanan**:
   - Pilih **Bungkus (Takeaway)** atau **Minum Sini**.
3. **Diskon Cepat**:
   - Tombol potongan: 0%, 5%, 10%, atau masukkan nominal diskon manual (Rp).
4. **Pembayaran**:
   - Klik tombol besar **"BAYAR SEKARANG"** (atau tekan tombol `F4` / `Spasi`).
   - Jika **Tunai**: Klik tombol uang pecahan (*Uang Pas, 10k, 20k, 50k, 100k*) dan lihat kembalian otomatis.
   - Jika **QRIS**: Perlihatkan QRIS di layar kepada pelanggan untuk dipindai.
   - Klik **"Selesaikan Transaksi & Cetak Struk"**.
5. **Cetak Struk**:
   - Klik **"Cetak Struk"** untuk printer thermal 58mm / 80mm.
   - Klik **"Kirim ke WhatsApp"** untuk mengirim rincian nota belanja ke nomor WA pelanggan.
   - Klik **"Pesanan Baru"** untuk melayani pelanggan berikutnya.

---

## 🚀 Cara Menjalankan:
Buka aplikasi di browser (Google Chrome / Microsoft Edge / Safari / Firefox):
- Alamat lokal saat ini: **`http://localhost:3000`**
- Atau klik ganda berkas `index.html`.

## ⌨️ Pintasan Keyboard Kasir:
- **`/`** : Langsung fokus ke pencarian menu.
- **`F4`** atau **`Spasi`** : Buka dialog pembayaran (*Checkout*).
- **`Enter`** : Konfirmasi transaksi tunai.
- **`Esc`** : Menutup jendela / modal pop-up yang aktif.
