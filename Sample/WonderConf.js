
// Root path will be changed when deploy
var rootPath = "../wonder_modules/WonderHttpServer/Core/";
const path = require('path');

var GetWonderPath = function(prefixPath) {

    // Var
    var absPath = "";

    // Compose absolute path for each directory
    if (!!prefixPath)
        absPath = prefixPath + rootPath;
    else
        absPath = rootPath;

    // Get wonder path
    var wonderPath = require(rootPath + "Utility").SetupWonderPath(absPath);

    // Return the path
    return wonderPath;
}

exports.GetWonderPath = GetWonderPath;
