// Require
var express = require("express");
var http = require("http");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Configure Express
var app = express();
module.exports = app; // for testing

module.exports.Start = function(Configurations, onBindApi) {

  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  onBindApi(app);

  // Start MongoDB and HttpServer
  require("./ServerInitializer").StartServer(app, Configurations);
}

// Export mongoose
module.exports.GetMongoose = function() {

  return mongoose;
}
