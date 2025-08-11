import React from 'react';

const SyaratKetentuan = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
          Syarat dan Ketentuan
        </h1>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Dengan mengakses dan menggunakan situs Manan&apos;s Farm, Anda
          menyetujui untuk mematuhi syarat dan ketentuan berikut:
        </p>

        <ul className="text-gray-700 mb-6 space-y-2 list-disc list-inside">
          <li>
            Pengguna wajib memberikan informasi yang benar saat melakukan pemesanan.
          </li>
          <li>
            Pembayaran harus dilakukan sesuai metode yang disediakan.
          </li>
          <li>
            Kami berhak menolak transaksi yang mencurigakan atau tidak sesuai ketentuan.
          </li>
          <li>
            Konten dan layanan dapat berubah sewaktu-waktu tanpa pemberitahuan.
          </li>
        </ul>

        <p className="text-gray-700 leading-relaxed">
          Silakan hubungi kami jika Anda memiliki pertanyaan terkait syarat dan ketentuan ini.
        </p>
      </div>
    </section>
  );
};

export default SyaratKetentuan;
