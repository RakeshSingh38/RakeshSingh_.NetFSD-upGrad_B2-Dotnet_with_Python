/* T1
Create a signup page and a signin page, after signup store all user details in the local storage and a variable named ‘signup = true’ , then check if the user has been signedup before with that variable then redirect the user to the login form
*/

// ->   T2   Another task is to check if details match with the localstorage or not if its then show the main site else login or signup

let isSignUp = false;
function setDetails() {
    let container = document.getElementById("signUp");
    container.addEventListener("submit", function () {
        isSignUp = true;

        const name = document.getElementById("signUpName").value;
        const email = document.getElementById("signUpEmail").value;

        document.getElementById("signUpForm").style.display = "none";
        document.getElementById("signInForm").style.display = "block";

        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("signUp", isSignUp);
    });

    if (localStorage.getItem("signUp") === "true") {
        document.getElementById("signUpForm").style.display = "none";
        document.getElementById("signInForm").style.display = "block";
    }
}

setDetails();
