const sql = require("./lib/sqlConnection.js")
const inquirer = require("inquirer")
const queries = require("./lib/queries")
const prompts = require("./lib/prompts")
const clear = require("clear")

// Clear the console when starting the app
// clear()

init()

// Start the ask for action loop
async function init() {
  let action = await chooseAction()
  let queryResults = await action.action()

  Promise.all([action, queryResults])
    .then(() => console.table(queryResults))
    .then(() => init())
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
          value: () =>
            prompts.addDepartment(queries.insertNewDepartment, chooseAction),
        },
        {
          name: "Add role",
          value: addRole,
        },
        {
          name: "Add Employee",
          value: addEmployee,
        },
        {
          name: "Update Employee Role",
          value: updateEmployeeRole,
        },
        {
          name: "Exit",
          value: exit,
        },
      ],
    },
  ])
}

// function performAction(action, answers, cb) {
//   // clear()

//   action(answers, (err, data) => {
//     if (!err) {
//       console.table(data)
//     } else {
//       console.log(err.sqlMessage)
//     }
//     init()
//   })
// }

// -- MYSQL FUNCTIONS --

// View all employees
// function viewEmployees(answers, callback) {
//   sql.connection.query(
//     `
//     SELECT
//       e.employee_id AS 'id',
//       e.first_name,
//       e.last_name,
//       r.title AS 'title',
//       d.department AS 'department',
//       r.salary AS 'salary',
//       CONCAT(m.first_name, ' ', m.last_name) AS 'manager'
//     FROM employees e
//       LEFT JOIN employees m
//         ON m.employee_id = e.manager_id
//       INNER JOIN roles r
//         ON e.role_id = r.role_id
//       INNER JOIN departments d
//         ON r.department_id = d.id
//       ORDER BY e.employee_id;
//     `,
//     (err, data) => {
//       callback(err, data)
//     }
//   )
// }

// Show all departments
// id | department
// function viewDepartments(answers, callback) {
//   sql.connection.query("SELECT * FROM departments", (err, data) =>
//     callback(err, data)
//   )
// }

// Show all roles
// function viewRoles(answers, callback) {
//   sql.connection.query(
//     `
//     SELECT r.role_id, title AS role, salary, d.department
//     FROM roles r
//     INNER JOIN departments d
//       ON r.department_id = d.id;`,
//     (err, data) => callback(err, data)
//   )
// }

// Add department
function addDepartment(answers, callback) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department?",
      },
    ])
    .then((answers) => {
      sql.connection.query(
        `INSERT INTO departments SET ?`,
        answers,
        (error, results, fields) => {
          callback(error, results)
        }
      )
    })
}

// Add role
function addRole(answers, callback) {
  let departments
  viewDepartments(null, (err, data) => {
    if (data) departments = data

    inquirer
      .prompt([
        {
          type: "list",
          name: "department_id",
          message: "Which department will this role be for?",
          choices: departments.map((department) => {
            return {
              name: department.department,
              value: department.department_id,
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
      .then((ans) => {
        sql.connection.query(
          `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`,
          [ans.title, ans.salary, ans.department_id],
          (error, results, fields) => {
            callback(error, results, fields)
          }
        )
      })
  })
}

function addEmployee(answers, callback) {
  let roles, departments, employees

  // Get all the data that the user will use to make choices
  viewRoles(null, (err, roles) => {
    roles = roles
    console.log(roles)
    viewDepartments(null, (err, departments) => {
      departments = departments
      viewEmployees(null, (err, employees) => {
        employees = employees
        inquirer
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
          .then((ans) => {
            console.log(ans)
            sql.connection.query(
              `INSERT INTO employees (role_id, manager_id, first_name, last_name) VALUES (?,?,?,?)`,
              [ans.role_id, ans.manager, ans.first_name, ans.last_name],
              (err, data) => {
                if (!err) console.log("Employee has been added!")
                else console.log(err)
                callback()
              }
            )
          })
      })
    })
  })
}

function updateEmployeeRole(answers, callback) {
  let roles, employees
  viewEmployees(null, (err, employees) => {
    viewRoles(null, (err, roles) => {
      roles = roles
      inquirer
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
              console.log(">>>", role)

              return { name: role.role, value: role.role_id }
            }),
          },
        ])
        .then((ans) => {
          sql.connection.query(
            `UPDATE employees SET role_id = ? WHERE employee_id = ?`,
            [ans.role_id, ans.employee_id],
            (err, result) => {
              if (err) console.log(err)
              else console.log("Employees role updated!")
              callback()
            }
          )
        })
    })
  })
}

// Exit the application
function exit() {
  sql.connection.end()
}
