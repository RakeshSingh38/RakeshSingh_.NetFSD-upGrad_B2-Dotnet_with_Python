let a = 5;
let b = 6;

// console.log(a + b);
// console.log(a - b);
// console.log(a / b);
// console.log(a * b);
// console.log(a % b);

// const marks = 52;

/* if(marks == 18){
    console.log("u r just passed");
}else if(marks <= 50 ){
    console.log("U did well")
}else if(marks > 50){
    console.log("Distinction")
} */



const marks = 80;

/* if (marks >= 75) {
    console.log("Grade A");
} else if (marks >= 60) {
    console.log("Grade B");
} else if (marks >= 40) {
    console.log("Grade C");
} else {
    console.log("Better luck next time");
} */


let user = {
    name: "Rakesh Singh",
    age : 26,
    profilePictureAddress: "https://helloWold/pic/2",
    bio: "Never Give Up",
}

function tellCrow(){
    console.log("My name is",user.name,"age is",user.age,"and bio is",user.bio)
}

// tellCrow();

let purchaseAmount = 25_999;
console.log("calculating the discount")

console.log("Original amount",purchaseAmount);
let userDiscout = {
    discount : function(purchaseAmount){
        if(purchaseAmount>= 5000){
            console.log("U got 20% Discount",purchaseAmount * 0.8);
        } else if(purchaseAmount>=3000){
            console.log("U got 20% Discount",purchaseAmount * 0.9);
        }else{
            console.log("No discount");
        }
    }
}
userDiscout.discount(purchaseAmount);


let grades = "A";

switch(grades){
    case "A":
        console.log("Excellent, we are pleased to have u");
        break;
        
    case "B":
        console.log("Good work");
        break;
        
    case "C":
        console.log("Nice, but we are reconsidering your candidature");
        break;
        
    default:
        console.log("Invalid Grade");
        break;
}

let signal = "Green";

switch(signal){
    case "Green":
        console.log("Go on");
        break;
        
    case "Yellow":
        console.log("Get steady");
        break;

    case "Red":
        console.log("Stop");
        break;

    default:
        console.log("Invalid Signal")
        break;
}










