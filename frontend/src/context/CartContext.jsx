// Import server URL dan axios untuk melakukan request HTTP
import { server } from '@/main';
import axios from 'axios';

// Import Cookies untuk mengambil token autentikasi dari cookies
import Cookies from 'js-cookie';

// Import React untuk membuat context dan state management
import React, { createContext, useContext, useEffect, useState } from 'react';

// Import toast untuk menampilkan notifikasi di UI
import toast from 'react-hot-toast';

import { UserData } from '@/context/UserContext';

// Membuat konteks CartContext untuk mengelola data keranjang
const CartContext = createContext()

// Membuat provider untuk CartContext yang akan membungkus komponen lain
export const CartProvider = ({children}) => {
  
// Mendapatkan status login
  const { isAuth } = UserData();

  // Mendeklarasikan state untuk loading, total item, sub total, dan cart
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [cart, setCart] = useState([]);

  // Fungsi untuk mengambil data keranjang dari server
  async function fetchCart() {
    try {
      const token = Cookies.get("token"); // ambil token terbaru
      const {data} = await axios.get(`${server}/api/cart/all`, {
        headers: {
          token // Kirim token untuk autentikasi
        },
      });
  
      // Set data keranjang, total item, dan sub total ke dalam state
      setCart(data.cart);
      setTotalItem(data.cart.length);
      setSubTotal(data.subTotal);
    } catch (error) {
      console.log(error); // Menangani error jika request gagal
    }
  }

  // Fungsi untuk menambahkan produk ke dalam keranjang
  async function addToCart(product) {
    try {
      const token = Cookies.get("token"); // ambil token terbaru
      const {data} = await axios.post(`${server}/api/cart/add`, 
      { product }, {
        headers: {
          token // Kirim token untuk autentikasi
        }
      });

      // Tampilkan notifikasi sukses jika berhasil menambahkan produk
      toast.success(data.message);

      // Refresh data keranjang setelah produk ditambahkan
      fetchCart();
    } catch (error) {
      // Tampilkan notifikasi error jika ada kesalahan
      toast.error(error.response.data.message);
    }
  }

// Fungsi untuk mengupdate produk didalam keranjang
  async function updateCart (action, id) {
    try {
      const token = Cookies.get("token");
      const {data} = await axios.post(`${server}/api/cart/update?action=${action}`,
      {id}, {
        headers: {
          token,
        },
      })
      fetchCart();
    } catch (error){
       // Tampilkan notifikasi error jika ada kesalahan
       toast.error(error.response.data.message);
    }
  }  

// Fungsi untuk menghapus produk didalam keranjang
  async function removeFromCart(id) {
    try {
      const token = Cookies.get("token");
      const {data} = await axios.get(`${server}/api/cart/remove/${id}`, 
      {
        headers: {
          token,
        },
      });

      toast.success(data.message)
      fetchCart()
    } catch (error){
      // Tampilkan notifikasi error jika ada kesalahan
      toast.error(error.response.data.message);
    }
  }

  // Mengambil data keranjang saat komponen pertama kali dimuat
  useEffect(() => {
    if (isAuth) {
      fetchCart(); // fetchCart kalau sudah login
    }
  }, [isAuth]);
  

  return (
    // Membungkus komponen lain dengan CartContext.Provider agar bisa mengakses state keranjang
    <CartContext.Provider value={{cart, totalItem, subTotal, setTotalItem, fetchCart, addToCart, updateCart, removeFromCart }}>
      {children} {/* Menyediakan akses data keranjang kepada komponen anak */}
    </CartContext.Provider>
  )
}

// Hook untuk mengakses CartContext
export const CartData = () => useContext(CartContext);
