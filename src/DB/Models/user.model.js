import mongoose from "mongoose";
export const genderEnum = {
    MALE:"MALE",
    FEMALE:"FEMALE",
};
export const providerEnum = {
    SYSTEM:"SYSTEM",
    GOOGLE:"GOOGLE",
};

export const roleEnum = {
    USER:"USER",
    ADMIN:"ADMIN",
};
const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required: true,
        trim:true,
        minlength:[2 , "First Name must be at least 2 characters long"],
        maxlength:[20 , "First Name must be at most 20 characters long"],
    },
    lastName: {
        type:String,
        required: true,
        trim:true,
        minlength:[2 , "First Name must be at least 2 characters long"],
        maxlength:[20 , "First Name must be at most 20 characters long"],
    },
    email:
    {
        type:String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type:String,
        required: function () {
            return providerEnum.GOOGLE ? false : true;
        },

    },
    providers:{
        type:String,
        enum:{
            values: Object.values(providerEnum), //["Male" , "Female"],
            message:"{VALUE} is not valid gender",
        },
        default:providerEnum.SYSTEM,
    },
  

    
role:{
        type:String,
        enum:{
            values: Object.values(roleEnum), //["Male" , "Female"],
            message:"{VALUE} is not valid role",
        },
        default:roleEnum.USER,
    },
  


    profileImage:String,
    coverImages:[String],
   
    cloudProfileImage:{public_id:String ,secure_url:String},
    cloudcoverImages:[{public_id:String ,secure_url:String}],

    confirmEmail: {
        type: Boolean,
        default: false          
    },
    freezedAt: Date,
    freezedBy:{type:mongoose.Schema.Types.ObjectId , ref:"User"},
    confirmedAt: {            
    },
    confirmEmailOTP: String,
    confirmEmailOTPExpires: Date,

    forgetPasswordOTP: String,
    forgetPasswordOTPExpires: Date,

},
 {timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
  });
 userSchema.virtual("messages" , {
    localField:"_id",
foreignField:"receiverId", 
ref:"Message",
//justOne:true,


});
const UserModel = mongoose.models.User || mongoose.model("User",userSchema);

export default UserModel;

// rhyg chcm truf ltax
