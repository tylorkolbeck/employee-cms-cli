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

async function addRole(preQuery, postQuery, callback) {
  let preQueryResults = await preQuery()
  let promptsResults = await inquirer
    .prompt([
      {
        type: "list",
        name: "department_id",
        message: "Which department will this role be for?",
        choices: preQueryResults.map((department) => {
          return {
            name: department.department,
            value: department.id,
          }
        }),
      },
      {
        type: "input",
        name: "title",
        message: "What is the name of the role?",
      },
      {
        type: "number",
        name: "salary",
        message: "What is this roles salary?",
      },
    ])
    .then((answers) => {
      postQuery(answers)
      callback()
    })
}

module.exports = {
  addDepartment,
  addRole,
}
