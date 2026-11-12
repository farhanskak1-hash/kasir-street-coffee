# ☕ BLS Street Coffee - Panduan Navigasi & Kustomisasi Mandiri

Panduan ini dibuat agar Anda dapat dengan mudah melakukan perubahan kecil sendiri (seperti mengganti tulisan di struk, nama menu, harga, nomor rekening, atau warna tampilan) **tanpa perlu memahami pemrograman rumit**.

---

## 🧭 Peta Berkas Proyek (File Map)

Proyek ini memiliki struktur berkas yang sangat sederhana:

| Nama Berkas | Fungsi Utama | Apa Saja yang Diatur di Sini? |
| :--- | :--- | :--- |
| [**`index.html`**](file:///c:/Users/Khusnul/Downloads/Arsip/Kasir%20Street%20Cofee/index.html) | Struktur Tampilan | Teks judul website, tombol, jendela pop-up (modal), dan susunan tata letak. |
| [**`data.js`**](file:///c:/Users/Khusnul/Downloads/Arsip/Kasir%20Street%20Cofee/data.js) | Data Menu Bawaan | Daftar kopi, minuman segar, cemilan awal, harga bawaan, dan kategori. |
| [**`app.js`**](file:///c:/Users/Khusnul/Downloads/Arsip/Kasir%20Street%20Cofee/app.js) | Logika Aplikasi | Perhitungan harga, format pesan WhatsApp, kalkulator kembalian, dan cetak struk. |
| [**`style.css`**](file:///c:/Users/Khusnul/Downloads/Arsip/Kasir%20Street%20Cofee/style.css) | Desain & Warna | Warna tema (amber/kopi), ukuran tulisan, dan format lebar printer struk thermal (58mm). |
| [**`PANDUAN_KASIR.md`**](file:///c:/Users/Khusnul/Downloads/Arsip/Kasir%20Street%20Cofee/PANDUAN_KASIR.md) | Petunjuk Operasional | Panduan penggunaan kasir harian untuk barista / kasir di booth. |

---

## ⚡ Cara Termudah: Ubah Langsung dari Layar (Tanpa Buka Kode!)

Sebagian besar perubahan umum sudah dapat diubah langsung melalui **Panel Admin** di browser:

1. Buka website di browser (**`http://localhost:3000`** atau buka berkas `index.html`).
2. Klik tombol **"Panel Admin"** di pojok kanan atas.
3. Masukkan PIN bawaan: **`1234`** lalu klik **OK**.
4. Di sini Anda bisa:
   - **Ganti Tulisan Struk & Alamat**: Pilih tab **"Profil Toko & Struk"** lalu klik *Simpan*.
   - **Ganti Menu & Harga**: Pilih tab **"Daftar Menu & Harga"** lalu klik tombol *Edit* atau *+ Tambah Menu Baru*.
   - **Ganti Rekening Bank & QRIS**: Pilih tab **"Metode Bayar & QRIS"**.
   - **Ganti PIN Admin**: Pilih tab **"PIN & Cadangan Data"**.

---

## 🛠️ Panduan Mengubah Kode Sumber Secara Manual (Langkah demi Langkah)

Jika Anda ingin mengubah nilai bawaan permanen (*default*) langsung dari dalam file kode:

---

### 1. Mengubah Tulisan di Struk Thermal (Nama Toko, Alamat, Pesan Footer)

Buka berkas [**`app.js`**](file:///c:/Users/Khusnul/Downloads/Arsip/Kasir%20Street%20Cofee/app.js), cari bagian **`DEFAULT_STORE_PROFILE`** (sekitar baris 35):

```javascript
const DEFAULT_STORE_PROFILE = {
  name: 'BLS STREET COFFEE',                      // <-- Ubah nama toko di sini
  sub: 'Outlet Kopi Tepi Jalan',                  // <-- Ubah sub-judul di sini
  address: 'Jln. Raya Utama No. 88 (Depan Halte)',// <-- Ubah alamat booth Anda
  wa: '081234567890',                             // <-- Nomor WhatsApp kasir
  ig: '@bls.streetcoffee',                        // <-- Akun Instagram Anda
  footerMsg: 'Terima Kasih Sudah Ngopi di BLS!\nNikmati Kopi Jalanan Rasa Bintang Lima.' // <-- Pesan penutup struk
};
```

---

### 2. Mengubah Format Pesan Nota yang Dikirim ke WhatsApp

Saat kasir mengeklik tombol **"Kirim ke WhatsApp"**, teks otomatis disusun di [**`app.js`**](file:///c:/Users/Khusnul/Downloads/Arsip/Kasir%20Street%20Cofee/app.js) pada fungsi **`shareReceiptToWhatsApp()`** (sekitar baris 870):

```javascript
let text = `*${storeProfile.name} - STRUK RESMI*\n`;
text += `${storeProfile.sub}\n`;
text += `${storeProfile.address}\n`;
text += `--------------------------------\n`;
// ... rincian item ...
text += `Terima kasih sudah ngopi di BLS Street Coffee! ☕`; // <-- Ubah kalimat salam penutup di sini
```

---

### 3. Mengubah Menu dan Harga Awal Bawaan

Buka berkas [**`data.js`**](file:///c:/Users/Khusnul/Downloads/Arsip/Kasir%20Street%20Cofee/data.js). Anda akan melihat daftar menu di dalam variabel **`INITIAL_MENU`**:

```javascript
{
  id: "ks-01",
  name: "Kopi Susu Gula Aren",        // <-- Nama Menu
  category: "kopi-susu",              // <-- Kategori: "kopi-susu", "kopi-hitam", "non-coffee", "tea-refreshment", "cemilan"
  price: 10000,                       // <-- Harga dalam Rupiah (tanpa titik)
  badge: "Best Seller",               // <-- Label promo kecil (kosongkan "" jika tidak pakai)
  desc: "Espresso robusta, susu segar, dan gula aren asli", // <-- Deskripsi singkat
  image: "https://images.unsplash.com/...", // <-- Tautan foto
  isAvailable: true,                  // <-- true jika ada, false jika habis
  options: {
    temperature: ["Ice", "Hot"],      // <-- Pilihan suhu
    sugar: ["Normal", "Less Sugar", "No Sugar"] // <-- Pilihan level gula
  }
}
```

> **Tips:** Untuk menambah menu baru, cukup salin satu blok `{ ... }` di atas, lalu ubah `id`, `name`, dan `price`-nya.

---

### 4. Mengubah Rekening Bank & Identitas QRIS Bawaan

Buka berkas [**`app.js`**](file:///c:/Users/Khusnul/Downloads/Arsip/Kasir%20Street%20Cofee/app.js), cari bagian **`DEFAULT_PAYMENT_SETTINGS`** (sekitar baris 50):

```javascript
const DEFAULT_PAYMENT_SETTINGS = {
  bankName: 'BCA',                                     // <-- Nama Bank
  bankNumber: '872-049-1122',                          // <-- Nomor Rekening Bank
  bankOwner: 'BLS Street Coffee',                      // <-- Nama Pemilik Rekening
  walletNumber: '0812-3456-7890',                      // <-- Nomor HP GoPay/DANA/OVO
  qrisNmid: 'ID1029384756102 - BLS STREET COFFEE'      // <-- Teks NMID QRIS
};
```

---

### 5. Mengubah Warna Tema / Tampilan Website

Buka berkas [**`style.css`**](file:///c:/Users/Khusnul/Downloads/Arsip/Kasir%20Street%20Cofee/style.css), cari bagian paling atas **`:root`** (baris 8 - 25):

```css
:root {
  /* Warna Dasar Aplikasi */
  --bg-app: #12100E;              /* Warna latar belakang paling gelap */
  --bg-surface: #1C1917;          /* Warna header dan panel kasir */
  --bg-card: #24201C;             /* Warna kotak kartu menu */

  /* Warna Khas Kopi / Aksen Brand */
  --brand-primary: #D97706;       /* Warna tombol utama (Amber Coffee) */
  --brand-accent: #F59E0B;        /* Warna teks harga (Golden Crema) */

  /* Warna Status */
  --status-success: #10B981;      /* Warna hijau untuk uang pas / sukses */
  --status-danger: #EF4444;       /* Warna merah untuk stok habis / kurang */
}
```

---

### 6. Mengubah Lebar Kertas Printer Thermal Struk (58mm vs 80mm)

Secara bawaan aplikasi ini diatur untuk printer struk standar jalanan ukuran **58mm**. Jika Anda menggunakan printer kasir yang lebih lebar (**80mm**), buka berkas [**`style.css`**](file:///c:/Users/Khusnul/Downloads/Arsip/Kasir%20Street%20Cofee/style.css), cari bagian `@media print` (sekitar baris 1995):

```css
.receipt-paper {
  width: 58mm !important; /* Ganti menjadi 80mm jika memakai printer 80mm */
}

@page {
  size: 58mm auto;        /* Ganti menjadi 80mm auto */
  margin: 0;
}
```

---

### 7. Mengubah PIN Admin Bawaan

Buka berkas [**`app.js`**](file:///c:/Users/Khusnul/Downloads/Arsip/Kasir%20Street%20Cofee/app.js) baris 64:

```javascript
let adminPin = '1234'; // <-- Ganti 1234 dengan 4-6 digit angka yang Anda inginkan
```

---

## 🚀 Cara Menjalankan Website:

### Opsi A: Tanpa Install Apapun (Cukup Klik Ganda)
Cukup buka berkas [**`index.html`**](file:///c:/Users/Khusnul/Downloads/Arsip/Kasir%20Street%20Cofee/index.html) menggunakan Google Chrome, Microsoft Edge, Mozilla Firefox, atau Safari.

### Opsi B: Menggunakan Local Server (Sangat Disarankan)
Buka terminal (PowerShell / Command Prompt) di folder ini, lalu ketik:
```bash
python -m http.server 3000
```
Buka browser dan kunjungi alamat:
👉 **`http://localhost:3000`**

---

## 💡 Tips & Trik Penting:
1. **Data Disimpan Secara Otomatis di Browser**: Semua riwayat transaksi dan penambahan menu tersimpan di *LocalStorage* browser Anda. Datanya tidak akan hilang saat komputer dimatikan atau halaman dimuat ulang (*refresh*).
2. **Pencadangan Rutin (*Backup*)**: Buka **Panel Admin** > Tab **"PIN & Cadangan Data"** > Klik **"Download File Cadangan (JSON)"**. Simpan berkas ini di flashdisk/Google Drive setiap minggu sebagai arsip aman.
3. **Pintasan Cepat (*Shortcuts*)**:
   - Tekan **`/`** untuk langsung mengetik pencarian menu.
   - Tekan **`F4`** atau **`Spasi`** untuk membuka pop-up pembayaran kasir.
   - Tekan **`Enter`** untuk menyelesaikan pembayaran uang tunai.
   - Tekan **`Esc`** untuk menutup pop-up.
