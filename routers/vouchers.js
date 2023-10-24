import express from "express";
import {
  getVouchers,
  getByIdVoucher,
  postVoucher,
  updateVoucher,
  deleteVoucher,
  search,
} from "../controllers/vouchers.js";
import {
  verifyToken,
  verifyTokenAdmin,
} from "../middlewares/middlewareauth.js";
const router = express.Router();
router.get("/", getVouchers);
router.get("/:id", getByIdVoucher);
router.get("/search", search);
router.post("/", verifyTokenAdmin, postVoucher);
router.patch("/:id", verifyToken, updateVoucher);
router.delete("/:id", verifyTokenAdmin, deleteVoucher);

export default router;
