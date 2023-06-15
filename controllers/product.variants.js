import ProductVariant from "../models/ProductVariant.js";
import moment from "moment";

// GETS
export const getProductVariants = (req, res, next) => {
  try {
    ProductVariant.find()
      // .populate("product")
      .then((result) => {
        const formattedResult = result.map((product) => {
          const formattedCreatedAt = moment(product.createdAt).format(
            "YYYY/MM/DD HH:mm:ss"
          );
          const formattedUpdatedAt = moment(product.updatedAt).format(
            "YYYY/MM/DD HH:mm:ss"
          );
          return {
            ...product.toObject(),
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

// GET BY ID PRODUCT
export const getVariantsByProductId = (req, res, next) => {
  const { product_id } = req.params;
  if (product_id === "search") {
    next();
    return;
  }
  try {
    ProductVariant.find({ product_id: product_id })
      // .populate("product")
      .then((result) => {
        const formattedResult = result.map((variant) => {
          const formattedCreatedAt = moment(variant.createdAt).format(
            "YYYY/MM/DD HH:mm:ss"
          );
          const formattedUpdatedAt = moment(variant.updatedAt).format(
            "YYYY/MM/DD HH:mm:ss"
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

// GET BY ID VARIANT PRODUCT
export const getByIdProductVariant = function (req, res, next) {
  try {
    const id = req.params.id;
    Product.findById(id).then((result) => {
      // console.log(result);
      res.send(result);
      return;
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
};

// GET BY QUERY STRING
export const search = (req, res, next) => {
  const { id, firstName, lastName } = req.query;
  console.log(`id: ${id}`);
  res.send("OK query string");
};

// POST
export const postProductVariant = async (req, res, next) => {
  try {
    const data = req.body;
    const newItem = new ProductVariant(data);
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
export const updateProductVariant = (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    ProductVariant.findByIdAndUpdate(id, data, {
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
export const deleteProductVariant = (req, res, next) => {
  try {
    const { id } = req.params;
    ProductVariant.findByIdAndDelete(id).then((result) => {
      res.send(result);
      return;
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
};
