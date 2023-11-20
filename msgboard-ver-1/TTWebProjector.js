const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const net = require("net");

const jst2js = require("./jst2js");
const configuration = require("./configuration");
const errors = require("./errors");
const requestParser = require("./requestParser");

var bufferSize = 1024;
var buffer = Buffer.alloc(bufferSize);

var mappings = configuration.getConfiguration();

class Response {

  constructor(socket) {
    this.$$$socket = socket;
    this.responseInitiated = false;
    this.contentType = "text/html";
    this._isClosed = false;
  }

  setContentType(type) {
    this.contentType = type;
  }

  write(data) {
    if(!this.responseInitiated) {
      this.$$$socket.write("HTTP/1.1 200 OK\n");
      this.$$$socket.write(new Date().toGMTString()+"\n");
      this.$$$socket.write("Server: TTWebProjector\n"); 
      this.$$$socket.write(`Content-Type: ${this.contentType}\n`);
      this.$$$socket.write("Connection: close\n\n");
      this.responseInitiated = true;
    }
    this.$$$socket.write(data);
  }

  close() {
    if(this._isClosed) return;
    this.$$$socket.end();
    this._isClosed = true;
  }

}

function serverResource(socket, resource) {
  if(!fs.existsSync(resource)) {
    errors.send404(socket, resource);
    return;
  }

  /* var fileDescriptor = fs.openSync(resource, "r");
  var byteExtracted, data;
  while(true) {
    byteExtracted = fs.readSync(fileDescriptor, buffer, 0, bufferSize);
    if(byteExtracted == 0) {
       fs.closeSync(fileDescriptor);
       break;
    }
    if(byteExtracted < bufferSize) {
      data = buffer.slice(0, byteExtracted);
    }
    else {
      data = buffer;
    }
  } */
  
  var data = fs.readFileSync(resource, 'utf-8');

  var header = "HTTP/1.1 200 OK\n";
  header = header + `Content-Type: ${mime.lookup(resource)}\n`;
  header = header + `Content-Length: ${data.length}\n`;
  header = header + "\n";
  var response = header + data;
  socket.write(response);
}

var httpServer = net.createServer(function(socket) {
  socket.on("data", function(data) {
     var request = requestParser.parseRequest(data,mappings);
     while(true) {
       request.forwardTo = null;
       if(request.error != 0) {
       	 errors.processError(request.error, socket, request.resource);
       	 return;
       }

       if(request.isClientSideTechnologyResource) {
        serverResource(socket, request.resource);
        return;
       } 
       else {

        var absolutePath = path.resolve("./private/"+request.resource);
	//because of this line the older version of file get deleted & new processing come to place
	delete require.cache[absolutePath];
        const service = require("./private/"+request.resource);
	
	if(request.isClassMapping) {
	  var requestData = request.data;
	  var obj = new service();
	  var responseObject = obj[request.serviceMethod](requestData);
	  console.log("response:", responseObject);
          break;
	  //more code changes are going to come
        }
  
        service.processRequest(request,new Response(socket));
        if(request.isForwarded() == false) return;

	var forwardTo = request.forwardTo;
    	request.isClientSideTechnologyResource = true;
        //if(forwardTo.startsWith("/private") || forwardTo.startsWith("/private/") || forwardTo.startsWith("private/")) {
    	  //request.error = 500;
  	//}

  	if(forwardTo == "/") {
    	  request.resource = "index.html";
  	}
	else if(forwardTo.toUpperCase().endsWith(".JST")) {
	   if(!fs.existsSync("."+forwardTo)) {
	     request.error = 404;
	     request.resource = forwardTo;
	   }
	   else {
	     request.resource = jst2js.prepareJS(forwardTo, request);
	     request.isClientSideTechnologyResource = false;	    
	   }
	} 
	else {
      	  let mapping = mappings.paths.find(obj => obj.path === "/"+forwardTo);
    	  if(mapping) {
            request.isClientSideTechnologyResource = false;
      	    request.resource = mapping.resource;
    	  } else {
       	    request.resource = forwardTo;
    	  }
        }
       }
     }
  });

  socket.on("error", function(error) {
     console.log(error);
     console.log("some error on client side");
  });

  socket.on("end", function() {
     console.log("connection closed by client");
  });
});

httpServer.listen(8080, "localhost", function() {
   console.log("TTWebProjector is up: port 8080");
});