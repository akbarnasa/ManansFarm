import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Loading from '@/components/Loading'
import {server} from '@/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()
    
    useEffect(()=> {
        const fetchOrders = async() => {
            try {
                const {data} = await axios.get(`${server}/api/order/all`, {
                    headers: {
                        token: Cookies.get("token"),
                    },
                });

                setOrders(data.orders)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        
        fetchOrders()
    },[]);

    console.log(orders)

    if (loading) {
        return<Loading/>
    }

    if (orders.length===0) {
        return <div className='min-h-[70vh] flex flex-col items-center justify-center text-center'>
            <h1 className='text-2xl font-bold text-gray-700'>Tidak ada pesanan</h1>
            <Button onClick={()=> navigate ("/products")}>Belanja sekarang</Button>
        </div>
    }
  return (
    <div className='container mx-auto py-6 px-4 min-h-screen'>
      <div className='text-3xl font-bold mb-6 text-center'>Riwayat Pesanan Kamu</div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {
          orders.map((order)=> {
            const statusClass = (() => {
              const s = order.status.trim().toLowerCase();
              if (s.includes('menunggu')) return 'text-yellow-500';
              if (s.includes('dibayar')) return 'text-green-500';
              if (s.includes('ditolak') || s.includes('dibatalkan') || s.includes('kedaluwarsa')) return 'text-red-500';
              return 'text-gray-500';
            })();
            return <Card key ={order._id} className='shadow-sm hover:shadow-lg transition-shadow duration-200'>
           
           {/* HEADER */}
            <CardHeader>  
                <CardTitle className='text-xl font-semibold'>
                  ORDER-ID #{order._id.toUpperCase()}
                </CardTitle>
            </CardHeader>

           
            <CardContent>
              <p>
                <strong>Status: </strong>
                <span className={statusClass}>{order.status}</span>
              </p>

              <p>
                <strong>Total Item: </strong>
                {order.items.reduce((total, item) => total + item.quantity, 0)}
              </p>

              <p>
              <strong>Total Harga: </strong>
              Rp {order.items.reduce(
                (total, item) => total + (item.product.price * item.quantity),
                0
              ).toLocaleString('id-ID')}
            </p>

            <p>
              <strong>Tanggal Pemesanan: </strong>
               {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <Button className='mt-4' onClick={()=> navigate
            (`/order/${order._id}`)}> Lihat Detail
            </Button>

            </CardContent>
            </Card>
          })
        }
      </div>
    
  </div>
  )
}

export default Orders
