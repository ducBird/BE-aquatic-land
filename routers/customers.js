import express from "express";
import {
  activateEmail,
  deleteCustomer,
  forgotPassword,
  getAccessToken,
  getByIdCustomer,
  getCustomers,
  login,
  logout,
  postCustomer,
  registerCustomer,
  resetPassword,
  search,
  updateCustomer,
} from "../controllers/customers.js";
import { convertDateMiddleware } from "../middlewares/convertDate.js";
import {
  verifyToken,
  verifyTokenAdmin,
} from "../middlewares/middlewareauth.js";

const router = express.Router();
router.get("/", verifyToken, getCustomers);
router.get("/:id", getByIdCustomer);
router.get("/search", search);
router.post("/", verifyTokenAdmin, convertDateMiddleware, postCustomer);
// router.patch("/:id", verifyToken, convertDateMiddleware, updateCustomer);
router.patch("/:id", updateCustomer);
router.delete("/:id", verifyTokenAdmin, deleteCustomer);
router.post("/register", registerCustomer);
router.post("/activation", activateEmail);
router.post("/login", login);
router.post("/refresh-token", getAccessToken);
router.post("/forgot", forgotPassword);
router.post("/reset", verifyToken, resetPassword);
router.get("/logout", logout);

export default router;
