import express from 'express';
import {agentChat} from "../controller/agentChatController.js";

const router = express.Router();

router.post("/agentChat", agentChat);

export default router;