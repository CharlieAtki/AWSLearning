import express from "express";
import {fetchCurrentUserInformation} from "../controller/userController.js";

const router = express.Router();

router.get('/fetchCurrentUserInformation', fetchCurrentUserInformation);

export default router;