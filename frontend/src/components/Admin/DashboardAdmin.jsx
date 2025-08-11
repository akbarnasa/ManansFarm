import React, { useEffect, useState } from 'react'
import { Boxes, Users, Package, ShoppingBag, Wallet } from 'lucide-react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Loading from '../Loading'


const server = "http://localhost:5000"

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [omzetTahunan, setOmzetTahunan] = useState(0)
  const [loading, setLoading] = useState(true)

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token")

        const [userRes, productRes, orderRes, salesRes] = await Promise.all([
          axios.get(`${server}/api/admin/all`, { headers: { token } }),
          axios.get(`${server}/api/admin`, { headers: { token } }),
          axios.get(`${server}/api/order/admin/all`, { headers: { token } }),
          axios.get(`${server}/api/sales/monthly?year=${new Date().getFullYear()}`, { headers: { token } }),
        ])

        setUsers(userRes.data.users || userRes.data || [])
        setProducts(productRes.data.products || productRes.data || [])
        setOrders(orderRes.data || [])

        const omzet = salesRes.data.monthlySales?.reduce((acc, curr) => acc + curr.total, 0) || 0
        setOmzetTahunan(omzet)
      } catch (error) {
        console.error("Gagal mengambil data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getOrderCountThisMonth = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return orders.filter((order) => {
      const orderDate = new Date(order.paidAt)
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      )
    }).length
  }

  const getTotalProductStock = () => {
    return products.reduce((acc, product) => acc + (product.stock || 0), 0)
  }
  
  const getTotalProductSoldThisMonth = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    let totalSold = 0
  
    orders.forEach(order => {
      const orderDate = new Date(order.paidAt)
      if (
        order.status === "Dibayar" &&
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      ) {
        order.items.forEach(item => {
          totalSold += item.quantity || 0
        })
      }
    })
  
    return totalSold
  }
  
  
  return (
    <>
      {/* GRID STATISTIK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="bg-white shadow rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Total Produk</h3>
                <p className="text-xl font-bold text-gray-800">{products.length}</p>
              </div>
            </div>
  
            <div className="bg-white shadow rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Total Pengguna</h3>
                <p className="text-xl font-bold text-gray-800">{users.length}</p>
              </div>
            </div>
  
            <div className="bg-white shadow rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Pesanan Bulan Ini</h3>
                <p className="text-xl font-bold text-gray-800">{getOrderCountThisMonth()}</p>
              </div>
            </div>
  
            <div className="bg-white shadow rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Omzet Tahun Ini</h3>
                <p className="text-xl font-bold text-gray-800">
                  Rp {omzetTahunan.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
  
            
            <div className="bg-white shadow rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 rounded-full bg-cyan-100 text-cyan-600">
                <Boxes className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Total Stok Produk Masuk</h3>
                <p className="text-xl font-bold text-gray-800">{getTotalProductStock()}</p>
              </div>
            </div>
  
            <div className="bg-white shadow rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 rounded-full bg-rose-100 text-rose-600">
                <Boxes className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Total Stok Produk Keluar</h3>
                <p className="text-xl font-bold text-gray-800">{getTotalProductSoldThisMonth()}</p>
              </div>
            </div>
          </>
        )}
      </div>


    </>
  )
  
}

export default AdminDashboard
