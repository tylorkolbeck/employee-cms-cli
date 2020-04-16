INSERT INTO departments
  (department)
VALUES
  ("Sales"),
  ("Finance"),
  ("Legal"),
  ("Engineering");

INSERT INTO roles
  (title, salary, department_id)
VALUES
  ("Developer", 120000, 4),
  ("Laywer", 150000, 3),
  ("CFO", 80000, 2),
  ("Salesman", 50000, 1);

INSERT INTO employees
  (role_id, first_name, last_name, manager_id)
VALUES
  (1, "Tylor", "Kolbeck", NULL),
  (4, "Bob", "Marley", 1);