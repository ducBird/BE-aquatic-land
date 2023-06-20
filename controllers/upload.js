import fs from "fs";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Employee from "../models/Employee.js";

export const uploadImage = async (req, res, next) => {
  try {
    const collectionName = req.params.collectionName; // Lấy tên collection từ đường dẫn URL
    const id = req.params.id; // Lấy giá trị id từ đường dẫn URL
    // console.log(req.file);
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    if (collectionName === "categories") {
      Category.findByIdAndUpdate(
        id,
        { image_url: req.file.path },
        {
          new: true,
        }
      ).then((result) => {
        // res.status(200).send(result); chỉ dùng để test api
        // res.json({ secure_url: req.file.path, msg: "Upload image sucess" }); chỉ dùng để test api
        return;
      });
    }
    if (collectionName === "employees") {
      Employee.findByIdAndUpdate(
        id,
        { avatar: req.file.path },
        {
          new: true,
        }
      ).then((result) => {
        // res.status(200).send(result); chỉ dùng để test api
        // res.json({ secure_url: req.file.path, msg: "Upload image sucess" }); chỉ dùng để test api
        return;
      });
    } else if (collectionName === "products") {
      Product.findByIdAndUpdate(
        id,
        { product_image: req.file.path },
        {
          new: true,
        }
      ).then((result) => {
        // res.status(200).send(result); chỉ dùng để test api
        // res.json({ secure_url: req.file.path, msg: "Upload image sucess" }); chỉ dùng để test api
        return;
      });
    } else {
      res.json({ msg: "CollectionName UnKnown" });
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
