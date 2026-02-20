/* 
Store 5 subject marks in variables
Calculate total and average
Use if–else ladder to assign grade
Use ternary operator to check:
Pass (average ≥ 40) or Fail
Use loop to:
Print marks one by one
Count how many subjects scored above 75 */

let marks1 = 55,marks2 = 60,marks3 = 75,marks4 = 80,marks5 = 95;

let total = marks1 + marks2 + marks3 + marks4 + marks5;
let average = total / 5;

console.log("total marks:", total);
console.log("average marks:", average);

if (average >= 90)  console.log("Grade: A");
else if (average >= 75) console.log("Grade: B"); 
else if (average >= 40) console.log("Grade: C");
else console.log("Grade: F");

console.log(average >= 40 ? "Pass" : "Fail");

let marksArray = [marks1, marks2, marks3, marks4, marks5];
let marksAbove75 = 0;

for (let i = 0; i < marksArray.length; i++) {
    console.log("Marks for subject", i + 1, ":", marksArray[i]);
    if (marksArray[i] > 75) {
        marksAbove75++;
    }
}
console.log("no of subjects scored above 75:", marksAbove75);


