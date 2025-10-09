import express from "express";
import {addItemToCheckout, fetchCurrentUserInformation, userLogout} from "../controller/userController.js";

const router = express.Router();

router.get('/fetchCurrentUserInformation', fetchCurrentUserInformation);

router.post('/userLogout', userLogout)

router.post('/addItemToCheckout', addItemToCheckout)

export default router;
