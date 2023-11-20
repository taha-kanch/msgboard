const fs = require("fs");

function writeIntoFile(request,jstFileName,jsFilePath) {
  var jsFile = fs.openSync(jsFilePath, "w");
  fs.writeSync(jsFile, "exports.processRequest = function(request, response)\r\n");
  fs.writeSync(jsFile, "{\r\n");
  var lines = fs.readFileSync(jstFileName).toString().split("\n");
  var line = null;
  for(var i in lines) {
    line = lines[i].replace(/\r|\n/g,"");
    line = line.replace(/"/g,"\\\"");
  
    var line = line.replace(/\$\$\$\{.*?\}/g, function(item) {
      var prop = item.substring(4, item.length - 1);
      //return "\"+ ( request[\""+prop+"\"] ? request[\""+prop+"\"] : \"\")+\"";
      if(request[prop]) return request[prop];
      else return "";
    });

    fs.writeSync(jsFile, "response.write(\""+line+"\");\r\n");
  }
  fs.writeSync(jsFile, "response.close();\r\n")
  fs.writeSync(jsFile, "}\r\n");
  fs.closeSync(jsFile);
}

exports.prepareJS = function(jstFileName, request) {

//if folders private/jst does not exist, create them
var privateFolder = "./private";
if(!fs.existsSync(privateFolder)) fs.mkdirSync(privateFolder);
var jstFolder = "./private/jst";
if(!fs.existsSync(jstFolder)) fs.mkdirSync(jstFolder);

//create new filname with extension as js instead of jst
var jsFileName = jstFileName.substring(0, jstFileName.length - 3);
jsFileName = jsFileName+"js";
var jsFilePath = "./private/jst/"+jsFileName;

//check whether js file already exists or not
if(fs.existsSync(jsFilePath)) {
  jstLastUpdatedDate = fs.statSync(jstFileName).mtime;
  jsLastUpdatedDate = fs.statSync(jsFilePath).mtime;

  if(jstLastUpdatedDate < jsLastUpdatedDate) {
    console.log("no changes in JST file");
    return "jst/"+jsFileName;
  }

  //open file and read from jst & write js
  console.log("JST file is modified");
  writeIntoFile(request,jstFileName,jsFilePath);
  return "jst/"+jsFileName;
}

//open file and read from jst & write js
writeIntoFile(request,jstFileName,jsFilePath);

//return name js filename
return "jst/"+jsFileName;
}