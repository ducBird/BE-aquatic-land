import mongoose from "mongoose";

const { Schema, model } = mongoose;

const optionSchema = new Schema(
  {
    value: {
      type: String, //s,m,l || red, blue
    },
    add_valuation: {
      type: Number,
    },
    inventory_quantity: {
      type: Number,
      required: [true, "inventory_quantity is required"],
      min: [0, "inventory_quantity must be greater than 0"],
    },
    images: {
      type: String,
    },
  },
  { timestamps: true }
);

const productVariantSchema = new Schema(
  {
    title: {
      type: String, //size, color
      required: true,
    },
    price_adjustment: {
      type: Number,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    options: {
      type: [optionSchema],
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "products",
    },
    is_delete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

productVariantSchema.virtual("product", {
  ref: "products",
  localField: "product_id",
  foreignField: "_id",
  justOne: true,
});

productVariantSchema.set("toJSON", { virtuals: true });
productVariantSchema.set("toObject", { virtuals: true });

const ProductVariant = model("product_variants", productVariantSchema);

export default ProductVariant;
