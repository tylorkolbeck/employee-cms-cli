const inquirer = require("inquirer")

// Some actions will require a call to the database prior to displaying
// the inquirer prompt.  This function will be called preQuery. The database
// query that will be called after all prompts that have been answered will be 
// called postQuery.  

// Each prompt function will be passed a callback which will generally just be 
// the function to continue the prompts loop.

function addDepartment(postQuery, callback) {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department?",
      },
    ])
    .then((answers) => {
      postQuery(answers)
      callback()
    })
}

function addRole(preQuery, postQuery, callback)

module.exports = {
  addDepartment,
}
