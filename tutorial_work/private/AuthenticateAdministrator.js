const fs = require("fs");
var thisModule = this;

exports.processRequest = function(request,response) {

  var username = request.data["username"];
  var password = request.data["password"];
  var administrator = JSON.parse(fs.readFileSync("./private\\data\\admin.conf","utf-8"));
  response.setContentType("text/html");
  if(administrator.username != username || administrator.password != password) {
    response.write("<!DOCTYPE HTML>");
    response.write("<html lang='en'>");
    response.write("<head>");
    response.write("<title>College Message Board</title>");
    response.write("<meta charset='utf-8'>");
    response.write("</head>");
    response.write("<script>");
    response.write("function validateForm(f) {");
    response.write("var username = f.username.value.trim();");
    response.write("var password = f.password.value.trim();");
    response.write("if(username.length == 0) {");
    response.write("alert('Username required');");
    response.write("f.username.focus();");
    response.write("return false;");
    response.write("}");
    response.write("if(password.length == 0) {");
    response.write("alert('Password required');");
    response.write("f.password.focus();");
    response.write("return false;");
    response.write("}");
    response.write("return true;");
    response.write("}");
    response.write("</script>");
    response.write("<body>");
    response.write("<h1>Administration Module</h1>");
    response.write("<h3>Authentication</h3>");
    response.write("<div style='color:red'>");
    response.write("Invalid username/password");
    response.write("</div>");
    response.write("<form action='authenticateAdmin' method='POST' onsubmit='return validateForm(this)'>");
    response.write("<table border='0'>");
    response.write("<tr>");
    response.write("<td>Username</td>");
    response.write("<td><input type='text' id='username' name='username' maxlength='15' size='16'/></td>");
    response.write("</tr>");
    response.write("<tr>");
    response.write("<td>Password</td>");
    response.write("<td><input type='password' id='password' name='password' maxlength='15' size='16'/></td>");
    response.write("</tr>");
    response.write("<tr>");
    response.write("<td colspan='2' align='center'><button type='submit'>Login</button></td>");
    response.write("</tr>");
    response.write("</table>"); 
    response.write("</form>");
    response.write("</body>");
    response.write("</html>");
    response.close();
    return;
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