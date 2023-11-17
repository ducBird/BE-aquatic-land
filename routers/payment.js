import express from "express";
import {
  PaymentVNPay,
  getPaymentVnpayINP,
  getPaymentVnpayReturn,
} from "../controllers/payment.js";
import { PaymentMOMO } from "../controllers/payment.momo.js";
const router = express.Router();
router.post("/create_paymentVnpay_url", PaymentVNPay);
router.get("/vnpay_ipn", getPaymentVnpayINP);
router.get("/vnpay_return", getPaymentVnpayReturn);
router.post("/create_paymentMoMo_url", PaymentMOMO);

export default router;
