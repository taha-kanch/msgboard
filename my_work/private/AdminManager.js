const fs = require("fs");

module.exports = class AdminManager {

constructor() {
}

index() {
  var adminExists = fs.existsSync("./private/data/admin.conf");
  if(adminExists) {
    try {
      var administrator = JSON.parse(fs.readFileSync("./private/data/admin.conf"));
    } catch(err) {
      adminExists = false;
    }
  }
  adminExists = adminExists && administrator.username && administrator.password;
  var responseJSON = null;
  if(adminExists) responseJSON = {"forward": "/private/AdminIndex.html"};
  else responseJSON = {"forward": "/private/AdministratorCreationForm.html"};
  return responseJSON;
}

createAdministrator(administrator) {
  var adminExists = fs.existsSync("./private/data/admin.conf");
  if(adminExists) {
    try {
      var vAdministrator = JSON.parse(fs.readFileSync("./private/data/admin.conf"));
    } catch(err) {
      adminExists = false;
    }
  }
  adminExists = adminExists && vAdministrator.username && vAdministrator.password;
  if(!adminExists) {
    var administratorJSON = {
      "username": administrator.username,
      "password": administrator.password
    }
    fs.writeFileSync("./private\\data\\admin.conf", JSON.stringify(administratorJSON));
  }
  return { "forward": "/private/AdminIndex.html" };
}

checkCredentials(administrator) {
  var adminExists = fs.existsSync("./private/data/admin.conf");
  if(adminExists) {
    try {
      var vAdministrator = JSON.parse(fs.readFileSync("./private/data/admin.conf"));
    } catch(err) {
      adminExists = false;
    }
  }
  adminExists = adminExists && vAdministrator.username && vAdministrator.password;
  if(!adminExists) return { "forward": "/admin" };
  return { 
    "success": (vAdministrator.username === administrator.username && vAdministrator.password === administrator.password) 
  };
}

logout() {
  return { "forward": "/private/AdminIndex.html" };
}

home() {
  return { "forward": "/private/AdminHome.html" };
}

}