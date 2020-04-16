const sql = require("../lib/sqlConnection").sqlConn

function viewAllEmployees() {
  return sql.query(
    `
    SELECT
      e.employee_id AS 'id',
      e.first_name,
      e.last_name,
      r.title AS 'title',
      d.department AS 'department',
      r.salary AS 'salary',
      CONCAT(m.first_name, ' ', m.last_name) AS 'manager'
    FROM employees e
      LEFT JOIN employees m
        ON m.employee_id = e.manager_id
      INNER JOIN roles r
        ON e.role_id = r.role_id
      INNER JOIN departments d
        ON r.department_id = d.id
      ORDER BY e.employee_id;
  `
  )
}

function viewDepartments() {
  return sql.query("SELECT * FROM departments")
}

function viewRoles() {
  return sql.query(`
    SELECT r.role_id, title AS role, salary, d.department
    FROM roles r
    INNER JOIN departments d
      ON r.department_id = d.id;`)
}

function insertNewDepartment(values) {
  return sql.query(`INSERT INTO departments SET ?`, values)
}

function addRole(values) {
  return sql.query(`INSERT INTO roles VALUES ?`, values)
}

function getDepartments() {
  return sql.query(`SELECT * FROM departments`)
}

function addEmployee(values) {
  sql.query(
    `INSERT INTO employees (role_id, manager_id, first_name, last_name) VALUES (?,?,?,?)`,
    [values.role_id, values.manager, values.first_name, values.last_name]
  )
}

function addRole(values) {
  return sql.query(`INSERT INTO roles SET ?`, values)
}

function updateEmployeeRole(values) {
  return sql.query(`UPDATE employees SET role_id = ? WHERE employee_id = ?`, [
    values.role_id,
    values.employee_id,
  ])
}

async function getEmployeesAndRoles() {
  let employees = await viewAllEmployees()
  let roles = await viewRoles()

  return { employees, roles }
}

module.exports = {
  viewAllEmployees,
  viewDepartments,
  viewRoles,
  insertNewDepartment,
  addRole,
  getDepartments,
  addRole,
  addEmployee,
  getEmployeesAndRoles,
  updateEmployeeRole,
}
