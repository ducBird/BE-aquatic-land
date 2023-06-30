// import fs from "fs";

// export const uploadImageMiddleware = async function (req, res, next) {
//   try {
//     // if (!req.files || Object.keys(req.files).length === 0)
//     //   return res.status(400).json({ msg: "No files were uploaded." });

//     const file = req.files.file;

//     // if (file.size > 1024 * 1024) {
//     //   removeTmp(file.tempFilePath);
//     //   return res.status(400).json({ msg: "Size too large." });
//     // } // 1mb

//     // if (
//     //   file.mimetype !== "image/jpeg" &&
//     //   file.mimetype !== "image/png" &&
//     //   file.mimetype !== "image/jpg"
//     // ) {
//     //   removeTmp(file.tempFilePath);
//     //   return res.status(400).json({ msg: "File format is incorrect." });
//     // }

//     next();
//   } catch (err) {
//     return res.status(500).json({ msg: err.message });
//   }
// };

// const removeTmp = (path) => {
//   fs.unlink(path, (err) => {
//     if (err) throw err;
//   });
// };

// ---------------------------------------------------------------- //
// var upload = multer({
//   storage: multer.diskStorage({
//     contentType: multer.AUTO_CONTENT_TYPE,
//     destination: function (req, file, callback) {
//       const { id, collectionName } = req.params;

//       const PATH = `${UPLOAD_DIRECTORY}/${collectionName}/${id}`;
//       // console.log('PATH', PATH);
//       if (!fs.existsSync(PATH)) {
//         // Create a directory
//         fs.mkdirSync(PATH, { recursive: true });
//       }
//       callback(null, PATH);
//     },
//     filename: function (req, file, callback) {
//       // Xử lý tên file cho chuẩn
//       const fileInfo = path.parse(file.originalname);
//       const safeFileName =
//         fileInfo.name.replace(/[^a-z0-9]/gi, "_").toLowerCase() + fileInfo.ext;
//       // return
//       callback(null, safeFileName);
//     },
//   }),
// }).single("file");
