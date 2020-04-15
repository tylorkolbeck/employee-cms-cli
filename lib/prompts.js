const inquirer = require("inquirer")
function addDepartment(sqlQuery, callback) {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department?",
      },
    ])
    .then((answers) => {
      sqlQuery(answers)
      callback()
    })
}

module.exports = {
  addDepartment,
}
