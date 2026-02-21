import express from 'express';
import { isAuth } from "../middlewares/isAuth.js";
import {
  getAllOrders,
  getAllOrdersAdmin,
  getMyOrder,
  getStats,
  newOrderOnline,
  updateStatus,
  verifyPayment,
  findOrderByOrderId,
  getSalesPerMonth
} from "../controller/order.js";

const router = express.Router();

// Di bawah ini semua rute statis dulu
router.get("/order/find", findOrderByOrderId);
router.post("/order/new/online", isAuth, newOrderOnline);
router.get("/order/all", isAuth, getAllOrders);
router.post("/order/:id", isAuth, updateStatus);
router.get("/stats", isAuth, getStats);
router.get("/sales/monthly", isAuth, getSalesPerMonth);
router.get("/order/admin/all", isAuth, getAllOrdersAdmin);
router.get("/success", (req, res) => {
    const { order_id, status_code, transaction_status } = req.query;
    res.send(`
      <h1>Pembayaran Berhasil!</h1>
      <p>Order ID: ${order_id}</p>
      <p>Status: ${transaction_status}</p>
      <p>Status Code: ${status_code}</p>
    `);
  });

// ✅ Tambahkan di sini
router.post("/order/verify/payment", verifyPayment);

router.post("/order/webhook", verifyPayment);

// ⛔ Route dinamis taruh paling akhir
router.get("/order/:id", isAuth, getMyOrder);


export default router;
