// routes/salesRoute.js
import express from "express";
import { getSalesCluster } from "../controller/salesController.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/sales/cluster", isAuth, getSalesCluster);

export default router;
