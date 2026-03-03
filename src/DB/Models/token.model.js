// ==================== Module Imports & Dependencies ====================

import mongoose from "mongoose";


// ==================== Mongoose Schema – Token Structure (for JWT / Refresh Tokens) ====================

const tokenSchema = new mongoose.Schema({


    // ==================== JWT ID / Token Identifier Field ====================

    jwtid: {
        type: String,
        require: true,
        uniquer: true,
    }, 


    // ==================== Expiration Date Field ====================

    expiresIn: {
        type: Date,
        require: true,
    }, 


    // ==================== User Reference (Owner of the Token) ====================

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },


}, 


// ==================== Schema Options – Automatic Timestamps ====================

{ timestamps: true });


// ==================== Model Creation / Retrieval (Singleton Pattern) ====================

const TokenModel = mongoose.models.Token || mongoose.model("Token", tokenSchema);


// ==================== Export Token Model ====================

export default TokenModel;