function setDetails() {
    let container = document.getElementById("myForm");
    container.addEventListener("submit", function (e) {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        e.preventDefault();
        getDetails();
        window.addEventListener("beforeunload", function () {
            localStorage.clear();
        });
    });
}

setDetails();

function getDetails() {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (name) {
        document.getElementById("output").innerHTML = `
        <p><strong>name:</strong> ${name || "not set"}</p>
        <p><strong>Email:</strong> ${email || "not set"}</p>
        `;
    }
}
