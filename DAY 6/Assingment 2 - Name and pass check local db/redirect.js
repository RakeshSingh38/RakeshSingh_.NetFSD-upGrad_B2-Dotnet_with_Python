/* T1
Create a signup page and a signin page, after signup store all user details in the local storage and a variable named ‘signup = true’ , then check if the user has been signedup before with that variable then redirect the user to the login form
*/

// ->   T2   Another task is to check if details match with the localstorage or not if its then show the main site else login or signup

let isSignUp = false;
function setDetails() {
    let container = document.getElementById("signUp");
    container.addEventListener("submit", function (e) {
        e.preventDefault();
        isSignUp = true;

        const name = document.getElementById("signUpName").value;
        const email = document.getElementById("signUpEmail").value;
        const password = document.getElementById("signUpPassword").value;
        document.getElementById("signUpForm").style.display = "none";
        document.getElementById("signInForm").style.display = "block";

        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("signUp", isSignUp);
        localStorage.setItem("password", password);
    });

    if (localStorage.getItem("signUp") === "true") {
        document.getElementById("signUpForm").style.display = "none";
        document.getElementById("signInForm").style.display = "block";
    }

    let container2 = document.getElementById("signIn");
    container2.addEventListener("submit", function (e) {
        e.preventDefault();
        const enteredEmail = document.getElementById("signInEmail").value;
        const enteredPassword = document.getElementById("signInPassword").value;

        if (
            localStorage.getItem("email") === enteredEmail &&
            localStorage.getItem("password") === enteredPassword
        ) {
            console.log(localStorage.getItem("email"));
            console.log(localStorage.getItem("password"));
            window.location.href =
                "/DAY 6/Assingment 2 - Name and pass check local db/welcome.html";
        }else{
            alert("Invalid credentials")
        }
    });
}

setDetails();
