import { CartData } from '@/context/CartContext'
import { ShoppingCart, Trash } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator"



const Cart = () => {
  const {
    cart, totalItem, subTotal, updateCart, removeFromCart 
  } = CartData();

  const navigate = useNavigate()

  const updateCartHandler = async (action, id) => {
    await updateCart(action, id);
  }
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Keranjang Belanja</h1>
      {
        cart.length === 0 ? <div className='text-center py-10'>
        <p className='text-xl'>Keranjang Belanja anda kosong </p>
        <Button className='mt-6' onClick={()=>navigate("/products")}>Belanja Sekarang</Button>
        </div> : <div className='grid gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-2 space-y-6'>
              
          {
            cart.map((e) => (
              <div key={e._id} className='flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 p-4 border border-gray-300 rounded-2xl shadow-md w-full overflow-hidden'>
                <img src={e.product.images[0].url} 
                alt={e.product.title}
                className='w-full sm:w-20 sm:h-20 object-cover rounded-md cursor-pointer'
                onClick={()=> navigate(`/product/${e.product._id}`)}
                />

                <div className='flex-1 text-center sm:text-left sm:px-2 min-w-[150px]'>
                  <h2 className='text-base sm:text-lg font-semibold'>{e.product.title}</h2>
                  <p className='text-sm'>Harga: Rp{e.product.price.toLocaleString('id-ID')}</p>
                </div>

                <div className='flex items-center gap-2'>
                  <Button variant='outline'
                  size='icon'
                  className='"w-8 h-8'
                  onClick={()=> updateCartHandler('dec', e._id)}
                  >
                    -
                  </Button>
                  <span className='w-6 text-center font-medium'>{e.quantity}</span>
                  <Button variant='outline'
                  size='icon'
                  className='"w-8 h-8'
                  onClick={()=> updateCartHandler('inc', e._id)}
                  >
                    +
                  </Button>
                </div>

                <div className="min-w-[80px] text-black-600 font-semibold text-right">
                Rp{(e.product.price * e.quantity).toLocaleString('id-ID')}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-black-600"
                  onClick={() => removeFromCart(e._id)}
                >
                  <Trash className="w-5 h-5" />
                </Button>
              </div>
            ))
          }
          </div>
          
          <div className="p-6 bg-white shadow-xl rounded-2xl border border-gray-300 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-center lg:text-left text-gray-800">
              🧾 Rincian Pesanan
              </h2>
            <Separator className="my-2" />
            <div className="space-y-3 mt-4 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span>Total Produk</span>
                <span>{totalItem}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Harga</span>
                <span>Rp{subTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <Separator className="my-4" />
            
            <div className="flex justify-between font-semibold text-lg text-gray-900">
              <span>Total:</span>
              <span>Rp{subTotal.toLocaleString('id-ID')}</span>
            </div>
            
            <Button
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold transition-all duration-200 rounded-md"
              onClick={() => navigate("/checkout")}
              disabled={cart.length === 0}
            >
              CHECKOUT
            </Button>
          </div>


        </div> 
      }
    </div>
  )
}

export default Cart
