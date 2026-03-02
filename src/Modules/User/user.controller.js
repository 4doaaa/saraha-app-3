import { Router } from "express";
import userService, { freezeAccount } from "./user.service.js";
import { authentication, authorization, tokenTypeEnum } from "../../Middlewares/auth.middleware.js";
import { Validation } from "../../Middlewares/validation.middleware.js";
import { fileValidation, localUploadMulter } from "../../Utils/multer/local.multer.js";
import { cloudFileUploadMulter } from "../../Utils/multer/cloud.multer.js";
// Import the validation schemas (adjust the path if they are in a different file)
import { profileImageSchema, coverImagesSchema } from "../../Middlewares/validation.middleware.js";
import { roleEnum } from "../../DB/Models/user.model.js";
import { freezeAccountSchema } from "./user.validation.js";

const router = Router();

// List all users
router.get("/", userService.listAllUsers);

router.patch(
  "/update",
  authentication({ tokenType: tokenTypeEnum.ACCESS }), 
  authorization({ accessRoles: [roleEnum.USER] }),
  userService.updateProfile
);
// Update profile image
router.patch(
    "/profile-image",
    authentication,
   authorization({ accessRoles: [roleEnum.USER, roleEnum.ADMIN] }),
    cloudFileUploadMulter({validation: [...fileValidation.images]}).single("profileImage"),
    userService.ProfileImage
);

// Update cover images (up to 4)
router.patch(
    "/cover-images",
    authentication,
  //   localUploadMulter({
  //        customPath: "User" ,
  //      validation: fileValidation.images,
  //   }).array("coverImages", 4),
  //  Validation(coverImagesSchema),
   cloudFileUploadMulter({validation: [...fileValidation.images]}).array("coverImages",5),
   
    userService.coverImages
);
router.delete(
  "{/:userId}/freeze-account",
  authorization({ tokenType: tokenTypeEnum.ACCESS }),
 authorization({accessRoles: [roleEnum.USER, roleEnum.ADMIN] }),
  Validation(freezeAccountSchema),
  userService.freezeAccount
);
export default router;