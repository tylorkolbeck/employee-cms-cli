const inquirer = require("inquirer")
const queries = require("./lib/queries")
const prompts = require("./lib/prompts")
const sql = require("./lib/sqlConnection").sqlConn
require("console.table")

const clear = require("clear")
// Clear the console when starting the app
// clear()

init()

// Start the ask for action loop
function init() {
  chooseAction()
    .then(async (ans) => {
      let response = await ans.action()
      console.table(response)
      init()
    })
    .catch((err) => console.log(err))
}

// Ask for an action to perform in the application
function chooseAction() {
  return inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Choose action to perform.",
      choices: [
        {
          name: "View Employees",
          value: queries.viewAllEmployees,
        },
        {
          name: "View Departments",
          value: queries.viewDepartments,
        },
        {
          name: "View Roles",
          value: queries.viewRoles,
        },
        {
          name: "Add Department",
          value: () => prompts.addDepartment(queries.insertNewDepartment),
        },
        {
          name: "Add role",
          value: () => prompts.addRole(queries.getDepartments, queries.addRole),
        },
        {
          name: "Add Employee",
          value: () =>
            prompts.addEmployee(
              queries.getEmployeesAndRoles,
              queries.addEmployee
            ),
        },
        {
          name: "Update Employee Role",
          value: () =>
            prompts.updateEmployeeRole(
              queries.getEmployeesAndRoles,
              queries.updateEmployeeRole
            ),
        },
        {
          name: "Exit",
          value: process.exit,
        },
      ],
    },
  ])
}
