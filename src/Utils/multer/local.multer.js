// ==================== Module Imports & Dependencies ====================

import multer from "multer";
import path from "node:path";
import fs from "node:fs";


// ==================== Allowed File MIME Types Validation ====================

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


// ==================== Local Multer Upload Configuration Factory ====================

export const localUploadMulter =({
    customPath = "general",validation =[]}) =>{


    // ==================== Base Upload Path Definition ====================

    const basePath = `uploads/${customPath}`;


    // ==================== Disk Storage Configuration ====================

    const storage = multer.diskStorage({


        // ==================== Destination Folder Logic (User-Specific) ====================

        destination: (req, file ,cb) =>{
            let userBasePath =basePath;
            if(req.user?._id) userBasePath += `/${req.user?._id}`;
            const fullPath = path.resolve(`./src/${userBasePath}`)

            if(!fs.existsSync(fullPath)) fs.mkdirSync(fullPath , {recursive:true});//عشان اي  parent folder مش متكريت يروح يكريته الاول ثم يكريت الchild بتاعه
            cb(null ,fullPath);
            // cb(null ,path.resolve("./src/uploads"));
        },


        // ==================== Unique Filename Generation ====================

        filename:(req , file ,cb)=>{
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+"-"+ file.originalname;
            file.finalPath = `${basePath}/${req.user._id}/${uniqueSuffix}`;
            cb(null ,uniqueSuffix)
        },
    });


    // ==================== File Type Validation Filter ====================

    const fileFilter = (req,file,cb) =>{
        if(validation.includes(file.mimetype)) {
            cb(null,true);
        }else {
            cb(new Error("invalied File Type"), false);
        }
    };


    // ==================== Return Configured Multer Instance ====================

    return multer({fileFilter,storage});
};