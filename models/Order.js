import mongoose from "mongoose";
const { Schema, model } = mongoose;
import moment from "moment";
const orderDetailSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "products", required: true },
  quantity: { type: Number, require: true, min: 0 },
});
orderDetailSchema.virtual("product", {
  ref: "products",
  localField: "product_id",
  foreignField: "_id",
  justOne: true,
});
orderDetailSchema.set("toJSON", { virtuals: true });
orderDetailSchema.set("toObject", { virtuals: true });

const orderSchema = new Schema(
  {
    //Khi nhập thì nhập "dd/mm/yyyy"
    shipped_date: {
      type: String,
      default: function () {
        return moment().add(1, "hour").format("DD/MM/YYYY");
      },
      //cộng thên 1 giờ để lớn hơn ngày tạo đơn hàng
      validate: {
        validator: function (value) {
          if (!value) return false;
          // if (
          //   moment(value, "DD/MM/YYYY").isValid() &&
          //   moment(value, "DD/MM/YYYY").isSameOrAfter(this.createdAt)
          //   // Kiểm tra dữ liệu có đúng ngày tháng năm hay không
          //   // và kiểm tra ngày đó cùng ngày hoặc sau ngày tạo không
          // ) {
          //   return true;
          // } else {
          //   return false;
          // }
          const createdDate = moment(this.createdAt).startOf("day");
          const shippedDate = moment(value, "DD/MM/YYYY")
            .startOf("day")
            .add(1, "hour");
          //lấy ngày default để so sánh
          return shippedDate.isAfter(createdDate);
        },
        message: "Ngày vận chuyển không hợp lệ hoặc nhỏ hơn ngày tạo đơn hàng!",
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

    shipping_information: {
      type: String,
      required: [true, "Địa chỉ giao hàng bắt buộc phải nhập"],
    },
    shipping_city: {
      type: String,
      required: [true, "Thành phố bắt buộc phải nhập"],
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        },
        message: `{VALUE} không phải là email hợp lệ`,
        // message: (props) => `{props.value} is not a valid email!`,
      },
      unique: [true, "email đã tồn tại"],
    },
    payment_information: {
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
      required: false,
    },

    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: false,
    },

    first_name: {
      type: String,
      required: [true, "Họ - Tên đệm bắt buộc phải nhập"],
    },

    last_name: {
      type: String,
      required: [true, "Tên bắt buộc phải nhập"],
    },
    phoneNumber: {
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
  },
  { timestamps: true } /* tự động tạo 2 field createdAt - updatedAt */
);
orderSchema.virtual("full_name").get(function () {
  return this.first_name + " " + this.last_name;
});
orderSchema.virtual("full_address").get(function () {
  return this.shipping_information + " " + this.shipping_city;
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

const Order = model("orders", orderSchema);

export default Order;
