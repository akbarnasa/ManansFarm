import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const server = "http://localhost:5000";

const Success = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);

  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await axios.get(
        `${server}/api/order/find?orderId=${orderId}`
      );
      setOrder(data.order);
    };

    fetchOrder();

    const interval = setInterval(fetchOrder, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (!order) return <p className="text-center mt-12">Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-green-700 text-center">
          Pembayaran Berhasil!
        </h1>
        <p className="mb-2 text-gray-700">
          <span className="font-semibold">Status:</span>{" "}
          {order.status === "Dibayar" ? (
            <span className="font-semibold"> <strong>Dibayar</strong></span>
          ) : (
            <span className="text-yellow-500">⏳ {order.status}</span>
          )}
        </p>
        <p className="mb-4 text-gray-700">
          <span className="font-semibold">ID Pesanan:</span> {order.orderId}
        </p>

        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
           Detail Produk
          </h2>
          <ul className="space-y-2">
            {order.items.map((item) => (
              <li
                key={item.product._id}
                className="flex justify-between text-gray-700"
              >
                <span>{item.quantity} × {item.product.title}</span>
                <span>
                  Rp{(item.product.price * item.quantity).toLocaleString("id-ID")}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold text-lg border-t mt-4 pt-2 text-gray-800">
            <span>Total:</span>
            <span>
              Rp{order.subTotal.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Terima kasih telah berbelanja di Manan's Farm.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
