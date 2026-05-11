let db;

const request = indexedDB.open("UserDB", 2);

request.onupgradeneeded = function (event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", {
            keyPath: "id",
            autoIncrement: true
        });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Database ready");
};

request.onerror = function (event) {
    console.error("Database error:", event.target.error);
};


function saveImage(file) {

    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");

    store.add({  data: file });

    transaction.oncomplete = () => {
        console.log("image stored filnally");
    };

    transaction.onerror = (e) => {
        console.error("error storing image:", e.target.error);
    };
}


function displayLatestImage() {

    const transaction = db.transaction("images", "readonly");
    const store = transaction.objectStore("images");

    const request = store.getAll();

    request.onsuccess = function (event) {

        const images = event.target.result;

        if (!images.length) {
            console.log("no images found in DB");
            return;
        }

        const latest = images[images.length - 1];

        const imageURL = URL.createObjectURL(latest.data);

        document.getElementById("preview").src = imageURL;
    };
}


document.getElementById("input").addEventListener("change", function (e) {

    const file = e.target.files[0];

    if (file) {
        saveImage(file);
    }
});

document.getElementById("show").addEventListener("click", displayLatestImage);