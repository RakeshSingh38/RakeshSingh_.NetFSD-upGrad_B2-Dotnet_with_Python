/* 
You are developing a small utility for a teacher to analyze student marks stored in an array. 
 
📌 Requirements 
- Store student marks in an array. 
- Calculate total and average marks using array methods. 
- Display pass/fail result based on average. 
- Use let/const appropriately. 
- Use arrow functions for calculations. 
- Display output using template literals. 
 
🛠️ Technical Constraints 
- Must use array methods like reduce() and map(). 
- Use only ES6+ syntax. 
- No external libraries. 
- All logic must be inside modular JavaScript file.
*/

let marksOfStudents = [100,90,80,70,60,50,40,30]

const totalMarks = marksOfStudents.reduce((prev,current)=> prev+current)
console.log(`Total Marks: ${totalMarks}`)

const avgMarks = totalMarks / marksOfStudents.length;
console.log(`Average Marks: ${avgMarks}`)

const passingMarks = 40;

const passFailResults = marksOfStudents.map((num,i)=> num >= passingMarks ? `Student ${i+1} is Pass (${num} marks)`: `Student ${i+1} is Fail (${num} marks)`);
console.table(passFailResults)

const overAllResult = avgMarks >= passingMarks ? 'Pass' : 'Fail';
console.log(`Overall Result: ${overAllResult}`)



