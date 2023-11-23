import { query } from "express";
import { findDocuments } from "../helpers/MongoDbHelper.js";
import Order from "../models/Order.js";
import moment from "moment";

//Get
export const getOrder = async (req, res, next) => {
  try {
    // Order.find()
    //   .sort({ lastName: 1 })
    //   .then((result) => {
    //     const formattedResult = result.map((employee) => {
    //       const formattedCreatedAt = moment(employee.createdAt).format(
    //         "DD/MM/YYYY-HH:mm:ss"
    //       );
    //       const formattedUpdatedAt = moment(employee.updatedAt).format(
    //         "DD/MM/YYYY-HH:mm:ss"
    //       );
    //       return {
    //         ...employee.toObject(),
    //         createdAt: formattedCreatedAt,
    //         updatedAt: formattedUpdatedAt,
    //       };
    //     });
    //     res.status(200).send(formattedResult);
    //   });
    Order.find()
      .sort({ createdAt: -1 })
      .populate("order_details.product")
      .populate("order_details.variants")
      .populate("customer")
      .populate("employee")
      .then((result) => {
        const formattedResult = result.map((order) => {
          const formattedCreatedAt = moment(order.createdAt).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          const formattedUpdatedAt = moment(order.updatedAt).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          const formattedShippedDate = moment(order.shipped_date).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          return {
            ...order.toObject(),
            createdAt: formattedCreatedAt,
            updatedAt: formattedUpdatedAt,
            shipped_date: formattedShippedDate,
          };
        });
        res.status(200).send(formattedResult);
      });
  } catch (error) {
    res.sendStatus(500);
  }
};

//Get id
export const getOrderId = (req, res, next) => {
  try {
    const orderId = req.params.id;
    Order.findById(orderId)
      .populate("order_details.product")
      .populate("order_details.variants")
      .populate("customer")
      .then((result) => {
        const formattedResult = result.map((order) => {
          const formattedCreatedAt = moment(order.createdAt).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          const formattedUpdatedAt = moment(order.updatedAt).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          const formattedShippedDate = moment(order.shipped_date).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          return {
            ...order.toObject(),
            createdAt: formattedCreatedAt,
            updatedAt: formattedUpdatedAt,
            shipped_date: formattedShippedDate,
          };
        });
        res.status(200).send(formattedResult);
      });
  } catch (error) {
    res.sendStatus(500);
  }
};

// POST
export const postOrder = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);
    const newItem = new Order(data);
    newItem.save().then((result) => {
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

//Patch Id
export const updateOrder = (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    console.log(data.order_details);
    Order.findByIdAndUpdate(id, data, {
      new: true,
    }).then((result) => {
      // xử lý cập nhật số lượng khi đặt hàng thành công
      if (data.status === "WAITING FOR PICKUP") {
      }
      res.status(200).send(result);
      return;
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
};

// DELETE BY ID
export const deleteOrder = (req, res, next) => {
  try {
    const { id } = req.params;
    Order.findByIdAndDelete(id).then((result) => {
      res.send(result);
      return;
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
};

// query theo hình thức thanh toán
export const orderByPaymentInformation = (req, res, next) => {
  try {
    let { payment_information, fromDate, toDate } = req.body;
    fromDate = new Date(fromDate);
    toDate = new Date(toDate);

    const comparePaymentInformation = {
      $eq: ["$payment_information", payment_information],
    };
    const compareFromDate = {
      $gte: ["$createdAt", new Date(fromDate.setHours(0, 0, 0, 0))],
    };

    const compareToDate = {
      $lte: ["$createdAt", new Date(toDate.setHours(23, 59, 59, 999))],
    };

    Order.aggregate([
      {
        $match: {
          $expr: {
            $and: [comparePaymentInformation, compareFromDate, compareToDate],
          },
        },
      },
    ])
      .then((result) => {
        Order.populate(result, [
          { path: "customer" },
          {
            path: "order_details.product",
          },
        ])
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(400).send({ message: err.message });
          });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// query theo trạng thái thanh toán
export const orderByPaymentStatus = (req, res, next) => {
  try {
    let { payment_status, fromDate, toDate } = req.body;
    fromDate = new Date(fromDate);
    toDate = new Date(toDate);
    const parsedPaymentStatus = payment_status === "true";
    const comparePaymentStatus = {
      $eq: ["$payment_status", parsedPaymentStatus],
    };
    // const compareFromDate = {
    //   $and: [
    //     { $gte: [{ $dayOfMonth: "$createdAt" }, { $dayOfMonth: fromDate }] },
    //     { $gte: [{ $month: "$createdAt" }, { $month: fromDate }] },
    //     { $gte: [{ $year: "$createdAt" }, { $year: fromDate }] },
    //   ],
    // };
    // const compareToDate = {
    //   $and: [
    //     { $lte: [{ $dayOfMonth: "$createdAt" }, { $dayOfMonth: toDate }] },
    //     { $lte: [{ $month: "$createdAt" }, { $month: toDate }] },
    //     { $lte: [{ $year: "$createdAt" }, { $year: toDate }] },
    //   ],
    // };
    const compareFromDate = {
      $gte: ["$createdAt", new Date(fromDate.setHours(0, 0, 0, 0))],
    };

    const compareToDate = {
      $lte: ["$createdAt", new Date(toDate.setHours(23, 59, 59, 999))],
    };

    Order.aggregate([
      {
        $match: {
          $expr: {
            $and: [comparePaymentStatus, compareFromDate, compareToDate],
          },
        },
      },
    ])
      .then((result) => {
        Order.populate(result, [
          { path: "customer" },
          {
            path: "order_details.product",
          },
        ])
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(400).send({ message: err.message });
          });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// truy vấn một điều kiện
export const queryOne = (req, res, next) => {
  let { status, payment_information, payment_status } = req.body;
  let query = {};
  if (status) {
    query = { status: status };
  } else if (payment_information) {
    query = { payment_information: payment_information };
  } else if (payment_status) {
    if (payment_status === "true") {
      payment_status = true;
      query = { payment_status: payment_status };
    } else if (payment_status === "false") {
      payment_status = false;
      query = { payment_status: payment_status };
    }
  }
  console.log("body", req.body);
  console.log(query);
  try {
    Order.find(query)
      .populate("order_details.product")
      .populate("customer")
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
};

export const orderByStatus = (req, res, next) => {
  try {
    let { status, fromDate, toDate } = req.body;
    fromDate = new Date(fromDate);
    toDate = new Date(toDate);
    console.log("fromDate: ", fromDate);
    console.log("toDate: ", toDate);
    console.log("status: ", status);
    const compareStatus = { $eq: ["$status", status] };
    const compareFromDate = {
      $gte: ["$createdAt", new Date(fromDate.setHours(0, 0, 0, 0))],
    };

    const compareToDate = {
      $lte: ["$createdAt", new Date(toDate.setHours(23, 59, 59, 999))],
    };

    Order.aggregate([
      {
        $match: {
          $expr: { $and: [compareStatus, compareFromDate, compareToDate] },
        },
      },
    ])
      .then((result) => {
        Order.populate(result, [
          { path: "customer" },
          {
            path: "order_details.product",
          },
        ])
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(400).send({ message: err.message });
          });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
// hiển thị đơn hàng có trạng thái đơn hàng từ ngày đến ngày
// export const queryOrderStatusFromdaytoday = (req, res, next) => {
//   try {
//     let { status, fromDate, toDate } = req.body;
//     fromDate = new Date(fromDate);
//     toDate = new Date(toDate);

//     const compareStatus = { $eq: ["$status", status] };
//     const compareFromDate = {
//       $and: [
//         { $gte: [{ $dayOfMonth: "$createdAt" }, { $dayOfMonth: fromDate }] },
//         { $gte: [{ $month: "$createdAt" }, { $month: fromDate }] },
//         { $gte: [{ $year: "$createdAt" }, { $year: fromDate }] },
//       ],
//     };
//     const compareToDate = {
//       $and: [
//         { $lte: [{ $dayOfMonth: "$createdAt" }, { $dayOfMonth: toDate }] },
//         { $lte: [{ $month: "$createdAt" }, { $month: toDate }] },
//         { $lte: [{ $year: "$createdAt" }, { $year: toDate }] },
//       ],
//     };

//     Order.aggregate([
//       {
//         $match: {
//           $expr: { $and: [compareStatus, compareFromDate, compareToDate] },
//         },
//       },
//     ])
//       .project({
//         _id: 1,
//         status: 1,
//         createdAt: 1,
//       })
//       .then((result) => {
//         Order.populate(result, [])
//           .then((data) => {
//             res.send(data);
//           })
//           .catch((err) => {
//             res.status(400).send({ message: err.message });
//           });
//       })
//       .catch((err) => {
//         res.status(400).send({ message: err.message });
//       });
//   } catch (err) {
//     console.log(err);
//     res.sendStatus(500);
//   }
// };

// query đơn hàng từ ngày đến ngày
export const orderFromdayToday = (req, res, next) => {
  try {
    let { fromDate, toDate } = req.body;
    console.log("fromDate", fromDate);
    console.log("toDate", toDate);
    fromDate = new Date(fromDate);
    fromDate.setUTCHours(0, 0, 0, 0);
    toDate = new Date(toDate);
    toDate.setUTCHours(23, 59, 59, 999);
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
          },
        },
      },
    ])
      .then((result) => {
        Order.populate(result, [
          { path: "customer" },
          {
            path: "order_details.product",
          },
        ])
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(400).send({ message: err.message });
          });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
