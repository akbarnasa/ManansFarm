import React from 'react';

const HubungiKami = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
          Hubungi Kami
        </h1>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Jika Anda memiliki pertanyaan, saran, atau ingin bekerja sama,
          jangan ragu untuk menghubungi kami melalui informasi berikut:
        </p>

        <ul className="text-gray-700 mb-6 space-y-2">
          <li>
            <strong>Email:</strong> manansfarm@gmail.com
          </li>
          <li>
            <strong>Telepon:</strong> +62 812-3456-7891
          </li>
          <li>
            <strong>Alamat:</strong> Jl. Cipanyi, Tenjolaya, Kec. Pasirjambu,
            Kabupaten Bandung, Jawa Barat 40972
          </li>
        </ul>

        <p className="text-gray-700 leading-relaxed">
          Kami akan berusaha merespons pesan Anda secepat mungkin pada hari kerja.
        </p>
      </div>
    </section>
  );
};

export default HubungiKami;
