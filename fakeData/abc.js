const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema(
  {
    position: { type: Number },
    src: { type: [String] },
  },
  {
    timestamps: true,
  }
);

const variantSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    inventory_quantity: {
      type: Number,
      required: [true, "inventory_quantity is required"],
      min: [0, "inventory_quantity must be greater than 0"],
    },
    price_adjustment: {
      type: Number,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    images: { type: [imageSchema] },
    option1: String,
    option2: String,
    option3: String,
  },
  {
    timestamps: true,
  }
);

const optionSchema = new Schema({
  name: String,
  id: Number,
  position: Number,
  product_id: Number,
});

const productSchema = new Schema({
  name: { type: String },
  discount: {
    type: Number,
    min: [0, "Discount must be greater than 0"],
    max: [100, "Discount must be less than 100"],
  },
  productImage: String,
  description: {
    type: String,
  },
  dateOfmanufacture: {
    type: Date,
    required: [true, "Ngày sản xuất bắt buộc phải nhập"],
    default: () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    // Có thể viết chi tiết như sau
    // default: function () {
    //   var date = new Date();
    //   var days = 30;
    //   var miliSecondsPerDay = 24 * 60 * 60 * 1000;
    //   var currentDate = date.getTime();
    //   var modifiedDate = new Date(currentDate - days * miliSecondsPerDay);
    //   return modifiedDate;
    // },
  },
  exprirationDate: {
    type: Date,
    required: [true, "Ngày hết hạn bắt buộc phải nhập"],
    default: () => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  sortOrder: { type: Number, default: 10 },
  variants: [variantSchema],
  options: [optionSchema],
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "categories",
    required: true,
  },
  supplierId: {
    type: Schema.Types.ObjectId,
    ref: "suppliers",
    required: true,
  },
  isDelete: { type: Boolean, default: false },
});

const Product = mongoose.model("Product", ProductSchema);
