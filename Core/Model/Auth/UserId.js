var mongoose = require("mongoose");

var schema = mongoose.Schema({

    user_id: String
});

module.exports = mongoose.model("user_id", schema);