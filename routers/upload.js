import express from "express";
// import { uploadImageMiddleware } from "../middlewares/uploadImage.js";
import uploadCloud from "../configs/cloudinary.config.js";
import { uploadImage } from "../controllers/upload.js";

const router = express.Router();

router.post("/:collectionName/:id", uploadCloud.single("file"), uploadImage);

export default router;
