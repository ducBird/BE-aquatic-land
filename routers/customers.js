import express from "express";
import {
  activateEmail,
  deleteCustomer,
  getAccessToken,
  getByIdCustomer,
  getCustomers,
  login,
  logout,
  postCustomer,
  registerCustomer,
  search,
  updateCustomer,
} from "../controllers/customers.js";
import { convertDateMiddleware } from "../middlewares/convertDate.js";
import { verifyToken } from "../middlewares/middlewareauth.js";

const router = express.Router();
router.get("/", verifyToken, getCustomers);
router.get("/:id", getByIdCustomer);
router.get("/search", search);
router.post("/", convertDateMiddleware, postCustomer);
router.patch("/:id", convertDateMiddleware, updateCustomer);
router.delete("/:id", deleteCustomer);
router.post("/register", registerCustomer);
router.post("/activation", activateEmail);
router.post("/login", login);
router.post("/refresh-token", getAccessToken);
router.get("/logout", logout);

export default router;
