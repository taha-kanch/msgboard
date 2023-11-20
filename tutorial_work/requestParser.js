const qs = require("querystring");
const fs = require("fs");
const jst2js = require("./jst2js");
exports.parseRequest = function(data, mappings) {
  var request = {};
  request.forwardTo = null;
  request.forward = function(forwardToResource) {
    this.forwardTo = forwardToResource;
  }
  request.isForwarded = function() {
    return this.forwardTo != null;
  }
  request.error = 0;
  var str = data.toString();
  var splits = str.split("\n");
  var firstLine = splits[0];
  var words = firstLine.split(" ");
  request.method = words[0].toUpperCase();
  request.queryString = null;
  request.data = {};
    
  if(request.method === "GET") {
    var i = words[1].indexOf("?");
    if(i != -1) {
      request.queryString = words[1].substring(i+1);
      request.data = JSON.parse(JSON.stringify(qs.decode(request.queryString)));
      words[1] = words[1].substring(0,i);
    } 
  }
  else if(request.method === "POST") {
    var lastLine = splits[splits.length - 1];
    request.queryString = lastLine;
    request.data = JSON.parse(JSON.stringify(qs.decode(request.queryString)));
  }
  
  if(words[1].startsWith("/private") || words[1].startsWith("/private/") || words[1].startsWith("private/")) {
    request.error = 404;
    request.resource = words[1].substring(1);
    request.isClientSideTechnologyResource = true;
    return request;
  }

  if(words[1] == "/") {
    request.resource = "index.html";
    request.isClientSideTechnologyResource = true;
  } 
  else if(words[1].toUpperCase().endsWith(".JST")) {
    if(fs.existsSync(words[1].substring(1))) {
      request.resource = jst2js.prepareJS(words[1].substring(1), request);
      request.isClientSideTechnologyResource = false;
    }
    else {
      request.error = 404;
      request.resource = words[1];
    }
  }
  else {
    let mapping = mappings.paths.find(obj => obj.path === words[1]);
    if(mapping) {
      request.isClientSideTechnologyResource = false;
      request.resource = mapping.resource;
    } else {
      request.isClientSideTechnologyResource = true;
      request.resource = words[1].substring(1);
    }
  }

  return request; 
}