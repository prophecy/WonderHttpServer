var UserId = require("../../Model/Auth/UserId");
var AuthToken = require("../../Model/Auth/Token");
var Utility = require("../../Utility");

exports.Update = function(req, res, next) {

    // Next, if error
    if (res.error != null) {

        next();
        return;
    }

    // Validate value
    if (res.data.user_id == null) {

        res.error = {code:"invalidArgument", message:"Invalid argument"};
        next();
        return;
    }

    // Generate token
    var token = Utility.GenerateToken();
    var timestamp = Utility.GetCurrentTimestamp();

    // Update user_id
    AuthToken.update(
        { "user_id": res.data.user_id },
        { $set: { "user_id": res.data.user_id, "token": token, "timestamp": timestamp } },
        { upsert: true },
        function (err, result) {
            
            // Error occur
            if (err) {

                res.error = err;
                next();
                return;
            }

            if (req.auth == null)
                req.auth = {};
            
            // Pass auth data to req
            req.auth.user_id = res.data.user_id;
            req.auth.token = token;
            req.auth.timestamp = timestamp;

            if (res.data == null)
                res.data = {};

            // Attach token
            res.data.token = token;
            res.data.timestamp = timestamp;

            // Next node
            next();
        }
    );
}

exports.Authen = function(req, res, next) {

    // Set var
    var token = req.headers["token"];

    if (token == null) {

        res.error = {code:"invalidArgument", message:"Invalid argument"};
        next();
        return;
    }

    AuthToken.findOne({ "token": token }, function (err, user) {

        // Error
        if (err) {

            res.error = err;
            next();
        }
        else {

            var invalidTokenObject = {code:"invalidToken",message:"Invalid token"};

            // User NOT exists
            if (user == null) {

                res.error = invalidTokenObject;
                next();
                return;
            }

            // Validate with time
            var currentTimestamp = Utility.GetCurrentTimestamp();
            var timeDiff = currentTimestamp - user.timestamp;
            // Todo: Configure this duration
            var validTokenDuration = 86400;
            
            if (timeDiff > validTokenDuration) {

                res.error = invalidTokenObject;
                next();
                return;
            }

            if (req.auth == null)
                req.auth = {};
            
            // Pass auth data to req
            req.auth.user_id = user.user_id;
            req.auth.token = token;
            req.auth.timestamp = user.timestamp;

            if (res.data == null)
                res.data = {};

            // Pass auth data to res
            res.data.user_id = user.user_id;
            res.data.token = token;
            res.data.timestamp = user.timestamp;

            next();
        }
    });
}