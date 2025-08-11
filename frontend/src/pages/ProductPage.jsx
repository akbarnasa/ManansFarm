import Loading from '@/components/Loading';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { CartData } from '@/context/CartContext';
import { ProductData } from '@/context/ProductContext';
import { UserData } from '@/context/UserContext';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { fetchProduct, product, relatedProduct, loading } = ProductData();
  const { addToCart } = CartData();
  const { id } = useParams();
  const { isAuth } = UserData();
  const {user} = UserData()

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  const addToCartHandler = () => {
    addToCart(id);
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4 py-10">
          {product && (
            <div className="flex flex-col lg:flex-row items-start gap-10">
              {/* Gambar Produk */}
              <div className="w-full lg:w-[50%] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <Carousel>
                  <CarouselContent>
                    {product.images?.map((image, index) => (
                      <CarouselItem key={index}>
                        <img
                          src={image.url}
                          alt={`Product Image ${index + 1}`}
                          className="w-full h-[420px] object-contain bg-white p-4"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {product.images?.length > 1 && (
                    <>
                      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 border rounded-full bg-white shadow w-10 h-10 hover:bg-green-600 hover:text-white" />
                      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 border rounded-full bg-white shadow w-10 h-10 hover:bg-green-600 hover:text-white" />
                    </>
                  )}
                </Carousel>
              </div>

              {/* Info Produk */}
              <div className="w-full lg:w-[50%] space-y-5">
                <h1 className="text-3xl font-semibold text-gray-900">{product.title}</h1>
                <p className="text-gray-600 leading-relaxed">{product.about}</p>

                <p className="text-2xl font-bold text-green-600">Rp{product.price}</p>

                {/* Stock dan Terjual */}
                <div className="flex gap-6 mt-2">
                  <div className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm">
                    Stok: <span className="font-semibold">{product.stock}</span>
                  </div>
                  <div className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm">
                    Terjual: <span className="font-semibold">{product.sold}</span> item
                  </div>
                </div>

                {/* Tombol Keranjang */}
                {isAuth ? (
                  <>
                    {product.stock <= 0 ? (
                      <p className="text-red-500 font-semibold text-md">❌ Stok habis</p>
                    ) : (
                      user?.role !== 'admin' && (
                        <Button
                          onClick={addToCartHandler}
                          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow transition-all"
                        >
                          + Tambah ke Keranjang
                        </Button>
                      )
                    )}
                  </>
                ) : (
                  <p className="text-blue-500 font-medium mt-2">
                    🔒 Silakan login untuk memasukkan ke keranjang
                  </p>
                )}

              </div>
            </div>
          )}
        </div>
      )}

      {/* Produk Terkait */}
      {relatedProduct?.length > 0 && (
        <div className="mt-16 px-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
            Produk Terkait
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProduct.map((e) => (
              <ProductCard key={e._id} product={e} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
