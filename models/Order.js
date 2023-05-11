import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

// ========================Begin OrderDetail================================
const orderDetailSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "products", required: true },
  quantity: { type: Number, require: true, min: 0 },
});
// Virtual with Populate
orderDetailSchema.virtual("product", {
  ref: "products",
  localField: "product_id",
  foreignField: "_id",
  justOne: true,
});
orderDetailSchema.set("toJSON", { virtuals: true });
orderDetailSchema.set("toObject", { virtuals: true });
// ========================End OrderDetail================================

// ========================Begin Order================================
const orderSchema = new Schema({
  shipped_date: {
    type: Date,
    validate: {
      validator: function (value) {
        if (!value) return true;
        if (value < this.createdDate) {
          return false;
        }
        return true;
      },
      message: `Ngày vận chuyển: {VALUE} không hợp lệ!`,
    },
  },
  status: {
    type: String,
    required: [true, "Trạng thái bắt buộc phải nhập"],
    default: "WAITING CONFIRMATION ORDER",
    validate: {
      validator: (value) => {
        if (
          [
            "WAITING CONFIRMATION ORDER",
            "CONFIRMED ORDER",
            "SHIPPING CONFIRMATION",
            "DELIVERY IN PROGRESS",
            "DELIVERY SUCCESS",
            "RECEIVED ORDER",
            "CANCELED ORDER",
          ].includes(value)
        ) {
          return true;
        }
        return false;
      },
      message: `Trạng thái: {VALUE} không hợp lệ!`,
    },
  },

  description: String,

  shipping_address: {
    type: String,
    required: [true, "Địa chỉ giao hàng bắt buộc phải nhập"],
  },

  payment_type: {
    type: String,
    required: [true, "Hình thức thanh toán bắt buộc phải nhập"],
    default: "CASH",
    validate: {
      validator: (value) => {
        if (["CASH", "VNPAY", "MOMO"].includes(value.toUpperCase())) {
          return true;
        }
        return false;
      },
      message: `Hình thức thanh toán: {VALUE} không hợp lệ!`,
    },
  },

  image_confirm: {
    type: String,
    required: true,
  },

  customer_id: {
    type: Schema.Types.ObjectId,
    ref: "customers",
    required: false,
  },

  // tên
  full_name: {
    type: String,
    required: false,
  },

  // số điện thoại
  phone_number: {
    type: String,
    required: false,
  },

  employee_id: {
    type: Schema.Types.ObjectId,
    ref: "employees",
    required: false,
  },

  order_details: [orderDetailSchema],

  is_delete: { type: Boolean, default: false },
});

// Virtual with Populate
orderSchema.virtual("customer", {
  ref: "customers",
  localField: "customer_id",
  foreignField: "_id",
  justOne: true,
});

orderSchema.virtual("employee", {
  ref: "employees",
  localField: "employee_id",
  foreignField: "_id",
  justOne: true,
});
orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });
// ========================End Order================================

const Order = model("orders", orderSchema);

export default Order;
