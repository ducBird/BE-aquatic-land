import express from "express";
import {
  deleteProduct,
  getByIdProduct,
  getProducts,
  postProduct,
  search,
  updateProduct,
  getProductsByIdCategory,
  getProductsByIdSubCategory,
  searchProducts,
  deleteAllProduct,
} from "../controllers/products.js";
import { convertDateMiddleware } from "../middlewares/convertDate.js";
import {
  verifyToken,
  verifyTokenAdmin,
} from "../middlewares/middlewareauth.js";
import { findDocuments } from "../helpers/MongoDbHelper.js";

const router = express.Router();
router.get("/", getProducts);
router.get("/product/:id", getByIdProduct);
router.get("/:category_id", getProductsByIdCategory);
router.get("/:category_id/sub/:sub_category_id", getProductsByIdSubCategory);
router.get("/search", search);
router.post("/", convertDateMiddleware, postProduct);
router.patch("/:id", convertDateMiddleware, updateProduct);
router.delete("/:id", deleteProduct);
router.post("/search-products", searchProducts);
router.delete("/", deleteAllProduct);

router.get("/questions/1", async (req, res, next) => {
  try {
    let query = { discount: { $gte: 5 } };
    const results = await findDocuments({ query: query }, "products");
    res.json({ ok: true, results });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
