import express from "express";
import {
  deleteProductVariant,
  getByIdProductVariant,
  getProductVariants,
  postProductVariant,
  search,
  updateProductVariant,
  getVariantsByProductId,
  getVariant,
} from "../controllers/product.variants.js";
import { convertDateMiddleware } from "../middlewares/convertDate.js";
import {
  verifyToken,
  verifyTokenAdmin,
} from "../middlewares/middlewareauth.js";

const router = express.Router();
router.get("/", getProductVariants);
router.get("/:product_id", getVariantsByProductId);
router.get("/:product_id/:id", getByIdProductVariant);
router.get("/variant/:id", getVariant);
router.get("/search", search);
router.post("/", verifyTokenAdmin, convertDateMiddleware, postProductVariant);
router.put(
  "/updateVariants",
  verifyToken,
  convertDateMiddleware,
  updateProductVariant
);
router.delete("/:id", verifyTokenAdmin, deleteProductVariant);

export default router;
