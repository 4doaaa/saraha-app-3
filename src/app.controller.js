import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/user/user.controller.js";
import messageRouter from "./Modules/message/message.controller.js";
import path from "node:path";
import {attachRouterWithLogger} from "./Utils/logger/logger.util.js";
import helmet from "helmet";
import { corsOption } from "./Utils/cors/cors.util.js";
import cors from "cors";
const bootstrap = async (app,express)=>{
    app.use(express.json());
    app.use(cors(corsOption())); //social login
    app.use(helmet());


   //await connectDB();

   attachRouterWithLogger(app ,"/api/v1/auth", authRouter, "auth.log");
   attachRouterWithLogger(app ,"/api/v1/user", userRouter, "users.log");
   attachRouterWithLogger(app ,"/api/v1/message", messageRouter, "message.log");



    app.get ("/", (req,res)=>{
        return res.status(200).json({message:"Done"});
    });

    app.use("/uploads" , express.static(path.resolve("./src/uploads")));
    app.use("/api/v1/auth" ,authRouter)
    app.use("/api/v1/user" ,userRouter)
    app.use("/api/v1/message" ,messageRouter)
    
    app.all("/*dummy" ,(req,res)=>{
        return res.status(404).json({message:"Not Found Handler!!!"});
    });
    //Global error handler
    app.use((err,req,res,next) =>{
        const status = err.cause || 500;
         return res.status(status).json
         ({message: "Somthing Went Wrong" ,
             error:err.message ,
             stack:err.stack
            });
    });
};

export default bootstrap;