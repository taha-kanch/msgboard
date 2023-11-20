const fs = require("fs");
var thisModule = this;

exports.processRequest = function(request,response) {

  var username = request.data["username"];
  var password = request.data["password"];
  var administrator = JSON.parse(fs.readFileSync("./private\\data\\admin.conf","utf-8"));
  response.setContentType("text/html");
  if(administrator.username != username || administrator.password != password) {
    request.errorMessage = "Invalid username/password"
    request.forward("/private/AdministratorLogin.jst");
  }
  else {
    response.write("<!DOCTYPE HTML>");
    response.write("<html lang='en'>");
    response.write("<head>");
    response.write("<title>College Message Board</title>");
    response.write("<meta charset='utf-8'>");
    response.write("</head>");
    response.write("<body>");
    response.write("<h1>Administration Module</h1>");
    response.write("<a href='StudentAddForm.jst'>Add Student</a><br>");
    response.write("<a href='getStudents'>Students List</a><br>");
    response.write("<a href='MessageForm.html'>Post Message</a><br>");
    response.write("<a href='messageBoard'>Message board</a><br>");
    response.write("<a href='logout'>Logout</a><br>");
    response.write("</body>");
    response.write("</html>");
    response.close();     
  }
  
}