import { ProductData } from '@/context/ProductContext'
import React, { useState } from 'react'
import Loading from '../Loading'
import ProductCard from '../ProductCard'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { categories, server } from '@/main'
import toast from 'react-hot-toast'
import axios from 'axios'
import Cookies from 'js-cookie'
import { UserData } from '@/context/UserContext';

const HomePage = () => {
  const { products, page, setPage, fetchProducts, loading, totalPages } = ProductData()
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false)
  const { user } = UserData();
  const [searchKeyword, setSearchKeyword] = useState("");


  const [formData, setFormData] = useState({
    title: "",
    about: "",
    category: "",
    price: "",
    stock: "",
    images: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = e => {
    setFormData((prev) => ({ ...prev, images: e.target.files }))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      about: "",
      category: "",
      price: "",
      stock: "",
      images: null,
    })
  }

const submitHandler = async (e) => {
  e.preventDefault();

  try {
    const config = {
      headers: {
        token: Cookies.get("token"),
      },
    };

    let res;

    if (editMode && editId) {
      
      // Jika gambar baru dipilih, pakai FormData
      if (formData.images && formData.images.length > 0) {
        const myForm = new FormData();
        myForm.append("title", formData.title);
        myForm.append("about", formData.about);
        myForm.append("category", formData.category);
        myForm.append("price", formData.price);
        myForm.append("stock", formData.stock);
        for (let i = 0; i < formData.images.length; i++) {
          myForm.append("files", formData.images[i]);
        }

        config.headers["Content-Type"] = "multipart/form-data";
        res = await axios.put(`${server}/api/product/${editId}`, myForm, config);
      } else {
        // Jika tidak pilih gambar baru, kirim JSON biasa
        res = await axios.put(
          `${server}/api/product/${editId}`,
          {
            title: formData.title,
            about: formData.about,
            category: formData.category,
            price: formData.price,
            stock: formData.stock,
          },
          config
        );
      }
    } else {
      // TAMBAH PRODUK BARU
      if (!formData.images || formData.images.length === 0) {
        toast.error('Silahkan Pilih Gambar');
        return;
      }

      const myForm = new FormData();
      myForm.append("title", formData.title);
      myForm.append("about", formData.about);
      myForm.append("category", formData.category);
      myForm.append("price", formData.price);
      myForm.append("stock", formData.stock);
      for (let i = 0; i < formData.images.length; i++) {
        myForm.append("files", formData.images[i]);
      }

      config.headers["Content-Type"] = "multipart/form-data";
      res = await axios.post(`${server}/api/product/new`, myForm, config);
    }

    toast.success("Produk berhasil diubah");
    setOpen(false);
    setEditMode(false);
    setEditId(null);
    resetForm();
    fetchProducts();
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Gagal menyimpan produk");
  }
};


  const editProduct = (product) => {
    setFormData({
      title: product.title,
      about: product.about,
      category: product.category,
      price: product.price,
      stock: product.stock,
      images: null,
    })
    setEditMode(true)
    setEditId(product._id)
    setOpen(true)
  }

  const deleteProduct = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/api/product/${id}`, {
        headers: { token: Cookies.get("token") },
      })
      toast.success(data.message)
      fetchProducts()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Gagal menghapus produk")
    }
  }

  const nextPage = () => setPage(page + 1)
  const prevPage = () => setPage(page - 1)

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>Semua Produk</h2>
        
        {user?.role === "admin" && (
          <Button
            onClick={() => {
              setOpen(true)
              setEditMode(false)
              resetForm()
            }}
            className='bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-6 py-2'
          >
            Tambahkan Produk
          </Button>
        )}
      </div>

      {/* Form Tambah/Edit Produk */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild />
        <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-700">
              {editMode ? "Edit Produk" : "Tambah Produk Baru"}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Lengkapi informasi produk dengan benar
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitHandler} className="space-y-4 mt-4 w-[90%] max-w-md mx-auto">
            <Input name="title" placeholder="Nama Produk" value={formData.title} onChange={handleChange} required />
            <Input name="about" placeholder="Deskripsi Produk" value={formData.about} onChange={handleChange} required />
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <Input name="price" placeholder="Harga Produk" value={formData.price} onChange={handleChange} required />
            <Input name="stock" placeholder="Stok Produk" value={formData.stock} onChange={handleChange} required />
            <div className="flex flex-col gap-2">
              <label htmlFor="images" className="text-sm font-medium">Upload Gambar</label>
              <Input
                id="images"
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                required={!editMode}
              />
            </div>
            <Button type='submit' className='w-full'>
              {editMode ? "Simpan Perubahan" : "Tambahkan Produk"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tampilkan Produk */}
      {loading ? (
        <Loading />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {products && products.length > 0 ? (
            products.map((e) => (
              <ProductCard
                product={e}
                key={e._id}
                latest={"no"}
                onEdit={user?.role === "admin" ? editProduct : null}
                onDelete={user?.role === "admin" ? deleteProduct : null}
              />
            ))
          ) : (
            <p>Belum ada produk</p>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 mb-6">
        <Button variant="outline" disabled={page === 1} onClick={prevPage}>Kembali</Button>
        <span className="text-center text-sm font-medium text-gray-600">
          Halaman {page} dari {totalPages}
        </span>
        <Button variant="outline" disabled={page === totalPages} onClick={nextPage}>Selanjutnya</Button>
      </div>
    </div>
  )
}

export default HomePage
