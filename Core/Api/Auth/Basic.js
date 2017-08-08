var UserId = require("../../Model/Auth/UserId");
var AuthBasic = require("../../Model/Auth/Basic");
var Utility = require("../../Utility");

exports.Register = function(req, res, next) {

    // Parse body
    var username = req.body.username;
    var password = req.body.password;
    
    console.log("username: " + username);
    console.log("password: " + password);

    // Undefined guards
    if (username == undefined || password == undefined)
        res.error = {code:"invalidArgument", message:"Invalid argument"};
    
    if (res.error != null || res.error != undefined) {
        
        next();
        return;
    }

    // Generate user id (A random unique number)
    var userId = Utility.GenerateUserId();

    // Upsert user profile
    AuthBasic.update(
        { "username": username },
        { $setOnInsert: 
            {   "username": username, 
                "password": password, 
                "user_id": userId
            } 
        },
        { upsert: true },
        function (err, result) {

            // Error occur
            if (err) {

                res.error = err;
                next();
                return;
            }

            // Duplicated user
            if (result.upserted == null) {

                console.log("res: " + JSON.stringify(result));

                res.error = {code:"duplicatedUser",message:"Duplicated user"};
                next();
                return;
            }

            // Generate new userId
            UserId.update(
                { "user_id": userId },
                { $set: { "user_id": userId } },
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

                    // Attach user_id to req
                    req.auth.user_id = userId;

                    if (res.data == null)
                        res.data = {};

                    // Attach user_id to res
                    res.data.user_id = userId;

                    next();
                }
            );
        }
    );
}

exports.Login = function(req, res, next) {

    // Parse body
    var username = req.body.username;
    var password = req.body.password;
    
    console.log("username: " + username);
    console.log("password: " + password);

    // Undefined guards
    if (username == undefined || password == undefined)
        res.error = {code:"invalidArgument", message:"Invalid argument"};
    
    if (res.error != null || res.error != undefined) {
        
        next();
        return;
    }

    AuthBasic.findOne({ "username": username, "password": password }, function (err, user) {

        // Error
        if (err) {

            res.error = err;
            next();
        }
        else {

            // User NOT exists
            if (user == null) {

                res.error = {code:"loginFailure",message:"Login failure"};
                next();
                return;
            }

            if (req.auth == null)
                req.auth = {};

            // Attach user_id to req
            req.auth.user_id = user.user_id;
                
            if (res.data == null)
                res.data = {};

            // Pass user id
            res.data.user_id = user.user_id;

            next();
        }
    });
}
