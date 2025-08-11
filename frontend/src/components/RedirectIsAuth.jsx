// Import hook useEffect dari React untuk menjalankan efek samping
import { useEffect } from "react";

// Import useNavigate dari react-router-dom untuk navigasi halaman
import { useNavigate } from "react-router-dom";

// Import UserData context untuk mengambil status autentikasi user
import { UserData } from "@/context/UserContext";

// Membuat komponen RedirectIfAuth untuk mengarahkan pengguna jika sudah terautentikasi
const RedirectIfAuth = ({ children }) => {

  // Mengambil status autentikasi user dari UserContext
  const { isAuth } = UserData();

  // Menginisialisasi fungsi navigate untuk berpindah halaman
  const navigate = useNavigate();

  // useEffect untuk mengecek jika user sudah terautentikasi, arahkan ke halaman utama
  useEffect(() => {
    if (isAuth) {
      navigate("/", { replace: true }); // Navigasi ke halaman utama dan ganti history
    }
  }, [isAuth, navigate]); // Efek berjalan jika isAuth atau navigate berubah

  // Jika user belum terautentikasi, tampilkan children (konten di dalam komponen)
  return !isAuth ? children : null;
};

// Export komponen RedirectIfAuth agar bisa digunakan di komponen lain
export default RedirectIfAuth;
