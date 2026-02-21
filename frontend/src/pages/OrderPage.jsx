import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { server } from '@/main'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

const OrderPage = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${server}/api/order/${id}`, {
          headers: {
            token: Cookies.get('token'),
          },
        })
        setOrder(data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) {
    return <Loading />
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">
          Tidak ada pesanan dengan ID ini
        </h1>
        <Button onClick={() => navigate('/products')}>Belanja Sekarang</Button>
      </div>
    )
  }

  const statusClass = (() => {
    const s = order.status.trim().toLowerCase()
    if (s.includes('menunggu')) return 'text-yellow-600'
    if (s.includes('dibayar')) return 'text-green-600'
    if (
      s.includes('ditolak') ||
      s.includes('dibatalkan') ||
      s.includes('kedaluwarsa')
    )
      return 'text-red-600'
    return 'text-gray-600'
  })()

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-lg rounded-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-2xl font-bold">Detail Pesanan</CardTitle>
            <Button onClick={() => window.print()}>Cetak Pesanan</Button>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
            <div className="space-y-2 text-sm md:text-base">
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={statusClass}>{order.status}</span>
              </p>
              <p>
                <strong>Total Item:</strong>{' '}
                {order.items.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}
              </p>
              <p>
                <strong>Metode Pembayaran:</strong> {order.method}
              </p>
              <p>
                <strong>Total Harga:</strong>{' '}
                Rp{' '}
                {order.items
                  .reduce(
                    (total, item) =>
                      total + item.quantity * item.product.price,
                    0
                  )
                  .toLocaleString('id-ID')}
              </p>
              <p>
                <strong>Tanggal Pemesanan:</strong>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Tanggal Pembayaran:</strong>{' '}
                {new Date(order.paidAt).toLocaleDateString()} -{' '}
                {new Date(order.paidAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Alamat Pengiriman</h2>
            <div className="space-y-2 text-sm md:text-base">
              <p>
                <strong>Nama Lengkap:</strong> {order.namaDepan}{' '}
                {order.namaBelakang}
              </p>
              <p>
                <strong>E-mail:</strong> {order.user.email}
              </p>
              <p>
                <strong>Alamat Lengkap:</strong> {order.address.alamatLengkap},{' '}
                {order.address.kecamatan}, {order.address.kabupaten},{' '}
                {order.address.provinsi}, {order.kodePos}
              </p>
              <p>
                <strong>Telepon:</strong> {order.phone}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {order.items.map((e, i) => (
          <Card
            key={i}
            className="overflow-hidden shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Link to={`/product/${e.product?._id}`}>
              <img
                src={e.product?.images?.[0]?.url || '/placeholder.jpg'}
                alt={e.product?.title || 'Product Image'}
                className="w-full h-48 object-contain bg-white"
              />
            </Link>

            <CardContent className="p-4">
              <h3 className="text-base md:text-lg font-semibold mb-2 text-center">
                {e.product?.title || 'Nama Produk'}
              </h3>
              <p className="text-sm text-center">
                <strong>Kuantitas:</strong> {e.quantity}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

    
    </div>
  )
}

export default OrderPage
