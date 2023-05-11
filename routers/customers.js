import express from "express";
import {
  deleteCustomer,
  getByIdCustomer,
  getCustomers,
  postCustomer,
  search,
  updateCustomer,
} from "../controllers/customers.js";
import { convertDateMiddleware } from "../middlewares/convertDate.js";

const router = express.Router();
router.get("/", getCustomers);
router.get("/:id", getByIdCustomer);
router.get("/search", search);
router.post("/", convertDateMiddleware, postCustomer);
router.patch("/:id", convertDateMiddleware, updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
