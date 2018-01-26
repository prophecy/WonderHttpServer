/*****************************************************************************************/
//    MY OWN SOURCE CODE IS HERE .... ... .. .  .   .
/*****************************************************************************************/

var WonderPath = require("./WonderConf").GetWonderPath();

var WonderHttpServer = require(WonderPath("WonderHttpServer"));
var mongoose = WonderHttpServer.GetMongoose();

/*****************************************************************************************/
//    MongoDB Schema .... ... .. .  .   .
/*****************************************************************************************/

var greetingSchema = mongoose.Schema({
    
    greeting: String,
    
});
var Greeting = mongoose.model("greeting", greetingSchema);

/*****************************************************************************************/
//    Express API(s) .... ... .. .  .   .
/*****************************************************************************************/

exports.SayGreeting = function(req, res, next) {

    var greetingTxt = "Somewher over the rainbow~";

    console.log("I gonna say, " + greetingTxt);

    Greeting.update(
        { "greeting": greetingTxt },
        { $set: 
            {
                "greeting": greetingTxt
            }
        },
        { upsert: true },
        function (err, result) {

            if (err) {

                console.log("Omg! It's error");

                res.error = err;
                next();
                return;
            }

            console.log("Success");

            res.data = { message: "Says, " + greetingTxt }
            next();
        }
    );
}