import Product from "../models/Product.js";
import moment from "moment";

// GETS
export const getProducts = (req, res, next) => {
  try {
    Product.find()
      .sort({ name: 1 })
      // .populate("category")
      // .populate("supplier")
      .then((result) => {
        const formattedResult = result.map((product) => {
          const formattedCreatedAt = moment(product.createdAt).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          const formattedUpdatedAt = moment(product.updatedAt).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          const formattedDateOfmanufacture = moment(
            product.dateOfmanufacture
          ).format("DD/MM/YYYY-HH:mm:ss");
          const formattedExprirationDate = moment(
            product.exprirationDate
          ).format("DD/MM/YYYY-HH:mm:ss");
          return {
            ...product.toObject(),
            createdAt: formattedCreatedAt,
            updatedAt: formattedUpdatedAt,
            dateOfmanufacture: formattedDateOfmanufacture,
            exprirationDate: formattedExprirationDate,
          };
        });
        res.status(200).send(formattedResult);
      });
  } catch (error) {
    res.sendStatus(500);
  }
};

export const getProductsByIdCategory = (req, res, next) => {
  const { category_id } = req.params;
  if (category_id === "search") {
    next();
    return;
  }
  try {
    Product.find({ category_id })
      .populate("category")
      .then((result) => {
        const formattedResult = result.map((variant) => {
          const formattedCreatedAt = moment(variant.createdAt).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          const formattedUpdatedAt = moment(variant.updatedAt).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          return {
            ...variant.toObject(),
            createdAt: formattedCreatedAt,
            updatedAt: formattedUpdatedAt,
          };
        });
        res.status(200).send(formattedResult);
      });
  } catch (error) {
    console.log("error", error);
    res.sendStatus(500);
  }
};

export const getProductsByIdSubCategory = (req, res, next) => {
  const { sub_category_id } = req.params;
  if (sub_category_id === "search" || sub_category_id === "product") {
    next();
    return;
  }
  try {
    Product.find({ sub_category_id })
      .populate("sub_category")
      .then((result) => {
        const formattedResult = result.map((variant) => {
          const formattedCreatedAt = moment(variant.createdAt).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          const formattedUpdatedAt = moment(variant.updatedAt).format(
            "DD/MM/YYYY-HH:mm:ss"
          );
          return {
            ...variant.toObject(),
            createdAt: formattedCreatedAt,
            updatedAt: formattedUpdatedAt,
          };
        });
        res.status(200).send(formattedResult);
      });
  } catch (error) {
    console.log("error", error);
    res.sendStatus(500);
  }
};

// GET BY ID PRODUCT
export const getByIdProduct = (req, res, next) => {
  try {
    const { id } = req.params;
    Product.findById(id).then((result) => {
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
      return;
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
export const postProduct = async (req, res, next) => {
  try {
    const data = req.body;
    const newItem = new Product(data);
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
export const updateProduct = (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    Product.findByIdAndUpdate(id, data, {
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
export const deleteProduct = (req, res, next) => {
  try {
    const { id } = req.params;
    Product.findByIdAndDelete(id).then((result) => {
      res.send(result);
      return;
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
};
