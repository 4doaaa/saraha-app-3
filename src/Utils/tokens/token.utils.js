import jwt from "jsonwebtoken";
import { roleEnum } from "../../DB/Models/user.model.js";
import {v4 as uuid} from "uuid";

export const getSignatureEnum = {
    ADMIN: "ADMIN",
    USER: "USER",
}

export const generateToken = ({payload , 
    secretkey=process.env.TOKEN_ACCESS_SECRET
     , options = {exipiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN} ,
    }) =>{
    return jwt.sign(payload , secretkey , options );
};

export const verifyToken = ({token , secretkey=process.env.TOKEN_ACCESS_SECRET,
    
 }) =>{
    return jwt.verify(token , secretkey );
};


export const getSignature = async ({signatureLevel = getSignatureEnum.USER})=>{
    let signatures = {accessSignature: undefined , refreshSignature: undefined};

    switch (signatureLevel) {
        case getSignatureEnum.ADMIN:
            signatures.accessSignature = process.env.TOKEN_ACCESS_ADMIN_SECRET;
            signatures.refreshSignature = process.env.TOKEN_REFRESH_ADMIN_SECRET;
            break;  
            default:
            signatures.accessSignature = process.env.TOKEN_ACCESS_USER_SECRET;
            signatures.refreshSignature = process.env.TOKEN_REFRESH_USER_SECRET;
            break;
    }
    console.log(signatures);
    
    return signatures;
};


export const getNewLoginCredintials = async(user) =>{
    const signatures = await getSignature({
        signatureLevel:
     user.role != roleEnum.USER? getSignatureEnum.ADMIN : getSignatureEnum.USER,

    });
  const jwtid = uuid();
const accessToken =  generateToken({
    payload: { id:user._id, email: user.email },
    secretkey:signatures.accessSignature,
    options: {
        expiresIn:parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN),
        jwtid,
    },
});


const refreshToken =  generateToken({
    payload: { id: user._id, email: user.email },
    secretkey:signatures.refreshSignature,
    options: {
        expiresIn:parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN),
        jwtid,
    },
});
return {accessToken, refreshToken};
};