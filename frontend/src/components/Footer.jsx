// Import icon sosial media dari library lucide-react
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
// Import React untuk membuat komponen
import React from 'react'

// Membuat komponen Footer
const Footer = () => {
  return (
    // Elemen <footer> sebagai container utama footer
    <footer className='w-full'>
        {/* Garis horizontal sebagai pemisah antara konten utama dan footer */}
        <hr className='border border-gray-300 dark:border-gray-700'/>
        
        {/* Container utama untuk isi footer */}
        <div className="container mx-auto px-4 py-6">

            {/* Flex container untuk branding dan navigasi link */}
            <div className="flex flex-col md:flex-row justify-between items-center">

                {/* Bagian branding: nama toko dan deskripsi */}
                <div className="mb-6 flex-col md:flex-row justify-between items-center">
                    <h1 className="text-xl font-bold">Manan's Farm</h1>
                    <p className="text-sm">Fresh, Organic Harvests.
                                            Sustainable Farming.
                                            From Our Fields,
                                            To Your Table.</p>
                </div>

                {/* Bagian navigasi: link-link tambahan */}
                <div className="flex flex-wrap justify-center md:justify-end gap-4">
                    <a href="/tentang-kami" className="text-sm hover:text-underline">Tentang Kami</a>
                    <a href="/hubungi-kami" className="text-sm hover:text-underline">Hubungi Kami</a>
                    <a href="/kebijakan-privasi" className="text-sm hover:text-underline">Kebijakan Privasi</a>
                    <a href="/syarat-dan-ketentuan" className="text-sm hover:text-underline">Syarat dan Ketentuan</a>
                </div>
            </div>
        
            {/* Bagian ikon sosial media */}
            <div className="mt-6 text-center">
                {/* Teks ajakan untuk mengikuti sosial media */}
                <p className="text-sm">Ikuti Kami:</p>

                {/* Icon sosial media dengan efek hover */}
                <div className="flex justify-center gap-4 mt-2">
                    <a href='' className='hover:opacity-75'><Facebook/></a>
                    <a href='' className='hover:opacity-75'><Instagram/></a>
                    <a href='' className='hover:opacity-75'><Twitter/></a>
                    <a href='' className='hover:opacity-75'><Youtube/></a>
                </div>
            </div>

        </div> 
    </footer>
  )
}

export default Footer
