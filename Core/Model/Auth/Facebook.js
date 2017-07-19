var mongoose = require("mongoose");

var schema = mongoose.Schema({

    fb_id: String,
    user_id: String
});

module.exports = mongoose.model("auth_facebook", schema);