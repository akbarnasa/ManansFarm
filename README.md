# 🌾 ManansFarm — Aplikasi Penjualan Produk Pertanian Berbasis Website

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Platform](https://img.shields.io/badge/platform-web-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)

> Tugas Akhir Skripsi — Sistem E-Commerce Produk Pertanian Berbasis Website

---

## 📖 Deskripsi

**ManansFarm** adalah aplikasi e-commerce berbasis website yang dirancang untuk memfasilitasi penjualan produk pertanian secara online. Aplikasi ini menghubungkan petani atau penjual produk pertanian dengan konsumen secara langsung melalui platform digital yang mudah digunakan.

Aplikasi ini dikembangkan sebagai **Tugas Akhir Skripsi** dengan tujuan meningkatkan aksesibilitas pasar bagi pelaku usaha pertanian dan mempermudah konsumen dalam mendapatkan produk pertanian segar berkualitas.

---

## ✨ Fitur Utama

- 🛒 **Keranjang Belanja** — Tambah, edit, dan hapus produk dari keranjang
- 💳 **Pembayaran Online** — Integrasi dengan Midtrans Payment Gateway
- 📦 **Manajemen Produk** — CRUD produk pertanian dengan kategori
- 👤 **Autentikasi Pengguna** — Register, login, dan manajemen akun
- 📋 **Riwayat Pesanan** — Tracking status pesanan secara real-time
- 🔐 **Panel Admin** — Manajemen produk, pesanan, dan pengguna
- 📱 **Responsive Design** — Tampilan optimal di semua perangkat

---

## 🛠️ Teknologi yang Digunakan

### Frontend
| Teknologi | Keterangan |
|-----------|------------|
| React.js | Library UI utama |
| Vite | Build tool & dev server |
| Tailwind CSS | Framework CSS utility-first |
| React Router | Client-side routing |

### Backend
| Teknologi | Keterangan |
|-----------|------------|
| Node.js | Runtime JavaScript |
| Express.js | Framework backend |
| MongoDB Atlas | Database NoSQL cloud |
| Mongoose | ODM untuk MongoDB |
| Midtrans | Payment gateway |
| JWT | Autentikasi token |

### Deployment
| Teknologi | Keterangan |
|-----------|------------|
| Vercel | Hosting frontend & backend |

---

## 📁 Struktur Proyek

```
ManansFarm/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── server/
    ├── controller/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── utils/
    ├── index.js
    └── package.json
```

---

## 🚀 Cara Menjalankan Proyek

### Prasyarat
- Node.js >= 18.x
- npm atau yarn
- Akun MongoDB Atlas
- Akun Midtrans (Sandbox untuk development)

### 1. Clone Repository

```bash
git clone https://github.com/username/ManansFarm.git
cd manansfarm
```

### 2. Setup Backend

```bash
cd server
npm install
```

Buat file `.env` di folder `server/`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/manansfarm
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxx
JWT_SECRET=your_jwt_secret
PORT=5000
```

Jalankan server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

---

## 🌐 Demo

> Link demo: "coming soon"

---


## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik (Tugas Akhir Skripsi).  
© 2025 ManansFarm. All rights reserved.
