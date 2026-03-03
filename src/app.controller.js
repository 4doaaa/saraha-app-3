// ==================== Module Imports & Dependencies ====================

import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/user/user.controller.js";
import messageRouter from "./Modules/message/message.controller.js";
import path from "node:path";
import {attachRouterWithLogger} from "./Utils/logger/logger.util.js";
import helmet from "helmet";
import { corsOption } from "./Utils/cors/cors.util.js";
import cors from "cors";


// ==================== Bootstrap Function – Main App Setup ====================

const bootstrap = async (app,express)=>{


    // ==================== Global Middleware – JSON Parsing ====================

    app.use(express.json());


    // ==================== Global Middleware – CORS Configuration ====================

    app.use(cors(corsOption())); //social login


    // ==================== Global Middleware – Security Headers (Helmet) ====================

    app.use(helmet());


    // ==================== Commented Database Connection ====================

   //await connectDB();


    // ==================== Mount Routers with Logging (File + Console) ====================

    attachRouterWithLogger(app ,"/api/v1/auth", authRouter, "auth.log");
    attachRouterWithLogger(app ,"/api/v1/user", userRouter, "users.log");
    attachRouterWithLogger(app ,"/api/v1/message", messageRouter, "message.log");


    // ==================== Root Route – Health Check ====================

    app.get ("/", (req,res)=>{
        return res.status(200).json({message:"Done"});
    });


    // ==================== Serve Static Files (Uploads Folder) ====================

    app.use("/uploads" , express.static(path.resolve("./src/uploads")));


    // ==================== Mount Routers (Without Logging – Final Routes) ====================

    app.use("/api/v1/auth" ,authRouter)
    app.use("/api/v1/user" ,userRouter)
    app.use("/api/v1/message" ,messageRouter)
    

    // ==================== Catch-All Route – 404 Not Found Handler ====================

    app.all("/*dummy" ,(req,res)=>{
        return res.status(404).json({message:"Not Found Handler!!!"});
    });


    // ==================== Global Error Handling Middleware ====================

    app.use((err,req,res,next) =>{
        const status = err.cause || 500;
         return res.status(status).json
         ({message: "Somthing Went Wrong" ,
             error:err.message ,
             stack:err.stack
            });
    });
};


// ==================== Export Bootstrap Function ====================

export default bootstrap;