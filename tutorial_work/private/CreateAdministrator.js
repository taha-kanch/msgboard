const fs = require("fs");
var thisModule = this;

exports.processRequest = function(request,response) {

  var username = request.data['username'];
  var password = request.data['password'];
  var confirmPassword = request.data['confirmPassword'];
  
  username = username != null ? username.trim() : "";
  password = password != null ? password.trim() : "";
  confirmPassword = confirmPassword != null ? confirmPassword.trim() : "";
  var resend = false;
  if(username.length == 0) resend = true;
  if(password.length == 0) resend = true;
  if(confirmPassword != password) resend = true;
  
  if(resend) {
   response.setContentType("text/html");
   response.write("<!DOCTYPE HTML>");
   response.write("<html lang='en'>");
   response.write("<head>");
   response.write("<title>College Message Board</title>");
   response.write("<meta charset='utf-8'>");
   response.write("</head>");
   response.write("<body>");
   response.write("<h1>Administration Module</h1>");
   response.write("<h3>Setup Administrator Account</h3>");

   response.write("<div style='color:red'>");
   if(username.length == 0) response.write("Username required <br>");
   if(password.length == 0) response.write("Password required <br>");
   else if(password != confirmPassword) response.write("Password typed incorrectly <br>");
   response.write("</div>");
 
   response.write("<form action='createAdmin' method='POST'>");
   response.write("<table border='0'>");
   response.write("<tr>");
   response.write("<td>Username</td>");
   response.write("<td><input type='text' id='username' name='username' maxlength='15' size='16' value='"+username+"'/></td>");
   response.write("</tr>");
   response.write("<tr>");
   response.write("<td>Password</td>");
   response.write("<td><input type='password' id='password' name='password' maxlength='15' size='16'/></td>");
   response.write("</tr>");
   response.write("<tr>");
   response.write("<td>Confirm Password</td>");
   response.write("<td><input type='password' id='confirmPassword' name='confirmPassword' maxlength='15' size='16'/></td>");
   response.write("</tr>");
   response.write("<tr>");
   response.write("<td colspan='2' align='center'><button type='submit'>Create</button></td>");
   response.write("</tr>");
   response.write("</table>"); 
   response.write("</form>");
   response.write("</body>");
   response.write("</html>");
   response.close();
   return;
  }

  var administrator = {
    "username": username,
    "password": password
  }
  fs.writeFileSync("./private\\data\\admin.conf",JSON.stringify(administrator));

  response.write("<!DOCTYPE HTML>");
  response.write("<html lang='en'>");
  response.write("<head>");
  response.write("<title>College Message Board</title>");
  response.write("<meta charset='utf-8'>");
  response.write("</head>");
  response.write("<body>");
  response.write("<h1>Administration Module</h1>");
  response.write("<h3>Setup Administrator Account</h3>");
  response.write("<h3>Account updated</h3>");
  response.write("<form action='admin'>");
  response.write("<button type='submit'>Proceed to Login</button>");
  response.write("</form>");
  response.write("</body>");
  response.write("</html>");
  response.close();
}