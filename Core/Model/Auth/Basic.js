var mongoose = require("mongoose");

var schema = mongoose.Schema({
    
    username: String,
    password: String,
    
    user_id: String
});

module.exports = mongoose.model("auth_basic", schema);