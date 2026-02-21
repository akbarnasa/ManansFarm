import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductData } from '@/context/ProductContext';
import { Input } from '@/components/ui/input';
import { Filter } from 'lucide-react';
import Loading from '@/components/Loading';
import ProductCard from '@/components/ProductCard';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const Products = () => {
  const [show, setShow] = useState(false);
  const {loading, products, newProd, search, setSearch, categories, 
    category, setCategory, totalPages, price, setPrice, page, setPage} = ProductData();

  const clearFilter = ()=> {
    setPrice("");
    setCategory("");
    setSearch("");
    setPage(1);
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = ()=> {
    setPage(page - 1);
  }

  return (
    <div className="flex flex-col md:flex-row h-full mb-5">
      {/* Tombol toggle filter di mobile */}

      {/* Sidebar Filter */}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:z-40 w-64 bg-white dark:bg-gray-800 shadow-xl 
        transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 
        ${show ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 relative h-full overflow-y-auto">
          {/* Tombol tutup */}
          <button
            onClick={() => setShow(false)}
            className="absolute top-4 right-4 bg-gray-300 dark:bg-gray-700 text-black dark:text-white 
            rounded-full w-8 h-8 flex items-center justify-center md:hidden hover:bg-green-700 hover:text-white transition"
            aria-label="Tutup Filter"
          >
            X
          </button>

          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Filter</h2>

          {/* Input Judul */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cari Judul
            </label>
            <Input
              type="text"
              placeholder="Masukkan judul yang dicari"
              className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 
              dark:bg-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 transition"
              value={search}
              onChange={(e)=> setSearch(e.target.value)}
            />
          </div>

          {/* Select Kategori Jenis Produk*/}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategori
            </label>
            <select
              className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground 
              placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              value={category} 
              onChange={e=>setCategory(e.target.value)}
            >
              <option value="">Semua</option>
              {
                categories.map((e)=> {
                  return (
                    <option value={e} key={e}>{e}
                    </option>
                  );
                })
              }
            </select>

          </div>

          {/* Select Kategori Harga*/}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Harga
            </label>
            <select
              className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground 
              placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              value={price} 
              onChange={e=>setPrice(e.target.value)}
            >
              <option value="">Pilih Harga</option>
              <option value="lowToHigh">Murah ke mahal</option>
              <option value="highToLow">Mahal ke murah</option>
            </select>
          </div>
          <Button className='mt-2' onClick={clearFilter}>Hapus Filter</Button>
        </div>
      </div>

      <div className='flex-1 p-4'>
        <button 
        onClick={()=> setShow(true)}
        className='md:hidden bg-blue-500 text-white px-4 py-2 rounded-md mb-4'><Filter/>
        </button>

        {
          loading ? (
            <Loading/>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
            lg:grid-cols-4 gap-3'>
              {products && products.length > 0 ? (
              products.map((e) => {
              return <ProductCard key={e._id} product={e} latest={"no"}/>
               }) 
          ) : (
               <p className='text-center col-span-full text-gray-500'>Belum ada produk</p>
               )}
            </div>
          ) }

            <div className='mb-3 mt-2'>
              <Pagination>
                <PaginationContent>
                  {page!==1 && (
                    <PaginationItem className='cursor-pointer' onClick=
                    {prevPage}><PaginationPrevious/>
                    </PaginationItem>
                  )}

                  {
                    page !== totalPages && (
                      <PaginationItem className='cursor-pointer' onClick=
                        {nextPage}><PaginationNext/>
                      </PaginationItem>
                    )
                  }
                </PaginationContent>
              </Pagination>
            </div>
      </div>
    </div>
  );
};

export default Products;
