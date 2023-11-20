const fs = require("fs");
var thisModule = this;
exports.processRequest = function(request, response) {

 var rollNumber = parseInt(request.data.rollNumber);
 var name = request.data.name;
 var students = [];
 if(fs.existsSync("./private\\data\\student.db")) {
  students = JSON.parse(fs.readFileSync("./private\\data\\student.db","utf-8")).students;
 }

 response.setContentType('text/html'); 
 var studentExist = students.find(student => student.rollNumber == rollNumber);
 if(studentExist) {
  request.errorMessage = "That roll number already exists";
  request.rollNumber = rollNumber;
  request.name = name;
  request.forward("StudentAddForm.jst");
 }
 else {
   students.push({
     "rollNumber": rollNumber,
     "name": name
   });

   const jsonToWrite = {
     "students": students
   }

   fs.writeFileSync("./private\\data\\student.db", JSON.stringify(jsonToWrite));
   request.forward("StudentAddNotification.html"); 
 }
}