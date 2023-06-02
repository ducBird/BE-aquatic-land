import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { CONNECTION_STRING } from "./constants/connectionDB.js";
import categoriesRouter from "./routers/categories.js";
import subCategoriesRouter from "./routers/subcategories.js";
import customersRouter from "./routers/customers.js";
import suppliersRouter from "./routers/suppliers.js";
import productsRouter from "./routers/products.js";
import productVariantsRouter from "./routers/product.variants.js";
import employeesRouter from "./routers/employees.js";
import ordersRouter from "./routers/orders.js";
const app = express();
/*Middleware này sẽ giúp bạn chuyển đổi các dữ liệu truyền lên bằng phương thức POST thành một object JavaScript để sử dụng*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/* có thể dùng middleware này để phân tích được JSON (application/json)*/
/* app.use(express.json());
// app.use(express.urlencoded({ extended: false }));*/

app.use(
  cors({
    // origin: "*",
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    methods: "GET,POST,PATCH,DELETE,PUT",
    credentials: true,
  })
);

const PORT = process.env.PORT || 9000;
const connectDB = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
connectDB(); //call function connectDB()

app.use("/categories", categoriesRouter);
app.use("/sub-categories", subCategoriesRouter);
app.use("/customers", customersRouter);
app.use("/suppliers", suppliersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/variants-p", productVariantsRouter);
app.use("/employees", employeesRouter);
