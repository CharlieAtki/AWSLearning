import express from 'express';
import { createBusiness } from '../controller/businessController.js';

const router = express.Router();

router.post('/createBusiness', createBusiness);

export default router;


// Remeber to:

// Finish the business creation contoller
// Create a way to add products -> need to be associated to the business
