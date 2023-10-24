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
          return {
            ...order.toObject(),
            createdAt: formattedCreatedAt,
            updatedAt: formattedUpdatedAt,
          };
        });
        res.status(200).send(formattedResult);
      });
  } catch (error) {
    res.sendStatus(500);
  }
};

//Get id
export const getOrderId = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("customer");
    res.send(order);
  } catch (error) {
    res.sendStatus(500);
  }
};

// POST
export const postOrder = async (req, res, next) => {
  try {
    const data = req.body;
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
    Order.findByIdAndUpdate(id, data, {
      new: true,
    }).then((result) => {
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
