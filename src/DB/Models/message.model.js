// ==================== Module Imports & Dependencies ====================

import mongoose from "mongoose";


// ==================== Mongoose Schema – Single Message Structure ====================

const messageSchema = new mongoose.Schema({


    // ==================== Message Content Field ====================

    content: {
        type: String,
        required: true,
        minLength: [2,"Message Must be at least 2 characters long "],
        maxLength: [500,"Message Must be at most 500 characters long "],
    },


    // ==================== Receiver Reference (User ID) ====================

    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },


}, 


// ==================== Schema Options – Automatic Timestamps ====================

{ timestamps: true });


// ==================== Model Creation / Retrieval (Singleton Pattern) ====================

const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema);


// ==================== Export Message Model ====================

export default messageModel;