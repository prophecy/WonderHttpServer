var uuid = require("uuid")
var randomString = require("randomstring")
const path = require('path');

var corePath = "";

var WonderPath = function(subPath) {

    return path.join(corePath, subPath);
}
exports.WonderPath = WonderPath;

var SetupWonderPath = function(path) {

    // Set core path
    corePath = path;

    return WonderPath;
}
exports.SetupWonderPath = SetupWonderPath;

var ComposeHeader = function(req, res, next) {
    
    res.header("Content-Type", "application/json");
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    
    next();
}
exports.ComposeHeader = ComposeHeader;

var ComposeResponse = function(req, res, next) {

    // Error case
    if (res.error != null) {

        // Log it
        console.log("res.error: " + JSON.stringify(res.error));

        // Treat to return error information only
        var flag00 = Object.keys(res.error).length == 2;
        var flag01 = res.error["code"] == null;
        var flag02 = res.error["message"] == null;

        if (!flag00 || flag01 || flag02) {

            console.log("ComposeResponse: Found invalid error information!");
            console.log(JSON.stringify(res.error));

            res.error.code = "undefined";
            res.error.message = "Undefined";
        }

        // Send response
        res.status(500).send({error:res.error});
    }
    // Success case
    else {

        // Validate response. If contain error object treat as fatal.
        if (res.error != null) {

            console.log("FATAL !!!! ComposeRespose does not suppose to response any error!");
            console.log(JSON.stringify(res.error));

            return;
        }
        
        // Send response
        res.status(200).send({ data: res.data });
    }
}
exports.ComposeResponse = ComposeResponse;

var RouteTerminator = function(req, res, next) {

    if (res.error != undefined) {

        ComposeResponse(req, res, next);
    }
    else {
        next();
    }
}

exports.CreateSugarRoute = function(route) {

    var sugarRoute = [];
    sugarRoute.push(ComposeHeader);

    for (var i=0; i<route.length; ++i) {

        sugarRoute.push(route[i]);
        sugarRoute.push(RouteTerminator);
    }
    
    sugarRoute.push(ComposeResponse);

    return sugarRoute;
}

var GenerateId = function() {

    return uuid.v4().replace(/-/g, "");
}
exports.GenerateId = GenerateId;

exports.GenerateUserId = function() {

    return GenerateId();
}

exports.GenerateToken = function(callback) {

    return randomString.generate(192);
}

exports.OmitUserField = function(user) {

    user._id = undefined;
    user.password = undefined;
    user.__v = undefined;
    user.token = undefined;
    
    return user;
}

exports.GetCurrentTimestamp = function(user) {

    return (new Date).getTime();
}

exports.IsArray = function(a) {
    return (!!a) && (a.constructor === Array);
};

exports.IsObject = function(a) {
    return (!!a) && (a.constructor === Object);
};

exports.HasElementInArray = function(array, primaryKey, key) {

    // Vars
    var hash = {};

    // Convert array to hash
    array.forEach(function (it) { hash[it[primaryKey]] = it; });

    if (hash[key] == undefined)
        return false;

    return true;
}

exports.UpdateElementInArray = function(array, primaryKey, key, value, isUpsert) {

    // Vars
    var hash = {};

    // Convert array to hash
    array.forEach(function (it) { hash[it[primaryKey]] = it; });

    // Exec
    var isExec = !( !isUpsert && hash[key] == undefined );

    if (isExec)
        hash[key] = value;

    // Convert hash back to array
    var newArray = [];

    for(var key in hash) {
        
        var value = hash[key];
        newArray.push(value);
    }

    return newArray;
}

exports.MergeObject = function (obj1,obj2){

    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}