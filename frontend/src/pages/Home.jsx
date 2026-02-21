import Hero from '@/components/Hero'
import ProductCard from '@/components/ProductCard';
import { ProductData } from '@/context/ProductContext';
import Products from './Products';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UserData } from "@/context/UserContext";


const Home = () => { 
  const navigate = useNavigate();
  const {loading, products, newProd} = ProductData();
  const { user } = UserData();
  return (
    <div>
      <Hero navigate={navigate}/>
      {user?.role !== "admin" && (
      <div className="mt-12 px-6 sm:px-12 lg:px-20 mb-16">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-600 dark:text-gray-300 mb-10 text-center font-lora">
          Produk Terbaru
          </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
         {newProd && newProd.length > 0 ? newProd.map((e) => {
          return <ProductCard key={e._id} product={e} latest={"yes"}/>
         }):<p className='text-center col-span-full text-gray-500'>Belum ada produk</p>}
        </div>
      </div>
      )}
    </div>
  )
}

export default Home
