import express from "express";
import {
  deleteSupplier,
  getByIdSupplier,
  getSuppliers,
  postSupplier,
  search,
  updateSupplier,
} from "../controllers/suppliers.js";
import {
  verifyToken,
  verifyTokenAdmin,
} from "../middlewares/middlewareauth.js";

const router = express.Router();
router.get("/", getSuppliers);
router.get("/:id", getByIdSupplier);
router.get("/search", search);
router.post("/", verifyTokenAdmin, postSupplier);
router.patch("/:id", verifyToken, updateSupplier);
router.delete("/:id", verifyTokenAdmin, deleteSupplier);

export default router;
