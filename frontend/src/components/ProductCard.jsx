import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from './ui/alert-dialog'

const ProductCard = ({ product, latest, onEdit, onDelete }) => {
  const navigate = useNavigate()

  return (
    product && (
      <div className="w-full max-w-xs mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group 
      transition-transform duration-300 border border-gray-100 dark:border-gray-700 mb-5">
        
        <Link to={`/product/${product._id}`}>
          <div className="relative aspect-[4/3] bg-white dark:bg-gray-900 flex justify-center items-center">
            <img
              src={product.images[0].url}
              alt="Product"
              className="w-[90%] h-[90%] object-contain transition-transform duration-500 group-hover:scale-110"
            />
            {latest === 'yes' && (
              <Badge className="absolute top-3 left-3 bg-green-600 text-white hover:bg-green-700 text-xs font-semibold 
              px-3 py-1 rounded-full shadow-sm z-10">
                New
              </Badge>
            )}
          </div>
        </Link>

        <div className="p-4 flex flex-col justify-between min-h-[260px]">
          <div>
            <h3 className="text-md font-bold truncate text-gray-900 dark:text-white">
              {product.title.slice(0, 30)}
            </h3>
            <p className="text-sm mt-1 text-gray-500 dark:text-gray-400 line-clamp-2 text-justify">
              {product.about}
            </p>
            <p className="text-sm mt-1 truncate text-gray-800 dark:text-gray-200 font-semibold">
              Rp{product.price.toLocaleString('id-ID')}
            </p>

            <div className='flex items-center justify-center mt-6'>
              <Button onClick={() => navigate(`/product/${product._id}`)}>
                Lihat Produk
              </Button>
            </div>
          </div>

          {onEdit && onDelete && (
            <div className="mt-3 flex justify-center gap-3">
              <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    Hapus
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin menghapus produk ini?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(product._id)}>
                      Ya, Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    )
  )
}

export default ProductCard
