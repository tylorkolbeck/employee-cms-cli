const inquirer = require("inquirer")

// Some actions will require a call to the database prior to displaying
// the inquirer prompt.  This function will be called preQuery. The database
// query that will be called after all prompts that have been answered will be
// called postQuery.

// Each prompt function will be passed a callback which will generally just be
// the function to continue the prompts loop.

function addDepartment(postQuery) {
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
    })
}

async function addRole(preQuery, postQuery) {
  let preQueryResults = await preQuery()
  await inquirer
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
    })
}

async function addEmployee(preQuery, postQuery) {
  let { employees, roles } = await preQuery()

  await inquirer
    .prompt([
      {
        type: "list",
        message: "What is the role for this employee?",
        name: "role_id",
        choices: roles.map((role) => {
          return {
            name: role.role,
            value: role.role_id,
          }
        }),
      },
      {
        type: "list",
        message: "Who is this employees manager?",
        name: "manager",
        choices: [
          { name: "No manager", value: null },
          ...employees.map((employee) => {
            return {
              name: employee.first_name + " " + employee.last_name,
              value: employee.id,
            }
          }),
        ],
      },
      {
        type: "input",
        message: "What is the Employees first name?",
        name: "first_name",
      },
      {
        type: "input",
        message: "What is the Employees last name?",
        name: "last_name",
      },
    ])
    .then((answers) => {
      answers.manager_id = answers.manager
      postQuery(answers)
    })
}

async function updateEmployeeRole(preQuery, postQuery, callback) {
  let { employees, roles } = await preQuery()
  await inquirer
    .prompt([
      {
        type: "list",
        name: "employee_id",
        messages: "Which Employee would you like to update a role for?",
        choices: employees.map((emp) => {
          return {
            name: emp.first_name + " " + emp.last_name,
            value: emp.id,
          }
        }),
      },
      {
        type: "list",
        name: "role_id",
        message: "Which role would you like to assign to this employee?",
        choices: roles.map((role) => {
          return { name: role.role, value: role.role_id }
        }),
      },
    ])
    .then((answers) => postQuery(answers))
}

module.exports = {
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
}
