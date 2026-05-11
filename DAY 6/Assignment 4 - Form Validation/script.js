/* Live Form Validation with Events (Level-1) 
Scenario 
Create a simple registration form that validates user input when fields change. 
📌 Requirements 
Fields: 
Name 
Email 
Age 
Use: 
onchange 
onclick 
Validate: 
Name cannot be empty 
Email must contain "@" 
Age must be greater than 18 
Display validation message dynamically. 
Store valid user data in sessionStorage. 
🛠️ Technical Constraints 
Must use inline onchange events. 
Store valid data using: 
sessionStorage.setItem() 
No external libraries. 
Use basic JavaScript only. 
🎯 Learning Outcome 
You will be able to: 
onchange event usage 
Form validation logic 
Difference between localStorage and sessionStorage 
Dynamic DOM updates

// note   learn diff between onclick and its addEvent listener both looks same can be confusing
*/

function validateName(){
    let name = document.getElementById("name").value;
    let output = document.getElementById("output");

    if(name){
        output.style.color = "green";
        output.innerText = "Name is valid";
        return true;
    } else {
        output.style.color = "red";
        output.innerText = "Name cannot be empty";
        return false;
    }
}
function validateEmail(){
    let email = document.getElementById("email").value;
    let output = document.getElementById("output");

    if(email.includes("@")){
        output.style.color = "green";
        output.innerText = "Email is valid";
        return true;
    } else {
        output.style.color = "red";
        output.innerText = "Email is invalid";
        return false;
    }
}

function validateAge(){
    let age = document.getElementById("age").value;
    let output = document.getElementById("output");

    if(age > 18){
        output.style.color = "green";
        output.innerText = "Age is valid";
        return true;
    } else {
        output.style.color = "red";
        output.innerText = "Age must be greater than 18";
        return false;
    }
}

function storeValidData(){
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let age = document.getElementById("age").value;

    if(validateName() && validateEmail() && validateAge()){
        let userData = { name, email, age };
        sessionStorage.setItem("userData", JSON.stringify(userData));
        document.getElementById("output").style.color = "green";
        document.getElementById("output").innerText = "data stored in sessionStorage";
    } else {
        document.getElementById("output").style.color = "red";
        document.getElementById("output").innerText = "error while submitting";
    }
}
