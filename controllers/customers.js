import Customer from "../models/Customer.js";
import moment from "moment";

// GETS
export const getCustomers = (req, res, next) => {
  try {
    Customer.find()
      .sort({ lastName: 1 })
      .then((result) => {
        const formattedResult = result.map((customer) => {
          const formattedCreatedAt = moment(customer.createdAt).format(
            "YYYY/MM/DD HH:mm:ss"
          );
          const formattedUpdatedAt = moment(customer.updatedAt).format(
            "YYYY/MM/DD HH:mm:ss"
          );
          const formattedBirthDay = moment(customer.birth_day).format(
            "YYYY/MM/DD HH:mm:ss"
          );
          return {
            ...customer.toObject(),
            birth_day: formattedBirthDay,
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

// GET BY ID
export const getByIdCustomer = (req, res, next) => {
  if (req.params.id === "search") {
    next();
    return;
  }
  try {
    const { id } = req.params;
    Customer.findById(id).then((result) => {
      const formattedCreatedAt = moment(result.createdAt).format(
        "YYYY/MM/DD HH:mm:ss"
      );
      const formattedUpdatedAt = moment(result.updatedAt).format(
        "YYYY/MM/DD HH:mm:ss"
      );
      const formattedBirthDay = moment(result.birth_day).format(
        "YYYY/MM/DD HH:mm:ss"
      );
      res.status(200).send({
        ...result.toObject(),
        birth_day: formattedBirthDay,
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt,
      });
    });
  } catch (error) {
    console.log("error", error);
    res.sendStatus(500);
  }
};

// GET BY QUERY STRING
export const search = (req, res, next) => {
  const { id, firstName, lastName } = req.query;
  console.log(`id: ${id}`);
  res.send("OK query string");
};

// POST
export const postCustomer = async (req, res, next) => {
  try {
    const data = req.body;
    //check whether this current user exists in our database
    const user = await Customer.findOne({
      email: data.email,
    });
    if (user) {
      res.status(406).send({ msg: "Tài khoản email đã tồn tại!" });
      return;
    }
    // create a new customer
    const newItem = new Customer(data);
    newItem.save().then((result) => {
      res.send(result);
      return;
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// PATCH BY ID
export const updateCustomer = (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    Customer.findByIdAndUpdate(id, data, {
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
export const deleteCustomer = (req, res, next) => {
  try {
    const { id } = req.params;
    Customer.findByIdAndDelete(id).then((result) => {
      res.send(result);
      return;
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
};

/* có thể dùng cách này đối với đoạn mã postCustomer */
/* export const postCustomer = (req, res, next) => {
  try {
    const data = req.body;
    const newItem = new Customer(data);
    newItem.save().then((result) => {
      const formattedResult = {
        ...result._doc,
        createdAt: moment(result.createdAt).format("YYYY/MM/DD HH:mm:ss"),
        updatedAt: moment(result.updatedAt).format("YYYY/MM/DD HH:mm:ss"),
      };
      res.send(formattedResult);
    });
    //  hoặc
    // newItem.save().then((result) => {
    //   const formattedCreatedAt = moment(result.createdAt).format(
    //     "YYYY/MM/DD HH:mm:ss"
    //   );
    //   const formattedUpdatedAt = moment(result.updatedAt).format(
    //     "YYYY/MM/DD HH:mm:ss"
    //   );
    //   res.status(200).send({
    //     ...result.toObject(),
    //     createdAt: formattedCreatedAt,
    //     updatedAt: formattedUpdatedAt,
    //   });
    // });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  } */

/* 
Trong đoạn mã trên, result._doc là đối tượng kết quả trả về sau khi lưu thành công, moment(result.createdAt) sẽ trả về một đối tượng moment từ giá trị của trường createdAt, và moment(result.createdAt).format("YYYY/MM/DD HH:mm:ss") sẽ trả về một chuỗi định dạng ngày giờ theo yêu cầu. Tương tự với trường updatedAt.
Lưu ý rằng các trường createdAt và updatedAt được tự động tạo bởi timestamps của mongoose, vì vậy bạn không cần phải ghi đè lên chúng trước khi lưu dữ liệu.
*/
// };
