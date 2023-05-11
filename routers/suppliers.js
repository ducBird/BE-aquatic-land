import express from "express";
import {
  deleteSupplier,
  getByIdSupplier,
  getSuppliers,
  postSupplier,
  search,
  updateSupplier,
} from "../controllers/suppliers.js";

const router = express.Router();
router.get("/", getSuppliers);
router.get("/:id", getByIdSupplier);
router.get("/search", search);
router.post("/", postSupplier);
router.patch("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

export default router;
