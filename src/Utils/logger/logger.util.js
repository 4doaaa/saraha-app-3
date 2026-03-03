// ==================== Module Imports & Dependencies ====================

import fs from "node:fs";
import path from "node:path";
import morgan from "morgan";


// ==================== Resolve Current Directory Path ====================

const __dirname = path.resolve();


// ==================== Attach Router with Dual Morgan Logging ====================

export function attachRouterWithLogger(app , routerPath , router, logFileName) {


    // ==================== Create Persistent Log Stream (Combined Format) ====================

    const logStream = fs.createWriteStream(
        path.join(__dirname , "./src/logs" , logFileName),
        {flags: "a"}
    );


    // ==================== Mount Router with File Logging (combined format) ====================

    app.use(routerPath , morgan("combined" , {stream: logStream}), router);


    // ==================== Mount Router with Console Logging (dev format) ====================

    app.use(routerPath , morgan("dev"), router);

}