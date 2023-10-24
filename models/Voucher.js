import mongoose from "mongoose";

const { Schema, model } = mongoose;

const voucherSchema = new Schema(
  {
    name: { type: String, required: [true, "Tên voucher bắt buộc nhập"] },
    price_voucher: {
      type: Number,
      required: [true, "Giá voucher bắt buộc nhập"],
    },
  },
  /* tự động tạo 2 field createdAt - updatedAt */
  { timestamps: true }
);

const Voucher = model("vouchers", voucherSchema);
export default Voucher;
