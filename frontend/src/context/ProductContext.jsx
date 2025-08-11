// Import React hooks untuk state management dan context
import { createContext, useContext, useEffect, useState } from 'react';

// Import axios untuk melakukan HTTP requests
import axios from 'axios';

// Mengimport server URL dari konfigurasi utama aplikasi
import { server } from '@/main';

// Membuat konteks untuk pengelolaan data produk
const ProductContext = createContext();

// Provider untuk konteks ProductContext
export const ProductProvider = ({ children }) => {
  
  // Mendeklarasikan state untuk produk, produk terbaru, status loading, halaman, dll.
  const [products, setProducts] = useState([]);
  const [newProd, setNewProd] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");  // Untuk pencarian produk
  const [category, setCategory] = useState("");  // Untuk kategori produk
  const [price, setPrice] = useState("");  // Untuk filter berdasarkan harga
  const [categories, setCategories] = useState([]);  // Menyimpan daftar kategori produk

  // Fungsi untuk mengambil data produk dari server
  async function fetchProducts() {
    setLoading(true); // Set loading true saat fetch data
    try {
      // Mengambil data produk dari server dengan parameter pencarian, kategori, harga, dan halaman
      const { data } = await axios.get(`${server}/api/product/all?search=${search}&category=${category}&sortByPrice=${price}&page=${page}`);
      console.log("Fetched product data:", data);

      // Menyimpan data produk dan kategori ke dalam state
      setProducts(data.products);
      setNewProd(data.newProduct || data.products.slice(-4)); // Produk terbaru, jika ada
      setCategories(data.categories);  // Menyimpan kategori produk
      setTotalPages(data.totalPages);  // Menyimpan jumlah halaman
    } catch (error) {
      console.log(error); // Menangani error jika gagal mengambil data
    } finally {
      setLoading(false); // Set loading false setelah fetch selesai
    }
  }

  // Mendeklarasikan state untuk produk detail dan produk terkait
  const [product, setProduct] = useState([]);
  const [relatedProduct, setRelatedProduct] = useState([]);

  // Fungsi untuk mengambil detail produk berdasarkan ID
  async function fetchProduct(id) {
    setLoading(true); // Set loading true saat mengambil detail produk
    try {
      const { data } = await axios.get(`${server}/api/product/${id}`);

      // Menyimpan detail produk dan produk terkait ke dalam state
      setProduct(data.product);
      setRelatedProduct(data.relatedProduct);
      setLoading(false); // Set loading false setelah data diterima
    } catch (error) {
      console.log(error); // Menangani error jika gagal mengambil data produk
      setLoading(false); // Set loading false jika terjadi error
    }
  }

  // useEffect untuk menjalankan fetchProducts setiap kali nilai pencarian, kategori, harga, atau halaman berubah
  useEffect(() => {
    fetchProducts();
  }, [search, category, price, page]);  // Menjalankan fetchProducts saat state ini berubah

  return (
    // Membungkus komponen anak dengan ProductContext.Provider agar dapat mengakses data produk
    <ProductContext.Provider value={{ 
      loading, products, newProd, search, setSearch, categories, 
      category, setCategory, totalPages, price, setPrice, page, setPage, fetchProduct, fetchProducts, product, relatedProduct }}>
      {children} {/* Menyediakan data produk ke komponen anak */}
    </ProductContext.Provider>
  );
};

// Hook untuk mengakses ProductContext
export const ProductData = () => useContext(ProductContext);
