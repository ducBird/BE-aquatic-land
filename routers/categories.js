import express from "express";
import {
  deleteCategory,
  getByIdCategory,
  getCategories,
  postCategory,
  search,
  updateCategory,
} from "../controllers/categories.js";
const router = express.Router();
router.get("/", getCategories);
router.get("/:id", getByIdCategory);
router.get("/search", search);
router.post("/", postCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
