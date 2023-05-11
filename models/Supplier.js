import mongoose from "mongoose";
const { Schema, model } = mongoose;

const supplierSchema = new Schema(
  {
    name: { type: String, required: [true, "Tên nhà cung cấp bắt buộc nhập"] },
    email: {
      type: String,
      required: [true, "Email bắt buộc nhập"],
      validate: {
        validator: function (value) {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        },
        message: `{VALUE} Email không hợp lệ!`,
        // message: (props) => `{props.value} is not a valid email!`,
      },
    },
    phone_number: {
      type: String,
      validate: {
        validator: function (value) {
          const phoneNumberRegex =
            /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneNumberRegex.test(value);
        },
        message: `{VALUE} Số điện thoại không hợp lệ`,
      },
    },
    address: { type: String, required: [true, "Địa chỉ bắt buộc nhập"] },
    affiliated_website: { type: String },
    is_delete: { type: Boolean, default: false },
  },
  { timestamps: true } /* tự động tạo 2 field createdAt - updatedAt */
);

const Supplier = model("suppliers", supplierSchema);

export default Supplier;
