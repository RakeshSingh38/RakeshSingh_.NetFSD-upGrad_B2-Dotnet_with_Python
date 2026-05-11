-- the first command shud be create a new database
-- CREATE DATABASE practDb;
-- create table student2 
-- DDL
-- CREATE TABLE student2 (
--     rn int,
--     name varchar(20),
--     address varchar(50),
--     marks int
-- );
-- add records
-- DML
-- INSERT INTO
--     student2
-- VALUES
--     (1, 'Ajay Kumar Sood', 'A90, Delhi', 90);
-- DQL
-- SELECT *
-- FROM student2;
-- INSERT INTO student2
-- VALUES (2, 'Vijay Kumar Sood', 'A95, Delhi', 78),
--     (3, 'Sagar', 'V67, Old Delhi', 87),
--     (4, 'Ravi Chopra', 'C95, New Delhi', 18),
--     (5, 'Prateek Kumar', 'A845, Delhi', 78);
SELECT *
FROM student2;
-- projetion , display some columns
-- dispaly name , marks 
SELECT name,
    marks
FROM student2;
-- display names, add 10 to marks 
SELECT name,
    marks + 10
FROM student2;
-- change column headings
SELECT name AS 'Student2 Name',
    marks + 10 AS 'Updated Marks'
FROM student2;
SELECT name 'Student2 Name',
    marks + 10 'Updated Marks'
FROM student2;
-- selection , gives some selected records , acheived thru using where clause
SELECT *
FROM student2
WHERE rn = 2;
SELECT *
FROM student2
WHERE rn > 2;
SELECT *
FROM student2
WHERE rn > 2
    AND rn < 4;
-- to replace AND we can use BETWEEN operator
SELECT *
FROM student2
WHERE rn BETWEEN 2 AND 4;
SELECT *
FROM student2
WHERE rn = 1
    OR rn = 3;
-- we can replace or with IN operator
SELECT *
FROM student2
WHERE rn IN (1, 3);
-- where names start with a
-- we use 2 wild card characters
-- % > which means any number of character
-- _ > exacly 1 character
-- LIKE is a pattern matching oprerator 
SELECT *
FROM student2
WHERE name LIKE 'A%';
SELECT *
FROM student2
WHERE name LIKE '%d';
SELECT *
FROM student2
WHERE name LIKE '_____';
SELECT *
FROM student2
WHERE name LIKE '_a%';
-- update records
-- DML
UPDATE student2
SET marks = marks + 10
WHERE rn IN (1, 4);
-- DML
-- delete
DELETE FROM student2
WHERE rn = 9;