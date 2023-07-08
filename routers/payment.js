import express from "express";
import { PaymentVNPay } from "../controllers/payment.js";
const router = express.Router();
router.post("/create_payment_url", PaymentVNPay);

// router.get("/https://google.com/");
// router.get("/", getCategories);
export default router;
