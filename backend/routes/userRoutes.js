import express from "express";
import {addItemToCheckout, fetchCurrentUserInformation, userLogout, updateCheckoutQuantity, removeFromCheckout, calculateTotalCheckoutValue } from "../controller/userController.js";

const router = express.Router();

router.get('/fetchCurrentUserInformation', fetchCurrentUserInformation);

router.post('/userLogout', userLogout)

router.post('/addItemToCheckout', addItemToCheckout)

// Updates the quantity of the product in the checkout
router.post('/updateCheckoutQuantity', updateCheckoutQuantity)

// Removes the product from the checkout
router.post('/removeFromCheckout', removeFromCheckout)

// Calculates the total cost of the user checkout basket
router.post('/calculateTotalCheckoutValue', calculateTotalCheckoutValue)

export default router;
