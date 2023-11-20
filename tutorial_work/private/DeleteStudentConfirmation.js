const fs = require("fs");
var thisModule = this;
exports.processRequest = function(request, response) {

 var rollNumber = parseInt(request.data.rollNumber);
 var students = [];
 if(fs.existsSync("./private\\data\\student.db")) {
  students = JSON.parse(fs.readFileSync("./private\\data\\student.db","utf-8")).students;
 }

 response.setContentType('text/html'); 
 var student = students.find(std => std.rollNumber == rollNumber);
 if(!student) { 
  response.write("<!DOCTYPE HTML>");
  response.write("<html>");
  response.write("<head>");
  response.write("<title>College Message Board</title>");
  response.write("</head>");
  response.write("<body>");
  response.write("<h1>Administration</h1>");
  response.write("<table width='70%' border='0'>");
  response.write("<tr>");
  response.write("<td><h3>Student (Edit Module)</h3></td>");
  response.write("<td align='right'><a href='logout'>Logout</a></td>");
  response.write("</tr>");
  response.write("</table>");
  response.write(`<span style='color:red'>Roll Number: ${rollNumber} does not exist.</span>`);
  response.write("<form action='getStudents'>");
  response.write("<button type='submit'>Ok</button>");
  response.write("</form>");
  response.write("<br>");
  response.write("<a href='AdminHomePage.html'>Home</a>");
  response.write("</body>");
  response.write("</html>");
  response.close();
  return;
 }
 response.write("<!DOCTYPE HTML>");
 response.write("<html>");
 response.write("<head>");
 response.write("<title>College Message Board</title>");
 response.write("<script>");
 response.write("function cancelDeletion() {\r\n");
 response.write("document.getElementById('cancelDeletionForm').submit();\r\n");
 response.write("}\r\n");
 response.write("</script>");
 response.write("</head>");
 response.write("<body>");
 response.write("<h1>Administration</h1>");
 response.write("<table width='70%' border='0'>");
 response.write("<tr>");
 response.write("<td><h3>Student (Delete Module)</h3></td>");
 response.write("<td align='right'><a href='logout'>Logout</a></td>");
 response.write("</tr>");
 response.write("</table>"); 
 response.write("<form action='deleteStudent' method='POST'>");
 response.write("<table>");
 response.write("<tr>");
 response.write("<td>Roll Number</td>");
 response.write("<td>");
 response.write("<input type='hidden' name='rollNumber' id='rollNumber' value= '"+rollNumber+"' >");
 response.write("<b>"+rollNumber+"</b>");
 response.write("</td>");
 response.write("</tr>");
 response.write("<tr>");
 response.write("<td>Name</td>");
 response.write("<td>");
 response.write(student.name);
 response.write("</td>");
 response.write("</tr>");
 response.write("<tr>");
 response.write("<td colspan='2' align='center'>");
 response.write("<button type='submit'>Delete</button>");
 response.write("<button type='button' onclick='cancelDeletion()'>Cancel</button>");
 response.write("</td>");
 response.write("</tr>");
 response.write("</table>");
 response.write("</form>");
 response.write("<br>");
 response.write("<form action='getStudents' id='cancelDeletionForm'></form>");
 response.write("<a href='AdminHomePage.html'>Home</a>");
 response.write("</body>");
 response.write("</html>");
 response.close();
}