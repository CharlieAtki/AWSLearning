import express from "express";
import {fetchCurrentUserInformation, userLogout} from "../controller/userController.js";

const router = express.Router();

router.get('/fetchCurrentUserInformation', fetchCurrentUserInformation);

router.post('/userLogout', userLogout)

export default router;