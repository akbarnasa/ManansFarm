import express from 'express';
import { loginUser, myProfile, verifyUser } from "../controller/user.js";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFiles from "../middlewares/multer.js";
import { createProduct } from "../controller/product.js";
import { isAdmin } from '../middlewares/isAuth.js';
import { getAllUsers } from '../controller/user.js';
import { deleteUserController } from "../controller/user.js";


const router =express.Router();

router.post("/user/login", loginUser);
router.post("/user/verify", verifyUser);
router.get("/user/user", isAuth, myProfile);
router.post("/product/new", isAuth, uploadFiles, createProduct);
router.get('/admin/all', isAuth, isAdmin, getAllUsers);
router.delete("/user/:id", isAuth, isAdmin, deleteUserController);


export default router;