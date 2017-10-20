/*****************************************************************************************/
//    APPLICATION SOURCE CODE IS HERE .... ... .. .  .   .
/*****************************************************************************************/

// Setup path
var rootPath = "../wonder_modules/WonderHttpServer/Core/";
var WonderPath = require(rootPath + "Utility").SetupWonderPath(rootPath);

// Require LIB package(s)
var WonderHttpServer = require(WonderPath("WonderHttpServer"));
var CreateSugarRoute = require(WonderPath("Utility")).CreateSugarRoute;
var AuthBasic = require(WonderPath("Api/Auth/Basic"));
var AuthToken = require(WonderPath("Api/Auth/Token"));

// Request my own package(s)
var MyOwnApi = require("./MyOwnApi");

// App configurations
var Configurations = {

    dbDevName: "ApplicationServer",
    apiServerDevPort: 3003
}

// Bind API
var OnBindApi = function(app) {

    // Resuse APIs from LIB
    app.post("/auth/register", CreateSugarRoute([AuthBasic.Register, AuthToken.Update]));
    app.put("/auth/login", CreateSugarRoute([AuthBasic.Login, AuthToken.Update]));
    app.get("/auth/authen", CreateSugarRoute([AuthToken.Authen]));

    // Implement my own API
    app.post("/greeting", CreateSugarRoute([MyOwnApi.SayGreeting]));
}

// Start server
WonderHttpServer.Start(Configurations, OnBindApi);

