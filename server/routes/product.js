import express from 'express';
import uploadFiles from '../middlewares/multer.js';
import { createProduct, getAllProducts, getSingleProduct, updateProduct, updateProductImage, deleteProduct } from '../controller/product.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post("/product/new", isAuth, uploadFiles, createProduct);
router.get("/product/all", getAllProducts);
router.get("/product/:id", getSingleProduct);
router.put("/product/:id", isAuth, updateProduct);
router.post("/product/:id", isAuth, uploadFiles, updateProductImage);
// routes/product.js
router.delete('/product/:id', isAuth, deleteProduct);


export default router;