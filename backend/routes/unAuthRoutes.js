import express from 'express';
import { userCreation, loginUser } from "../controller/userController.js";
import { refreshToken } from '../controller/authCheck.js';

const router = express.Router();

// Registration route (JWT created here in Option 1, not in Option 2)
router.post('/createUser', userCreation);

// Login route (JWT always created here)
router.post('/userLogin', loginUser);

// Token refresh route
router.post('/refresh', refreshToken);

export default router;
