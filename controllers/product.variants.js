import ProductVariant from "../models/ProductVariant.js";
import moment from "moment";

// GETS
export const getProductVariants = (req, res, next) => {
  try {
    ProductVariant.find()
      .populate("product")
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
    ProductVariant.findById(id)
      // .populate("product")
      .then((result) => {
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

export const getVariant = function (req, res, next) {
  try {
    const id = req.params.id;
    ProductVariant.findById(id).then((result) => {
      console.log("result", result);
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
// export const updateProductVariant = async (req, res, next) => {
//   try {
//     const data = await ProductVariant.findById(req.params.id);
//     if (!data) {
//       return res.status(404).json({ error: "Không tìm thấy dữ liệu" });
//     }
//     console.log(data);
//     console.log("req.body: ", req.body);
//     // Sao chép thuộc tính từ object nhận được từ client và gán vào đối tượng data
//     Object.assign(data, req.body);
//     await data.save();
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: "Lỗi server" });
//   }
// };
export const updateProductVariant = async (req, res) => {
  try {
    const items = req.body.variants; // Mảng các bản ghi
    // console.log("req.body", items);
    // Sử dụng bulkWrite để cập nhật nhiều bản ghi cùng lúc
    const result = await ProductVariant.bulkWrite(
      items.map((item) => ({
        updateOne: {
          filter: { _id: item._id }, // ID của bản ghi cần cập nhật
          update: { $set: item }, // Các trường cần cập nhật
        },
      }))
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Lỗi cập nhật nhiều bản ghi" });
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
