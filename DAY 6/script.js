/* function saveDetails(){
    let name  = "Rakesh Singh";
    let email = "rakesh@gmail.com";
    // let token= "cssagfsklgajgalgjasgag";

    localStorage.setItem("user-name",name)
    localStorage.setItem("user-email",email)
    // localStorage.setItem("access-token",token)
}
saveDetails();
function getData(){
    let savedName = localStorage.getItem("user-name");

    let savedEmail = localStorage.getItem("user-email");
    console.log(savedName)
    let container = document.getElementById("test");
    if (savedName) container.innerHTML = `<h1>Welcome ${savedName}</h1>`;

    if (savedEmail) {
        let p = document.createElement("p");
        p.textContent = `Email: ${savedEmail}`;
        container.appendChild(p);
    }
}
getData(); */