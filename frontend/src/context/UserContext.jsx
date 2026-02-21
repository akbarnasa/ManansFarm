// Mengimpor hooks dan pustaka yang dibutuhkan
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast'; // Untuk menampilkan notifikasi toast
import React from 'react';
import axios from "axios"; // Untuk melakukan HTTP requests
import { server } from "@/main"; // URL server untuk API
import Cookies from "js-cookie"; // Untuk menangani cookies


// Membuat konteks untuk data pengguna
const UserContext = createContext();

// Provider untuk mengelola state pengguna
export const UserProvider = ({ children }) => {
  // Mendeklarasikan state untuk menyimpan data pengguna, status loading, dan status autentikasi
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  /* LOGIN */
  // Fungsi untuk login pengguna dengan email
  async function loginUser(email, navigate) {
    setBtnLoading(true); // Set loading pada button
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email });
      toast.success(data.message);
      localStorage.setItem("email", email);
      navigate("/verify");
      setBtnLoading(false);
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error?.response?.data?.message || "Terjadi kesalahan saat login");
      setBtnLoading(false);
    }
    
  }

  /* LOGOUT */
  // Fungsi untuk logout pengguna
  function logoutUser(navigate) {
    setUser([]); // Mengosongkan data pengguna
    setIsAuth(false); // Set status autentikasi menjadi false
    Cookies.set("token", null); // Menghapus token dari cookies
    Cookies.remove("token"); // Menghapus cookie "token"
    localStorage.clear(); // Menghapus semua data di localStorage
    toast.success("Berhasil keluar"); // Menampilkan pesan sukses
    navigate("/login"); // Mengarahkan ke halaman login
  }

  /* VERIFIKASI */
  // Fungsi untuk melakukan verifikasi pengguna dengan OTP
  async function verifyUser(otp, navigate) {
    setBtnLoading(true);
    const email = localStorage.getItem("email");
  
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, { email, otp });
  
      toast.success(data.message);
      localStorage.clear();
  
      Cookies.set("token", data.token, {
        expires: 15,
        secure: true,
        path: "/",
      });
  
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
  
      // ✅ Arahkan user berdasarkan peran
      const role = data.user.role;
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
  
    } catch (error) {
      toast.error(error.response?.data?.message || "Verifikasi gagal");
      setBtnLoading(false);
    }
  }
  
  
  
  
  // Fungsi untuk mengambil data pengguna yang sudah terautentikasi
  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: Cookies.get("token"), // Mengirim token yang ada di cookies
        },
      });
      setIsAuth(true); // Set status autentikasi menjadi true
      setUser(data); // Menyimpan data pengguna
      setLoading(false); // Set loading menjadi false setelah data diterima
    } catch (error) {
      console.log("Gagal mengambil data pengguna", error.message); // Menangani error jika gagal mengambil data pengguna
      setIsAuth(false); // Set status autentikasi menjadi false jika gagal
      setLoading(false); // Set loading menjadi false
    }
  }

  // Mengambil data pengguna saat aplikasi pertama kali dimuat
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    // Menyediakan konteks untuk komponen anak agar bisa mengakses data pengguna
    <UserContext.Provider value={{ 
      user, 
      loading, 
      btnLoading, 
      isAuth, 
      loginUser, 
      verifyUser, 
      logoutUser
    }}>
      {children} 
      <Toaster /> {/* Komponen untuk menampilkan notifikasi toast */}
    </UserContext.Provider>
  );
};

// Hook untuk mengakses data pengguna dari context
export const UserData = () => useContext(UserContext);
