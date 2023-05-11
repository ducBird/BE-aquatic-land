import express from "express";
import {
  deleteProductVariant,
  getByIdProductVariant,
  getProductVariants,
  postProductVariant,
  search,
  updateProductVariant,
  getVariantsByProductId,
} from "../controllers/product.variants.js";
import { convertDateMiddleware } from "../middlewares/convertDate.js";

const router = express.Router();
router.get("/", getProductVariants);
router.get("/:product_id", getVariantsByProductId);
router.get("/:product_id/:id", getByIdProductVariant);
router.get("/search", search);
router.post("/", convertDateMiddleware, postProductVariant);
router.patch("/:id", convertDateMiddleware, updateProductVariant);
router.delete("/:id", deleteProductVariant);

export default router;
