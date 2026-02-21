import React from 'react';

const KebijakanPrivasi = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
          Kebijakan Privasi
        </h1>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Kami menghargai privasi Anda dan berkomitmen untuk melindungi
          informasi pribadi yang Anda berikan saat menggunakan layanan kami.
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Informasi yang dikumpulkan hanya digunakan untuk keperluan transaksi
          dan peningkatan layanan. Kami tidak akan membagikan informasi Anda
          kepada pihak ketiga tanpa persetujuan.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Dengan menggunakan layanan kami, Anda menyetujui pengumpulan dan
          penggunaan informasi sesuai dengan kebijakan ini.
        </p>
      </div>
    </section>
  );
};

export default KebijakanPrivasi;
