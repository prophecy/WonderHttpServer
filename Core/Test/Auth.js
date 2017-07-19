//During the test the env variable is set to test
process.env.NODE_ENV = "test";

var userCredential = require("./Def").GetUserCredential();
var invalidUserCredential = require("./Def").GetInvalidUserCredential();
var friendCredential = require("./Def").GetFriendCredential();

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
let expect = chai.expect();

var rootPath = "../";
var WonderPath = require(rootPath + "Utility").SetupWonderPath(rootPath);

var CreateSugarRoute = require(WonderPath("Utility")).CreateSugarRoute;
var AuthBasic = require(WonderPath("Api/Auth/Basic"));
var AuthToken = require(WonderPath("Api/Auth/Token"));

// Start server
let WonderHttpServer = require(WonderPath("WonderHttpServer"));

var Configurations = {

    dbDevName: "WonderHttpServer"
}

var BindTestApi = function(app) {

    app.post("/auth/register", CreateSugarRoute([AuthBasic.Register, AuthToken.Update]));
    app.put("/auth/login", CreateSugarRoute([AuthBasic.Login, AuthToken.Update]));
    app.get("/auth/authen", CreateSugarRoute([AuthToken.Authen]));
}

WonderHttpServer.Start(Configurations, BindTestApi);

chai.use(chaiHttp);

// Cache vars
var cacheToken = undefined;

//Our parent block
describe("Authentication", () => {

    let AuthBasic = require(WonderPath("Model/Auth/Basic"));
    let AuthToken = require(WonderPath("Model/Auth/Token"));
    let UserId = require(WonderPath("Model/Auth/UserId"));

    before((done) => {

        // Empty DB before running the tests
        AuthBasic.remove({}, (err) => {
            AuthToken.remove({}, (err) => {
                UserId.remove({}, (err) => {

                    done(); 
                });
            });        
        });
    });

    // ----------------------------------------------------------------------
    // ----------------------------------------------------------------------
    // Test user registration
    describe("/POST Register", () => {

        it("it should register the new user", (done) => {

        chai.request(WonderHttpServer)
            .post("/auth/register")
            .send(userCredential)
            .end((err, res) => {

                res.should.have.status(200);
                res.body.should.be.a("object");

                done();
            });
        });
    });

    // Test user login (success)
    describe("/PUT Login", () => {

        it("it should login successfully", (done) => {

        chai.request(WonderHttpServer)
            .put("/auth/login")
            .send(userCredential)
            .end((err, res) => {

                res.should.have.status(200);
                res.body.should.be.a("object");

                // Cache
                cacheToken = res.body.data.token;
                
                done();
            });
        });
    });

    // Test user login (failure)
    describe("/PUT Login", () => {

        it("it should login failure", (done) => {

        chai.request(WonderHttpServer)
            .put("/auth/login")
            .send(invalidUserCredential)
            .end((err, res) => {

                res.should.not.have.status(200);
                res.body.should.be.a("object");
                res.body.error.should.have.property("code");
                res.body.error.should.have.property("code").eql("loginFailure");

                done();
            });
        });
    });

    // Test token authentication
    describe("/GET authen", () => {

        it("it should authen (token) successfully", (done) => {

        chai.request(WonderHttpServer)
            .get("/auth/authen")
            .set( { "token": cacheToken } )
            .end((err, res) => {

                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.data.should.have.property("user_id");
                res.body.data.should.have.property("token");

                done();
            });
        });
    });
    
});