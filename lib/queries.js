const sql = require("../lib/sqlConnection")

function viewAllEmployees() {
  return sql.query(`
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
  `)
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

module.exports = {
  viewAllEmployees,
  viewDepartments,
  viewRoles,
  insertNewDepartment,
}
