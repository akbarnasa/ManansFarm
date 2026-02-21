import TryCatch from "../utils/TryCatch.js";
import { Cart } from '../models/Cart.js'
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import orderConfirmation from "../utils/orderConfirmation.js";
import dotenv from 'dotenv';
import midtransClient from 'midtrans-client';


export const getAllOrders = TryCatch(async(req,res)=> {
    const orders = await Order.find({user: req.user._id}).populate("items.product");;
    res.json({ orders: orders.reverse()});
});

export const getAllOrdersAdmin =TryCatch(async(req,res) => {
    if(req.user.role!=="admin")
    return res.status(403).json({
    message: "Anda bukan admin",
});

const orders= await Order.find().populate("user").sort({ createdAt: -1});

res.json(orders);
});

export const getMyOrder = TryCatch(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("items.product")
        .populate("user");

    if (!order) {
        return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    res.json(order);
});


export const updateStatus = TryCatch(async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Anda bukan admin" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    const { status } = req.body;
    order.status = status;
    await order.save();

    res.json({
        message: "Status pesanan telah diperbarui",
        order,
    });
});

export const findOrderByOrderId = async (req, res) => {
  const { orderId } = req.query;

  try {
    const order = await Order.findOne({ orderId }).populate("items.product");
    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("❌ Gagal menemukan order:", error.message);
    res.status(500).json({ message: "Gagal mengambil order" });
  }
};

export const getStats =TryCatch(async(req,res)=> {
    if(req.user.role !== "admin") {
        return res.status(403).json({
            message: "Anda bukan admin",
        });
    }

    const online = await Order.find({method:"online"}).countDocuments()
    const products = await Product.find()
    const data = products.map((prod) => ({
        name: prod.title,
        sold: prod.sold,
    }));

    res.json({
        online,
        data,
    });
});

export const getSalesPerMonth = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Anda bukan admin",
    });
  }

  const year = parseInt(req.query.year);

  if (!year) {
    return res.status(400).json({ message: "Parameter tahun diperlukan, misal ?year=2025" });
  }

  const orders = await Order.find({
    status: "Dibayar",
    paidAt: {
      $gte: new Date(`${year}-01-01T00:00:00.000Z`),
      $lte: new Date(`${year}-12-31T23:59:59.999Z`),
    },
  });

  const monthlySales = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    total: 0,
  }));

  orders.forEach(order => {
    const month = order.paidAt.getMonth(); // 0-based index
    monthlySales[month].total += order.subTotal;
  });

  res.json({ year, monthlySales });
});


dotenv.config()

// Konfigurasi Midtrans Snap
// Create Snap API instance
let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction : false,
        serverKey : process.env.MIDTRANS_SERVER_KEY
    });

  export const newOrderOnline = async (req, res) => {
    try {

        console.log("REQ.BODY:", req.body);
        console.log("REQ.USER:", req.user);

        const {method, namaDepan, namaBelakang, 
            address:{
                alamatLengkap,
                kecamatan,
                kabupaten,
                provinsi
        }, kodePos, phone} = req.body;

        const cart = await Cart.find({user: req.user._id}).populate ("product")

        if (!cart.length) {
            return res.status(400).json({
                message: "Keranjang Kosong",
            });
        }

        const midtransItems = cart.map((item) => ({
          id: item.product._id.toString(),
          name: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
        }));
        
        const grossAmount = midtransItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        
        const items = cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        }));
        
        const itemsTotal = midtransItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        if (grossAmount !== itemsTotal) {
          return res.status(400).json({
            message: `Total mismatch! GrossAmount: ${grossAmount}, ItemsTotal: ${itemsTotal}`
          });
        }
        
        console.log("GrossAmount:", grossAmount);
        console.log("Items:", items);
        console.log("customer_details:", {
          first_name: `${namaDepan} ${namaBelakang}`.trim(),
          email: req.user.email,
          phone: phone,
        });
        
        const orderId = "ORDER-" + new Date().getTime();
        
        const parameter = {
          transaction_details: {
            order_id: orderId,
            gross_amount: grossAmount,
          },
          item_details: midtransItems,
          customer_details: {
            first_name: `${namaDepan} ${namaBelakang}`.trim()

          },
          callbacks: {
            finish: "http://localhost:5173/success",
          },
          method: method,
          address: `${alamatLengkap}, ${kecamatan}, ${kabupaten}, ${provinsi}`,
        };
        
        const transaction = await snap.createTransaction(parameter);
        
        // Simpan order
        await Order.create({
          items,
          method,
          user: req.user._id,
          namaDepan,
          namaBelakang,
          address: {
            alamatLengkap,
            kecamatan,
            kabupaten,
            provinsi,
          },
          kodePos,
          phone,
          subTotal: grossAmount,
          orderId,
          status: "Belum Dibayar",
        });
        
        res.json({
          message: "Sesi pembayaran berhasil dibuat",
          token: transaction.token,
        });        
        

            } catch (error) {
                console.log("Sesi Pembayaran Error:", error.message);
                res.status(500).json({ message: "Sesi Pembayaran Gagal" });
              }
            }; 

            export const verifyPayment = async (req, res) => {
              console.log("📥 Webhook Masuk:");
              console.log(req.body); // log isi body
            
              try {
                console.log("📦 Webhook DITERIMA:", req.body);
                const notification = req.body;
            
                const core = new midtransClient.CoreApi({
                  isProduction: false,
                  serverKey: process.env.MIDTRANS_SERVER_KEY,
                  clientKey: process.env.MIDTRANS_CLIENT_KEY,
                });
            
                const statusResponse = await core.transaction.notification(notification);
            
                const {
                  transaction_status,
                  order_id,
                  fraud_status,
                } = statusResponse;
            
                console.log("📊 Status Transaksi:", transaction_status, "| Fraud:", fraud_status);
            
                const order = await Order.findOne({ orderId: order_id }).populate("user").populate("items.product");
            
                if (!order) {
                  console.log("❌ Order tidak ditemukan:", order_id);
                  return res.status(404).json({ message: "Order tidak ditemukan" });
                }
            
                console.log("✅ Order ditemukan:", order_id);
            
                if (order.status === "Dibayar") {
                  console.log("✅ Sudah dibayar sebelumnya");
                  return res.status(200).json({ message: "Order sudah diproses sebelumnya" });
                }
            
                if (
                  transaction_status === "settlement" ||
                  (transaction_status === "capture" && fraud_status === "accept")
                ) {
                  order.status = "Dibayar";
                  order.paidAt = new Date();
            
                  const result = await Cart.deleteMany({ user: order.user });
                  console.log(`🧹 Cart user dihapus: ${result.deletedCount} item`);
            
                  for (const item of order.items) {
                    console.log("🔄 Update produk:", item.product);
                    const product = await Product.findById(item.product);
            
                    if (product) {
                      const qty = parseInt(item.quantity || 0);
                      product.sold += qty;
                      product.stock -= qty;
                      await product.save();
                      console.log(`✅ Produk ${product.title} updated (sold +${qty})`);
                    } else {
                      console.log("⚠️ Produk tidak ditemukan:", item.product);
                    }
                  }

                   // Kirim email konfirmasi
                  await orderConfirmation({
                    email: order.user.email,
                    subject: "Konfirmasi Pesanan",
                    orderId: order.orderId,
                    products: order.items.map((item) => ({
                      name: item.product.title,
                      quantity: item.quantity,
                      price: item.product.price,
                    })),
                    totalAmount: order.subTotal,
                  });

                  console.log("✅ Email konfirmasi terkirim ke:", order.user.email);

                } else if (transaction_status === "capture" && fraud_status === "challenge") {
                  order.status = "Menunggu Verifikasi Midtrans";
                } else if (transaction_status === "pending") {
                  order.status = "Belum Dibayar";
                } else if (transaction_status === "deny") {
                  order.status = "Pembayaran Ditolak";
                } else if (transaction_status === "expire") {
                  order.status = "Kedaluwarsa";
                } else if (transaction_status === "cancel") {
                  order.status = "Dibatalkan";
                }
            
                await order.save();
                console.log("💾 Order berhasil disimpan");
            
                // HANYA KIRIM RESPONSE SETELAH SELESAI PROSES
                 return res.status(200).send("OK");
              } catch (error) {
                console.log("❌ Verifikasi pembayaran gagal:", error.message);
                res.status(500).json({ message: "Internal server error" });
              }

              
            };
            
            
            
            
              