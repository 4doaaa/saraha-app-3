
import * as dbService from  "../DB/dbService.js" 
import TokenModel from "../DB/Models/token.model.js";
import UserModel from "../DB/Models/user.model.js";
import { verifyToken } from "../Utils/tokens/token.utils.js";

export const tokenTypeEnum = {
    ACCESS: "ACCESS",
    REFRESH: "REFRESH",
};

const  decodedToken = async ({authorization , tokenType = tokenTypeEnum.ACCESS , next}={}) => {
    const [Bearer , token] = authorization.split(" ")||[];
if (Bearer !== 'Bearer' || !token) 
    return next(new Error("Invalid Token", {cause:400}));
    let signatures = await getSignature({signatureLevel: Bearer});
    
    const decoded = verifyToken({
        token,
        secretkey: tokenType === tokenTypeEnum.ACCESS ? signatures.accessSignature : signatures.refreshSignature,
    });
    if(!decoded.jti)
        return next(new Error("Invalid Token", {cause:401}));
       const revokedToken = await dbService.findOne({
            model:TokenModel,
           filter:{jwtid:decoded.jti},
           });
           if (revokedToken)
                return next(new Error(" token is revoked", {cause:401}));

             //find user
           const user = await dbService.findById({
            model: UserModel,
            id: decoded.id       
        });
         if (!user)          
           return next(new Error("Not Registered Account", {cause:404}));  
        return { user , decoded } ;
};


export const authentication = ({tokenType = tokenTypeEnum.ACCESS} = {}) => {
    return async (req, res, next) => {
        const result = await decodedToken({
            authorization: req.headers.authorization,
            tokenType,
            next
        });

        if (!result || !result.user) {
            return next(new Error("Invalid or expired token", { cause: 401 }));
        }
        req.user = result.user;
        req.decoded = result.decoded;
        return next(); 
    };
};
export const authorization = ({accessRoles = []} = {}) => {
    return (req, res, next) => {
        if (!req.user || !accessRoles.includes(req.user?.role)) {
            return next(new Error("Unauthorized Access", { cause: 403 }));
        }
        return next();
    };
};