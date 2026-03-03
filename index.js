// ==================== Module Imports & Dependencies ====================

import express from 'express';  
import bootstrap from './src/app.controller.js';
import connectDB from './src/DB/connection.js';
import dotenv from "dotenv";
import messageRouter from './src/Modules/message/message.controller.js'; 


// ==================== Load Environment Variables ====================

dotenv.config({path:"./src/config/.env.dev"});


// ==================== Express App Initialization ====================

const app  = express();


// ==================== Global Middleware – JSON Parsing ====================

app.use(express.json());


// ==================== Define Server Port ====================

const PORT = Number(process.env.PORT) || 3000;


// ==================== Mount Message Router (Standalone Route) ====================

app.use('/api/v1/user/message', messageRouter);


// ==================== Connect to Database ====================

await connectDB();


// ==================== Bootstrap Application (Routers, Middleware, Error Handling) ====================

await bootstrap(app , express);


// ==================== Start Express Server ====================

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})