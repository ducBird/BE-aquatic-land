import express from "express";
import {
  getOrder,
  getOrderId,
  postOrder,
  deleteOrder,
  updateOrder,
} from "../controllers/orders.js";

const router = express.Router();
router.get("/", getOrder);
router.get("/:id", getOrderId);
router.post("/", postOrder);
router.patch("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
