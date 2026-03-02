import multer from "multer";
import path from "node:path";
import fs from "node:fs";


export const fileValidation = {
    images: ["image/jpeg", "image/jpg", "image/png", "image/webp"], // Added webp (common)
    videos: ["video/mp4", "video/mpeg", "video/quicktime"],
    audios: ["audio/mpeg", "audio/mp4", "audio/wav"],
    documents: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "text/csv",
    ],
};

export const localUploadMulter =({
    customPath = "general",validation =[]}) =>{
const basePath = `uploads/${customPath}`;
const storage = multer.diskStorage({
    destination: (req, file ,cb) =>{
let userBasePath =basePath;
if(req.user?._id) userBasePath += `/${req.user?._id}`;
const fullPath = path.resolve(`./src/${userBasePath}`)

if(!fs.existsSync(fullPath)) fs.mkdirSync(fullPath , {recursive:true});//عشان اي  parent folder مش متكريت يروح يكريته الاول ثم يكريت الchild بتاعه
 cb(null ,fullPath);
   // cb(null ,path.resolve("./src/uploads"));
    },

    filename:(req , file ,cb)=>{
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+"-"+ file.originalname;
file.finalPath = `${basePath}/${req.user._id}/${uniqueSuffix}`;
        cb(null ,uniqueSuffix)
    },
});

const fileFilter = (req,file,cb) =>{
    if(validation.includes(file.mimetype)) {
        cb(null,true);
    }else {
        cb(new Error("invalied File Type"), false);
    }
};
    return multer({fileFilter,storage});
};