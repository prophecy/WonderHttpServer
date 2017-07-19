var mongoose = require("mongoose");

var schema = mongoose.Schema({

    token: String,
    timestamp: Number,
    user_id: String
});

module.exports = mongoose.model("auth_token", schema);