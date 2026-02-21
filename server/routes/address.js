import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { addAddress, deleteAddress, getAllAddress, getSingleAddress } from '../controller/address.js';

const router =  express.Router();
router.post('/address/new', isAuth, addAddress);
router.get('/address/all', isAuth, getAllAddress);
router.get('/address/:id', isAuth, getSingleAddress);
router.delete('/address/:id', isAuth, deleteAddress);

export default router;