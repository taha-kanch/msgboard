const fs = require("fs");
var thisModule = this;

exports.processRequest = function(request,response) {
 
  if(fs.existsSync("./private\\data\\admin.conf")) {
     request.forward("/private/AdministratorLogin.jst");  
     return; 
  }
  request.forward("/private/AdministratorCreator.jst");
}