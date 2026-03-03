import mongoose from 'mongoose';
// ==================== Enums Definition – Gender, Provider, Role ====================

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


// ==================== Mongoose Schema – User Model Structure ====================

const userSchema = new mongoose.Schema({


    // ==================== First Name Field ====================

    firstName: {
        type:String,
        required: true,
        trim:true,
        minlength:[2 , "First Name must be at least 2 characters long"],
        maxlength:[20 , "First Name must be at most 20 characters long"],
    },


    // ==================== Last Name Field ====================

    lastName: {
        type:String,
        required: true,
        trim:true,
        minlength:[2 , "First Name must be at least 2 characters long"],
        maxlength:[20 , "First Name must be at most 20 characters long"],
    },


    // ==================== Email Field (Unique & Lowercase) ====================

    email:
    {
        type:String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },


    // ==================== Password Field (Conditional Requirement) ====================

    password: {
        type:String,
        required: function () {
            return providerEnum.GOOGLE ? false : true;
        },
    },


    // ==================== Authentication Provider Field ====================

    providers:{
        type:String,
        enum:{
            values: Object.values(providerEnum), //["Male" , "Female"],
            message:"{VALUE} is not valid gender",
        },
        default:providerEnum.SYSTEM,
    },


    // ==================== User Role Field ====================

    role:{
        type:String,
        enum:{
            values: Object.values(roleEnum), //["Male" , "Female"],
            message:"{VALUE} is not valid role",
        },
        default:roleEnum.USER,
    },


    // ==================== Profile & Cover Images (Local & Cloud) ====================

    profileImage:String,
    coverImages:[String],
   
    cloudProfileImage:{public_id:String ,secure_url:String},
    cloudcoverImages:[{public_id:String ,secure_url:String}],


    // ==================== Email Confirmation & Security Fields ====================

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


// ==================== Schema Options – Timestamps & Virtuals ====================

{ 
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
});


// ==================== Virtual Field – Messages Received by User ====================

userSchema.virtual("messages" , {
    localField:"_id",
    foreignField:"receiverId", 
    ref:"Message",
    //justOne:true,
});


// ==================== Model Creation / Retrieval (Singleton Pattern) ====================

const UserModel = mongoose.models.User || mongoose.model("User",userSchema);


// ==================== Export User Model ====================

export default UserModel;

// rhyg chcm truf ltax