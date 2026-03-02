import Joi from "joi";
import { genderEnum } from "../DB/Models/user.model.js";
import { Types } from "mongoose";

export const generalFields = {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    id: Joi.string()
        .custom((value, helper) => {
            return Types.ObjectId.isValid(value) || helper.message("Invalid ID");
        })
        .required(),
    otp: Joi.string().pattern(/^[a-zA-Z0-9]{6}$/).length(6),
    confirmPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({ "any.only": "Confirm password does not match password" }),
};

export const Validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];

        for (const key of Object.keys(schema)) {
            const joiSchema = schema[key];
            const dataToValidate = req[key] ?? req.body; // fallback لو الداتا في body

            const { error } = joiSchema.validate(dataToValidate, {
                abortEarly: false,
            });

            if (error) {
                validationErrors.push({
                    key,
                    details: error.details.map((detail) => detail.message),
                });
            }
        }

        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: "Validation Error",
                details: validationErrors,
            });
        }

        return next();
    };
};

export const signupSchema = {
    body: Joi.object({
        firstName: Joi.string()
            .min(2)
            .max(20)
            .required()
            .messages({
                "string.min": "First name must be at least 2 characters long",
                "string.max": "First name must be at most 20 characters long",
                "any.required": "First name is required",
            }),
        lastName: Joi.string()
            .min(2)
            .max(20)
            .required()
            .messages({
                "string.min": "Last name must be at least 2 characters long",
                "string.max": "Last name must be at most 20 characters long",
                "any.required": "Last name is required",
            }),
        email: Joi.string()
            .email({
                minDomainSegments: 2,
                tlds: { allow: ["com", "net", "io", "org"] },
            })
            .required()
            .messages({
                "string.email": "Please enter a valid email address",
                "any.required": "Email is required",
            }),
        password: Joi.string().min(6).required().messages({
            "string.min": "Password must be at least 6 characters long",
            "any.required": "Password is required",
        }),
        confirmPassword: Joi.any()
            .valid(Joi.ref("password"))
            .required()
            .messages({
                "any.only": "Confirm password does not match password",
                "any.required": "Confirm password is required",
            }),
        gender: Joi.string()
            .valid(...Object.values(genderEnum))
            .default(genderEnum.MALE),
        phone: Joi.string()
            .pattern(/^01[0125][0-9]{8}$/)
            .required()
            .messages({
                "string.pattern.base": "Please enter a valid Egyptian phone number",
                "any.required": "Phone number is required",
            }),
        otp: Joi.string(),
        id: Joi.string().custom((value, helper) => {
            return Types.ObjectId.isValid(value) || helper.message("Invalid ObjectId format");
        }),
    }),

    // File fields (لما برفع ملف مع الـ signup مثلاً profile picture)
    file: Joi.object({
        fieldname: Joi.string(),
        originalname: Joi.string(),
        encoding: Joi.string(),
        mimetype: Joi.string(),
        size: Joi.number().positive(),
        destination: Joi.string(),
        filename: Joi.string(),
        path: Joi.string(),
    }).optional(),
};

export const profileImageSchema = {
    file: Joi.object({
        size: Joi.number().positive().max(5 * 1024 * 1024).required(), // Optional: max 5MB
        path: Joi.string().required(),
        filename: Joi.string().required(),
        mimetype: Joi.string().valid("image/jpeg", "image/png", "image/jpg", "image/webp").required(),
        originalname: Joi.string().required(),
        fieldname: Joi.string().valid("profileImage").required(),
    }).unknown(true).required()
};

export const coverImagesSchema = {
    files: Joi.array().items(
        Joi.object({
            size: Joi.number().positive().max(5 * 1024 * 1024).required(),
            path: Joi.string().required(),
            filename: Joi.string().required(),
            mimetype: Joi.string().valid("image/jpeg", "image/png", "image/jpg", "image/webp").required(),
            originalname: Joi.string().required(),
            fieldname: Joi.string().valid("coverImages").required(),
        }).unknown(true)
    ).max(4).required()
};