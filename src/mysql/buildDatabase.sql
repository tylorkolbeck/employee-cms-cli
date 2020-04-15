USE employees_db;

DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE departments
(
  id INT AUTO_INCREMENT NOT NULL,
  department varchar (30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles
(
  role_id int AUTO_INCREMENT NOT NULL,
  title VARCHAR (30) NOT NULL,
  salary DECIMAL (10, 2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (role_id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees
(
  employee_id int AUTO_INCREMENT NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  first_name VARCHAR (30) NOT NULL,
  last_name VARCHAR (30) NOT NULL,
  PRIMARY KEY (employee_id),
  FOREIGN KEY (role_id) REFERENCES roles(role_id),
  FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);

INSERT INTO departments (department)
VALUES 
("Sales"), 
("Finance"),
("Legal"),
("Engineering");

INSERT INTO roles (title, salary, department_id)
VALUES 
("Developer", 120000, 4),
("Laywer", 150000, 3),
("CFO", 80000, 2),
("Salesman", 50000, 1);

INSERT INTO employees (role_id, first_name, last_name, manager_id)
VALUES 
(1, "Tylor", "Kolbeck", null),
(4, "Bob", "Marley", 1);


