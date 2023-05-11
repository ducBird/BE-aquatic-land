import express from "express";
import {
  deleteEmployee,
  getByIdEmployee,
  getEmployees,
  postEmployee,
  search,
  updateEmployee,
} from "../controllers/employees.js";
import { convertDateMiddleware } from "../middlewares/convertDate.js";

const router = express.Router();
router.get("/", getEmployees);
router.get("/:id", getByIdEmployee);
router.get("/search", search);
router.post("/", convertDateMiddleware, postEmployee);
router.patch("/:id", convertDateMiddleware, updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
