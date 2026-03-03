// ==================== CORS Configuration Function ====================

export function corsOption() {


    // ==================== Load Whitelist from Environment Variables ====================

    const whitelist = process.env.WHITELIST.split(",");


    // ==================== Define CORS Options Object ====================

    const corsOptions = {


        // ==================== Origin Validation Callback ====================

        origin: function(origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if(!origin){
                return callback(null,true);
            }

            // Check if the request origin is in the whitelist
            if (whitelist.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not Allowd By CORS"));
            }
        },


        // ==================== Allowed HTTP Methods ====================

        methods:["GET" , "POST","PATCH" ,"DELETE"],
    };


    // ==================== Return Configured CORS Options ====================

    return corsOptions;
}