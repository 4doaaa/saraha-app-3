import Joi from "joi";
import { fileValidation } from "../../Utils/multer/local.multer.js";
 import { generalFields } from "../../Middlewares/validation.middleware.js";


export const ProfileImageSchema = {
    file: Joi.object({
        fieldname: Joi.string().valid("profileImage").required(),
        originalname: Joi.string().required(),         
        encoding: Joi.string().optional(),
        mimetype: Joi.string()
            .valid(...fileValidation.images)
            .required(),
        size: Joi.number()
            .min(1)
            .max(5 * 1024 * 1024)                  
            .required(),
        destination: Joi.string().optional(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
    })
    .unknown(true)                                    
    .required()
};
export const coverImagesSchema = {
    files: Joi.array().items(  
        Joi.object({
            fieldname: Joi.string().valid("coverImages").required(), 
            originalname: Joi.string().required(),
            encoding: Joi.string().optional(),             
            mimetype: Joi.string().valid(...fileValidation.images).required(),
            size: Joi.number().max(5 * 1024 * 1024).required(),
            destination: Joi.string().optional(),
            filename: Joi.string().required(),
            path: Joi.string().required(),
        })
    )
    .min(1)           
    .max(4)          
    .required()
};

export const freezeAccountSchema = {
    params: Joi.object({
        userId: generalFields.id,
    }),
};