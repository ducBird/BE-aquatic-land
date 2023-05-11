import Employee from "../models/Employee.js";
import moment from "moment";

// GETS
export const getEmployees = (req, res, next) => {
  try {
    Employee.find()
      .sort({ lastName: 1 })
      .then((result) => {
        const formattedResult = result.map((employee) => {
          const formattedCreatedAt = moment(employee.createdAt).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          const formattedUpdatedAt = moment(employee.updatedAt).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          const formattedBirthDay = moment(employee.birthDay).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          return {
            ...employee.toObject(),
            birthDay: formattedBirthDay,
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
export const getByIdEmployee = (req, res, next) => {
  if (req.params.id === "search") {
    next();
    return;
  }
  try {
    const { id } = req.params;
    Employee.findById(id).then((result) => {
      const formattedCreatedAt = moment(result.createdAt).format(
        "DD/MM/YYYY-HH:mm:ss"
      );
      const formattedUpdatedAt = moment(result.updatedAt).format(
        "DD/MM/YYYY-HH:mm:ss"
      );
      const formattedBirthDay = moment(result.birthDay).format(
        "DD/MM/YYYY-HH:mm:ss"
      );
      res.status(200).send({
        ...result.toObject(),
        birthDay: formattedBirthDay,
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
export const postEmployee = async (req, res, next) => {
  try {
    const data = req.body;
    //check whether this current user exists in our database
    const user = await Employee.findOne({
      email: data.email,
    });
    if (user) {
      res.status(406).send({ msg: "Tài khoản email đã tồn tại!" });
      return;
    }
    // create a new employee
    const newItem = new Employee(data);
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
export const updateEmployee = (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    Employee.findByIdAndUpdate(id, data, {
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
export const deleteEmployee = (req, res, next) => {
  try {
    const { id } = req.params;
    Employee.findByIdAndDelete(id).then((result) => {
      res.send(result);
      return;
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
};
