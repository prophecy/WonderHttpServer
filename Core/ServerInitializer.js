var mongoose = require("mongoose");
var bluebird = require('bluebird');

// ---------------------------------------------------------------------------
// Public method
exports.StartServer = function(app, configurations) {
    
    var isStartMongoDB = true;

    if (configurations.isStartMongoDB != undefined && configurations.isStartMongoDB == false)
        isStartMongoDB = false;

    if (isStartMongoDB) {
        StartMongoDBConnection(configurations.dbDevName, function(err) {
            if (err) {
                console.log("MongoDB initialization failure, DO NOT start server!");
            }
            else {
                StartHtttpServer(app, configurations.apiServerDevPort);
            }
        });
    }
    else {
        StartHtttpServer(app, configurations.apiServerDevPort);
    }
}

// ---------------------------------------------------------------------------
// Start HTTP server
function StartHtttpServer(app, port) {
    
    var port = process.env.PORT || port;
    var server = app.listen(port);
    var io = require("socket.io").listen(server); // this tells socket.io to use our express server

    console.log("Listening on port " + port + "...");
}

// ---------------------------------------------------------------------------
// Start MongoDB connection

function StartMongoDBConnection(dbDevName, errCallback) {

    // Compose URI string depending on environment
    var uriString = process.env.MONGODB_URI ||
                    "mongodb://localhost:27017/" + dbDevName;
    
    mongoose.Promise = bluebird;

    // Connect database
    mongoose.connection.openUri(uriString, function (err, res) {
    
        if (err) {
            console.log("ERROR connecting to: " + uriString + ". " + err);
            errCallback({error:{message:err}});
        }
        else {
            console.log("Succeeded connected to: " +uriString);
            errCallback(null);
        }
    });
}


