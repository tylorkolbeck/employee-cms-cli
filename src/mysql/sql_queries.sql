USE employees_db;

-- ****** VIEWS ******

-- ** View all employees
-- employee_id | role_id | manager_id | first_name | last_name 
SELECT *
FROM employees;

-- ** View all departments (no join)
-- id | department
SELECT * 
FROM departments;

-- ** View all roles (no join)
-- role_id | title | salary | department_id
SELECT *
FROM roles;

-- ** View all employees (no join)
SELECT * 
FROM employees;

-- ** View role and salary info
-- role | salary | department
SELECT title AS role, salary, department 
FROM roles
INNER JOIN departments
	ON roles.department_id = departments.id;
    
-- ** View employees linked to a manager
-- First Name | Last Name | Manager Name
SELECT 
	e.first_name, 
    e.last_name,
    CONCAT(m.last_name, ', ', m.first_name) AS 'Manager'
    FROM employees e
    INNER JOIN employees m
		ON e.manager_id = m.employee_id
	WHERE m.first_name = 'Bob';
    
-- ** View all employees in a certain department by department name
-- First Name | Last Name | Department
SELECT 
	e.first_name,
    e.last_name,
    d.department
FROM employees e
	INNER JOIN roles r
		ON e.role_id = r.role_id
	INNER JOIN departments d
		ON r.department_id = d.id
WHERE department = 'engineering';

-- ** View all employess and their manager for all departments
-- id | First Name | Last Name | Title | Department | Salary | Manager
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
        ON r.department_id = d.id;
        
-- ****** INSERTS ******
-- ** Insert and employee into employees table
-- Takes: 
-- Role id | manager_id | first_name | last_name
INSERT INTO employees_db.employees (role_id, manager_id, first_name, last_name)
VALUES (2, 2, 'Dorathy','Bellamy'); 

-- ** Insert role
-- Takes:
-- title | salary | department_id
INSERT INTO roles (title, salary, department_id)
VALUE ('Janitor', 100000, );     

-- ** Add department
-- Takes:
-- department
INSERT INTO departments(department)
VALUES ('Janitorial');




  
    
    
    