import React from 'react';

const TentangKami = () => {
  return (
    <section className="bg-gray-50">
      {/* Hero Section */}
      <div className="w-full py-20 flex flex-col items-center text-center bg-gray-100">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Tentang Manan&apos;s Farm
        </h1>
        <p className="text-base md:text-lg text-gray-700">
        Fresh, Organic Harvests. Sustainable Farming. From Our Fields, To Your Table
        </p>
      </div>

      {/* Profil Section */}
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900">
          Profil Perusahaan
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Manan&apos;s Farm adalah platform penjualan hasil pertanian segar,
          organik, dan berkelanjutan langsung dari petani ke konsumen.
          Kami berkomitmen membangun ekosistem pertanian modern yang mendukung
          kesejahteraan petani lokal dan kelestarian lingkungan.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Dengan memanfaatkan teknologi, Manan&apos;s Farm memperpendek rantai
          distribusi agar produk terbaik sampai ke meja makan Anda dengan harga
          yang adil dan transparan.
        </p>
      </div>
    </section>
  );
};

export default TentangKami;
