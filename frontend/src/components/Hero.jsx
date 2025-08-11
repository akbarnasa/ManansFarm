
import React from 'react'
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { UserData } from "@/context/UserContext";



const Hero = () => {
  
  // Inisialisasi fungsi navigate untuk navigasi halaman
  const navigate = useNavigate();
  const { user } = UserData();
  
  // Fungsi untuk scroll ke section berikutnya
  const scrollToNext = () => {
    const nextSection = document.getElementById("next-section");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // Container utama Hero dengan background image dan styling khusus
    <div 
  className="relative min-h-screen bg-cover bg-center pt-[100px]" 
  style={{
    backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url("1170297.jpg")`,
  }}
>
  <div className="flex items-center justify-center h-full text-white">
    <div className="text-center animate-fade-in-up px-4">
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 drop-shadow-lg tracking-wide font-lora">
        SELAMAT DATANG
      </h1>
      <p className="text-sm sm:text-base mb-8 text-gray-300 max-w-md mx-auto font-playfair">
        Temukan berbagai produk pilihan terbaik untuk kebutuhan Anda.
      </p>

      {user?.role !== "admin" && (
      <Button 
        onClick={() => navigate("/products")}
        size="sm" 
        className="bg-green-600 text-white hover:bg-green-700
        transition-all duration-300 shadow-md rounded-md font-bold font-lora"
      >
        Belanja
      </Button>
      )}

    </div>
  </div>
</div>
  )
}

export default Hero
