let db;

const request = indexedDB.open("UserDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;

    db.createObjectStore("users", { keyPath: "id" });
};

request.onsuccess = (e) => {
    db = e.target.result;

    console.log("Database is ready");

    let transaction = db.transaction("users", "readwrite");

    let store = transaction.objectStore("users");

    store.add({ id: 1, name: "Rakesh Singh", age: 26 });

    let getData = store.get(1);

    getData.onsuccess = () => {
        console.log(getData.result);
    };

    fetchAndStore();
};

async function fetchAndStore() {
    const response = await fetch("data.json");
    console.log(response);
    const data = await response.json();

    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");

    data.users.forEach((user) => {
        store.put(user);
    });

    transaction.onsuccess = () => {
        console.log("Data Stored");
    };

    let getData = store.getAll();

    getData.onsuccess = () => {
        console.log(getData.result);
    };

    let output = document.getElementById("output");
    output.innerText = JSON.stringify(data.users, null, 2);
}
