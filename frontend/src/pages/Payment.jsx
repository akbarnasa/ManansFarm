import { CartData } from '@/context/CartContext';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
export const server = "http://localhost:5000";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';


const Payment = () => {
  const { cart, subTotal } = CartData();
  const [address, setAddress] = useState(null);
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Ambil email dari token
  const token = Cookies.get("token");
  let email = "";
  if (token) {
    const decoded = jwtDecode(token);
    email = decoded.email || "";
    console.log("Email dari token:", email);
  }

  const fetchAddress = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/address/${id}`, {
        headers: {
          token: Cookies.get("token")
        }
      });
      console.log("Address Data:", data);
      setAddress(data);
    } catch (error) {
      console.error("Fetch address error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", import.meta.env.MIDTRANS_CLIENT_KEY); // atau langsung pakai string key
    script.async = true;
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, [id]);


  const paymentHandler = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post(`${server}/api/order/new/online`, {
        method,
        namaDepan: address.namaDepan,
        namaBelakang: address.namaBelakang,
        address: address.address,
        kodePos: address.kodePos,
        phone: address.phone,
      }, {
        headers: {
          token: Cookies.get("token"),
        },
      });
  
      // Panggil Snap popup
      window.snap.pay(data.token, {
        onSuccess: function(result) {
          console.log("Pembayaran sukses", result);
          navigate("/success"); // atau redirect ke halaman sukses kamu
        },
        onPending: function(result) {
          console.log("Menunggu pembayaran", result);
        },
        onError: function(result) {
          console.error("Terjadi error", result);
        },
        onClose: function() {
          console.log("Popup ditutup tanpa menyelesaikan pembayaran");
        }
      });
  
    } catch (error) {
      console.error("Gagal membuat sesi pembayaran:", error.response?.data || error.message);
      toast.error("Gagal membuat sesi pembayaran");
    }
  };
  
  

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className='container mx-auto px-4 py-8'>
          <div className='space-y-8'>

            <h2 className='text-3xl font-bold text-center'>Rincian Pembayaran</h2>

            {/* Produk & Total Harga */}
            <div className='border border-gray-300 p-4 rounded-lg shadow-sm bg-white dark:bg-gray-900 max-w-3xl mx-auto'>
              <h3 className='text-xl font-semibold'>Produk</h3>
              <Separator className='my-2' />

              <div className="space-y-4">
                {cart && cart.map((e, i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <img
                      src={e.product.images[0].url}
                      alt='Product'
                      className='w-24 h-24 object-contain bg-white p-2 mb-4 md:mb-0'
                    />

                    <div className="flex-1 md:ml-4 text-center md:text-left space-y-1">
                      <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>{e.product.title}</h2>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Harga Satuan: <span className='font-medium'>Rp{e.product.price.toLocaleString('id-ID')}</span>
                      </p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Kuantitas: <span className='font-medium'>{e.quantity} item</span>
                      </p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Subtotal: <span className='font-semibold text-green-600 dark:text-green-400'>Rp {(e.product.price * e.quantity).toLocaleString('id-ID')}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-lg font-medium text-center mt-4">
                Total Harga: Rp {subTotal.toLocaleString('id-ID')}
              </div>
            </div>

            {/* Informasi Alamat */}
            {address ? (
              <div className='bg-card p-4 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm space-y-4 max-w-3xl mx-auto'>
                <h3 className='text-lg font-semibold text-center'>Detail Pengiriman</h3>
                <Separator className='my-2' />
                <p><strong>Nama Lengkap: </strong> {address.namaDepan} {address.namaBelakang}</p>
                <p><strong>Alamat Lengkap: </strong>{address.address.alamatLengkap}, Kecamatan: {address.address.kecamatan}, Kabupaten: {address.address.kabupaten}, Provinsi: {address.address.provinsi}, {address.kodePos}</p>
                <p><strong>No HP: </strong> {address.phone}</p>
              </div>
            ) : (
              <p className='text-center text-red-500'>Alamat tidak ditemukan</p>
            )}

            {/* Metode Pembayaran */}
            <div className='w-full md:w-1/2 mx-auto'>
              <h4 className='font-semibold mb-1'>Pilih Metode Pembayaran</h4>
              <select
                value={method}
                onChange={e => setMethod(e.target.value)}
                className='w-full p-2 border rounded-lg bg-card dark:bg-gray-900 dark:text-white'
              >
                <option value="">Metode</option>
                <option value="online">Online</option>
              </select>
            </div>

            {/* Tombol Proses Pembayaran */}
            <div className="flex justify-center mt-4">
              <Button
                className="w-full max-w-sm py-3 px-4 text-base rounded-lg hover:bg-gray-300 text-white hover:text-black"
                onClick={paymentHandler}
                disabled={!method || !address}
              >
                Proses Pembayaran
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
