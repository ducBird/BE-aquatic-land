import Supplier from "../models/Supplier.js";
import moment from "moment";

// GETS
export const getSuppliers = (req, res, next) => {
  try {
    Supplier.find()
      .sort({ name: 1 })
      .then((result) => {
        const formattedResult = result.map((supplier) => {
          const formattedCreatedAt = moment(supplier.createdAt).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          const formattedUpdatedAt = moment(supplier.updatedAt).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          return {
            ...supplier.toObject(),
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
export const getByIdSupplier = (req, res, next) => {
  if (req.params.id === "search") {
    next();
    return;
  }
  try {
    const { id } = req.params;
    Supplier.findById(id).then((result) => {
      const formattedCreatedAt = moment(result.createdAt).format(
        "DD/MM/YYYY-HH:mm:ss"
      );
      const formattedUpdatedAt = moment(result.updatedAt).format(
        "DD/MM/YYYY-HH:mm:ss"
      );
      res.status(200).send({
        ...result.toObject(),
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
  const { id, name } = req.query;
  console.log(`id: ${id}`);
  res.send("OK query string");
};

// POST
export const postSupplier = async (req, res, next) => {
  try {
    const data = req.body;
    //check whether this current supp exists in our database
    const supp = await Supplier.findOne({
      email: data.email,
    });
    if (supp) {
      res.status(406).send({ msg: "Tài khoản email đã tồn tại!" });
      return;
    }
    // create a new supplier
    const newItem = new Supplier(data);
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
export const updateSupplier = (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    Supplier.findByIdAndUpdate(id, data, {
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
export const deleteSupplier = (req, res, next) => {
  try {
    const { id } = req.params;
    Supplier.findByIdAndDelete(id).then((result) => {
      res.send(result);
      return;
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
};
