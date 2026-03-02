import * as dbService from "../../DB/dbService.js";
import UserModel ,{roleEnum} from "../../DB/Models/user.model.js";
import { asymmetricDecript } from "../../Utils/Encryption/encryption.utils.js";
import { cloudinaryConfig } from "../../Utils/multer/cloudinary.config.js";
import { successResponse } from "../../Utils/successResponse.utils.js";

/**
 * List all users with decrypted phone numbers and populated messages
 */
export const listAllUsers = async (req, res, next) => {
    let users = await dbService.find({
        model: UserModel,
        populate: [{ path: "messages" }],
    });

    users = users.map((userDoc) => {
        const user = userDoc.toObject();

        // Decrypt phone if it's encrypted (format contains ':')
        if (user.phone && typeof user.phone === "string" && user.phone.includes(":")) {
            user.phone = asymmetricDecript(user.phone);
        }
        return user;
    });

    return successResponse({
        res,
        statuscode: 200,
        message: "Users Fetched Successfully",
        data: { users },
    });
};

/**
 * Update basic profile information (first name, last name, gender)
 */
export const updateProfile = async (req, res, next) => {
    const { firstName, lastName, gender } = req.body;
    const userId = req.user._id;

    const user = await dbService.findByIdAndUpdate({
        model: UserModel,
        id: userId,
        data: { firstName, lastName, gender, $inc: { __v: 1 } },
        new: true,
    });

    return successResponse({
        res,
        statuscode: 200,
        message: "Profile Updated Successfully",
        data: { user },
    });
};

/**
 * Upload and update profile image
 * - Uploads new image to Cloudinary
 * - Replaces old profile image in DB
 * - Deletes previous image from Cloudinary (with cache invalidation)
 */
export const ProfileImage = async (req, res, next) => {
    const userId = req.user._id;
    const oldPublicId = req.user.cloudProfileImage?.public_id; // Save old ID for deletion

    // Upload new image
    const { public_id, secure_url } = await cloudinaryConfig().uploader.upload(req.file.path, {
        folder: `SarahaApp/Users/${userId}`,
    });

    // Update user document with new image details
    const user = await dbService.findOneAndUpdate({
        model: UserModel,
        filter: { _id: userId },
        data: { cloudProfileImage: { public_id, secure_url } },
        new: true,
    });

    // Delete old image from Cloudinary if it exists (invalidate CDN cache)
    if (oldPublicId) {
        await cloudinaryConfig().uploader.destroy(oldPublicId, { invalidate: true });
    }

    return successResponse({
        res,
        statuscode: 200,
        message: "Profile Image Updated Successfully",
        data: { user },
    });
};

/**
 * Upload and update cover images (up to multiple)
 * - Uploads all new images to Cloudinary
 * - Replaces entire cover images array in DB
 * - Deletes all previous cover images from Cloudinary (with cache invalidation)
 */
export const coverImages = async (req, res, next) => {
    const userId = req.user._id;
    const oldCoverImages = req.user.cloudcoverImages || [];
    const oldPublicIds = oldCoverImages.map(img => img.public_id).filter(Boolean); // Collect old IDs

    const attachments = [];

    // Upload each new file
    for (const file of req.files) {
        const { public_id, secure_url } = await cloudinaryConfig().uploader.upload(file.path, {
            folder: `SarahaApp/Users/${userId}`,
        });
        attachments.push({ public_id, secure_url });
    }

    // Update user document with new cover images
    const user = await dbService.findOneAndUpdate({
        model: UserModel,
        filter: { _id: userId },
        data: { cloudcoverImages: attachments },
        new: true,
    });

    // Delete all old cover images in one call (invalidate CDN cache)
    if (oldPublicIds.length > 0) {
        await cloudinaryConfig().uploader.destroy_multiple(oldPublicIds, { invalidate: true });
    }

    return successResponse({
        res,
        statuscode: 200,
        message: "Cover Images Updated Successfully",
        data: { user },
    });
};
/**
 * Freeze user account (Admin or user himself)
 */
export const freezeAccount = async (req, res, next) => {
    const { userId } = req.params;

    if (userId && req.user.role !== roleEnum.ADMIN) {
        return next(new Error("You Are Not Authorized To Freeze Account"));
    }

    const updatedUser = await dbService.findOneAndUpdate({
        model: UserModel,
        filter: {
            _id: userId || req.user._id,       
            freezedAt: { $exists: false },     
        },
        data: {
            freezedAt: Date.now(),
            freezedBy: req.user._id,
        },
        new: true,  
    });

    if (!updatedUser) {
        return next(new Error("Invalid Account Or Already Frozen"));
    }

    return successResponse({
        res,
        statusCode: 200,  
        message: "Profile Frozen Successfully",
        data: { user: updatedUser },
    });
};

export default {
    listAllUsers,
    updateProfile,
    ProfileImage,
    coverImages,
    freezeAccount,
};