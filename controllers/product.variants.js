import ProductVariant from "../models/ProductVariant.js";
import Product from "../models/Product.js";
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

// update just options
// export const updateProductVariant = async (req, res) => {
//   try {
//     const items = req.body.variants; // Mảng các bản ghi
//     // console.log("req.body", items);
//     // Sử dụng bulkWrite để cập nhật nhiều bản ghi cùng lúc
//     const result = await ProductVariant.bulkWrite(
//       items.map((item) => ({
//         updateOne: {
//           filter: { _id: item._id }, // ID của bản ghi cần cập nhật
//           update: { $set: item }, // Các trường cần cập nhật
//         },
//       }))
//     );
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error: "Lỗi cập nhật nhiều bản ghi" });
//   }
// };

export const updateProductVariant = async (req, res) => {
  try {
    const items = req.body.values.variants; // Mảng các bản ghi từ client
    // console.log("items", items);
    // Lấy danh sách các _id trong mảng items (variants) được gửi từ client
    const itemIds = items.map((item) => item._id);
    // console.log("itemIds", itemIds);
    // Lấy danh sách các _id variant trong database dựa trên product_id
    const existingItemIds = await Product.find({
      _id: { $in: req.body.product_id },
    }).then((result) => {
      return result[0].variants;
    });
    // console.log("existingItemIds", existingItemIds);
    // Lấy danh sách các _id không tồn tại trong mảng items mà client gửi về
    const nonExistingItemIds = existingItemIds
      .map((item) => item._id.toString())
      .filter((id) => !itemIds.includes(id));
    // console.log("nonExistingItemIds", nonExistingItemIds);
    // Lấy danh sách các _id tồn tại trong mảng items trừ _id không tồn tại ở trong mảng items
    const itemIdVariantsInProduct = existingItemIds
      .map((item) => item._id.toString())
      .filter((id) => itemIds.includes(id));
    // console.log("itemIdVariantsInProduct", itemIdVariantsInProduct);
    // Lấy danh sách các bản ghi mới
    const newItems = items.filter((item) => {
      if (!item._id) return item;
    });
    // console.log("newItems", newItems);
    // Xóa hết nếu items mà client gửi về là một mảng rỗng
    if (items.length === 0) {
      nonExistingItemIds.forEach(async (id) => {
        await ProductVariant.deleteOne({ _id: id });
        await Product.updateOne(
          { _id: req.body.product_id },
          { variants: itemIdVariantsInProduct }
        );
      });
    } else {
      // Cập nhật các bản ghi có _id nằm trong mảng items
      // const updatePromises =
      items.map(async (item) => {
        const updateData = { ...item };
        // console.log("updateData", updateData);
        delete updateData._id; // Xóa trường _id để tránh ghi đè trong quá trình cập nhật
        await ProductVariant.updateOne({ _id: item._id }, { $set: updateData });
      });

      // Xóa các bản ghi có _id không tồn tại trong mảng items
      // const deletePromises =
      nonExistingItemIds.map(async (id) => {
        // xóa variants không tồn tại ở value mà client gửi về
        await ProductVariant.deleteOne({ _id: id });
        // cập nhập lại mảng variants trong ở record product
        await Product.updateOne(
          { _id: req.body.product_id },
          { variants: itemIdVariantsInProduct }
        );
      });

      // Thêm các bản ghi mới có _id không nằm trong danh sách các _id hiện có trong items
      if (newItems.length > 0) {
        // const insertPromises =
        newItems.map(async (newItem) => {
          Object.assign(newItem, { product_id: req.body.product_id });
          const newVariant = new ProductVariant(newItem);
          await newVariant.save();
          // console.log("newVariant", newVariant);
          itemIdVariantsInProduct.push(newVariant._id);
          await Product.updateOne(
            { _id: req.body.product_id },
            { variants: itemIdVariantsInProduct }
          );
        });
      }
      // Chạy các promises để cập nhật và xóa bản ghi
      // await Promise.all([
      //   ...updatePromises,
      //   ...deletePromises,
      //   ...insertPromises,
      // ]);
    }
    const result = await ProductVariant.find({
      product_id: req.body.product_id,
    });
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
