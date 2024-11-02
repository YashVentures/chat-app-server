const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    userMessage: { type: String, required: true },
    botResponse: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
