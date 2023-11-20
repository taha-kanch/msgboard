const fs = require("fs");
module.exports = class StudentManager {

constructor() {
console.log("Object of student manager created");
}

add(student) {
console.log("add got called with data as:\n",student);

var rollNumber = parseInt(student.rollNumber);
var name = student.name;
var responseJSON = {
"success": false,
"exception": null
};
var students = [];
if(fs.existsSync("./private\\data\\student.db")) {
students = JSON.parse(fs.readFileSync("./private\\data\\student.db","utf-8")).students;
}

var studentExist = students.find(std => std.rollNumber == rollNumber);
if(studentExist) {
responseJSON.success = false;
responseJSON.exception = "That roll number already exists";
}
else {

students.push({
"rollNumber":rollNumber,
"name": name
});

const jsonToWrite = {
"students": students
}

fs.writeFileSync("./private\\data\\student.db", JSON.stringify(jsonToWrite));
responseJSON.success = true;
}
return responseJSON;
}

delete(student) {
console.log("delete got called with data as:\n",student);
}

} 