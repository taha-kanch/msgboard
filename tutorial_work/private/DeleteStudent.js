const fs = require("fs");
var thisModule = this;
exports.processRequest = function(request, response) {

 var rollNumber = parseInt(request.data.rollNumber);
 var students = [];
 if(fs.existsSync("./private\\data\\student.db")) {
   students = JSON.parse(fs.readFileSync("./private\\data\\student.db")).students;
 }

 var found = false;
 var i;
 for(i=0;i<students.length;i++) {
   if(students[i].rollNumber == rollNumber) {
      found = true;
      break;
   }
 }

 response.setContentType("text/html");
 if(!found) { 
  response.write("<!DOCTYPE HTML>");
  response.write("<html>");
  response.write("<head>");
  response.write("<title>College Message Board</title>");
  response.write("</head>");
  response.write("<body>");
  response.write("<h1>Administration</h1>");
  response.write("<table width='70%' border='0'>");
  response.write("<tr>");
  response.write("<td><h3>Student (Delete Module)</h3></td>");
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

 students.splice(i,1);
 const jsonToWrite = {
  "students": students
 }
 fs.writeFileSync("./private\\data\\student.db", JSON.stringify(jsonToWrite));

 response.write("<!DOCTYPE HTML>");
 response.write("<html>");
 response.write("<head>");
 response.write("<title>College Message Board</title>");
 response.write("</head>");
 response.write("<body>");
 response.write("<h1>Administration</h1>");
 response.write("<table width='70%' border='0'>");
 response.write("<tr>");
 response.write("<td><h3>Student (Delete Module)</h3></td>");
 response.write("<td align='right'><a href='logout'>Logout</a></td>");
 response.write("</tr>");
 response.write("</table>"); 
 response.write("<form action='getStudents'>");
 response.write("<center>");
 response.write("<b>Student Deleted</b>");
 response.write("<br>");
 response.write("<button type='submit'>Ok</button>");
 response.write("</center>");
 response.write("</form>");
 response.write("<br>");
 response.write("<a href='AdminHomePage.html'>Home</a>");
 response.write("</body>");
 response.write("</html>");
 response.close();

 response.close();

}