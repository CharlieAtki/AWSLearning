import express from "express";
import {productCreation, getAllProducts} from "../controller/productController.js";

const router = express.Router();

router.post('/createProduct', productCreation);
router.get('/getAllProducts', getAllProducts);

export default router;
